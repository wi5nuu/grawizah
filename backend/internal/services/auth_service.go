package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"time"

	"grawizah.com/backend/internal/config"
	"grawizah.com/backend/internal/models"
	"grawizah.com/backend/internal/utils"

	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/github"
)

type AuthService struct {
	db           *sql.DB
	cfg          *config.Config
	emailService *EmailService
}

func NewAuthService(db *sql.DB, cfg *config.Config) *AuthService {
	return &AuthService{
		db:           db,
		cfg:          cfg,
		emailService: NewEmailService(cfg),
	}
}

// validatePassword checks if password meets policy requirements
func (s *AuthService) validatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]`).MatchString(password)

	if !hasUpper {
		return fmt.Errorf("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return fmt.Errorf("password must contain at least one lowercase letter")
	}
	if !hasNumber {
		return fmt.Errorf("password must contain at least one number")
	}
	if !hasSpecial {
		return fmt.Errorf("password must contain at least one special character")
	}

	return nil
}

// checkLoginLockout checks if email is locked due to failed attempts
func (s *AuthService) checkLoginLockout(email string) error {
	var lockedUntil *time.Time
	err := s.db.QueryRow(
		"SELECT locked_until FROM login_attempts WHERE email = $1 AND locked_until > NOW()",
		email,
	).Scan(&lockedUntil)

	if err == nil && lockedUntil != nil {
		minutesLeft := int(lockedUntil.Sub(time.Now()).Minutes())
		return fmt.Errorf("account locked for %d minutes due to multiple failed attempts", minutesLeft)
	}

	return nil
}

// recordFailedLogin tracks failed login attempts
func (s *AuthService) recordFailedLogin(email string) error {
	// Check if record exists
	var attemptCount int
	var lockedUntil *time.Time
	err := s.db.QueryRow(
		"SELECT attempt_count, locked_until FROM login_attempts WHERE email = $1",
		email,
	).Scan(&attemptCount, &lockedUntil)

	if err == sql.ErrNoRows {
		// Create new record
		_, err = s.db.Exec(
			"INSERT INTO login_attempts (id, email, attempt_count, last_attempt) VALUES ($1, $2, 1, NOW())",
			uuid.New(), email,
		)
		return err
	} else if err != nil {
		return err
	}

	// Increment count
	attemptCount++

	if attemptCount >= 3 {
		// Lock for 5 minutes
		lockedUntil := time.Now().Add(5 * time.Minute)
		_, err = s.db.Exec(
			"UPDATE login_attempts SET attempt_count = $1, locked_until = $2, last_attempt = NOW() WHERE email = $3",
			attemptCount, lockedUntil, email,
		)
	} else {
		_, err = s.db.Exec(
			"UPDATE login_attempts SET attempt_count = $1, last_attempt = NOW() WHERE email = $2",
			attemptCount, email,
		)
	}

	return err
}

// clearFailedLogin clears failed attempts on successful login
func (s *AuthService) clearFailedLogin(email string) error {
	_, err := s.db.Exec("DELETE FROM login_attempts WHERE email = $1", email)
	return err
}

// Register creates a new user
func (s *AuthService) Register(req *models.RegisterRequest) (*models.LoginResponse, error) {
	// Validate password
	if err := s.validatePassword(req.Password); err != nil {
		return nil, err
	}

	// Check if user already exists
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
	if err != nil {
		return nil, fmt.Errorf("failed to check user existence: %w", err)
	}
	if exists {
		return nil, fmt.Errorf("user with this email already exists")
	}

	// Validate role
	role := models.UserRole(req.Role)
	if role != models.RoleGuest && role != models.RoleTrader && role != models.RoleBuyer {
		role = models.RoleGuest
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user
	userID := uuid.New()
	query := `
		INSERT INTO users (id, email, full_name, role, password_hash, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, email, full_name, role, created_at
	`

	var user models.UserResponse
	err = s.db.QueryRow(query, userID, req.Email, req.FullName, role, hashedPassword).Scan(
		&user.ID, &user.Email, &user.FullName, &user.Role, &user.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Send welcome email (non-blocking)
	go s.emailService.SendWelcomeEmail(req.Email, req.FullName)

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID.String(), user.Email, string(user.Role), s.cfg.JWTSecret, 24)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	// Generate refresh token
	refreshToken, err := utils.GenerateRefreshToken()
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	return &models.LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
		ExpiresIn:    86400,
	}, nil
}

// Login authenticates a user with optional 2FA enforcement
func (s *AuthService) Login(req *models.LoginRequest) (*models.LoginResponse, error) {
	// Check if account is locked
	if err := s.checkLoginLockout(req.Email); err != nil {
		return nil, err
	}

	var user models.User
	query := `SELECT id, email, full_name, role, password_hash, two_factor_enabled, two_factor_secret, created_at FROM users WHERE email = $1`

	err := s.db.QueryRow(query, req.Email).Scan(
		&user.ID, &user.Email, &user.FullName, &user.Role, &user.Password,
		&user.TwoFactorEnabled, &user.TwoFactorSecret, &user.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			s.recordFailedLogin(req.Email)
			return nil, fmt.Errorf("invalid email or password")
		}
		return nil, fmt.Errorf("failed to query user: %w", err)
	}

	// Check password
	if !utils.CheckPasswordHash(req.Password, user.Password) {
		s.recordFailedLogin(req.Email)
		return nil, fmt.Errorf("invalid email or password")
	}

	// If 2FA is enabled, verify the code
	if user.TwoFactorEnabled {
		if req.TwoFACode == "" {
			// Return a special response indicating 2FA is required
			return nil, fmt.Errorf("2FA code required")
		}

		// Verify 2FA code using TOTP
		secret := ""
		if user.TwoFactorSecret.Valid {
			secret = user.TwoFactorSecret.String
		}
		valid, err := utils.VerifyTOTP(secret, req.TwoFACode)
		if err != nil || !valid {
			s.recordFailedLogin(req.Email)
			return nil, fmt.Errorf("invalid 2FA code")
		}
	}

	// Clear failed attempts
	s.clearFailedLogin(req.Email)

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID.String(), user.Email, string(user.Role), s.cfg.JWTSecret, 24)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	// Generate refresh token
	refreshToken, err := utils.GenerateRefreshToken()
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	userResponse := models.UserResponse{
		ID:               user.ID,
		Email:            user.Email,
		FullName:         user.FullName,
		Role:             user.Role,
		TwoFactorEnabled: user.TwoFactorEnabled,
		CreatedAt:        user.CreatedAt,
	}

	return &models.LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         userResponse,
		ExpiresIn:    86400,
	}, nil
}

// OAuthLogin handles OAuth2 login
func (s *AuthService) OAuthLogin(provider string, code string) (*models.LoginResponse, error) {
	var oauthConfig *oauth2.Config

	switch provider {
	case "google":
		oauthConfig = &oauth2.Config{
			ClientID:     s.cfg.GoogleClientID,
			ClientSecret: s.cfg.GoogleClientSecret,
			RedirectURL:  "http://localhost:8080/api/v1/auth/oauth/callback",
			Scopes:       []string{"email", "profile"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://accounts.google.com/o/oauth2/auth",
				TokenURL: "https://oauth2.googleapis.com/token",
			},
		}
	case "facebook":
		oauthConfig = &oauth2.Config{
			ClientID:     s.cfg.FacebookClientID,
			ClientSecret: s.cfg.FacebookClientSecret,
			RedirectURL:  "http://localhost:8080/api/v1/auth/oauth/callback",
			Scopes:       []string{"email", "public_profile"},
			Endpoint:     facebook.Endpoint,
		}
	case "github":
		oauthConfig = &oauth2.Config{
			ClientID:     s.cfg.GitHubClientID,
			ClientSecret: s.cfg.GitHubClientSecret,
			RedirectURL:  "http://localhost:8080/api/v1/auth/oauth/callback",
			Scopes:       []string{"user:email"},
			Endpoint:     github.Endpoint,
		}
	default:
		return nil, fmt.Errorf("unsupported OAuth provider: %s", provider)
	}

	// Exchange code for token
	ctx := context.Background()
	token, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %w", err)
	}

	// Get user info from OAuth provider
	client := oauthConfig.Client(ctx, token)
	resp, err := client.Get(s.getOAuthUserInfoURL(provider))
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, fmt.Errorf("failed to decode user info: %w", err)
	}

	// Extract email and name
	email, _ := userInfo["email"].(string)
	name, _ := userInfo["name"].(string)
	if name == "" {
		name = email
	}

	// Check if user exists or create new
	var user models.User
	err = s.db.QueryRow("SELECT id, email, full_name, role, created_at FROM users WHERE email = $1", email).Scan(
		&user.ID, &user.Email, &user.FullName, &user.Role, &user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			// Create new user
			user.ID = uuid.New()
			user.Email = email
			user.FullName = name
			user.Role = models.RoleGuest
			user.CreatedAt = time.Now()

			// Generate random password for OAuth users
			randomPassword, _ := utils.GenerateOTP(16)
			hashedPassword, _ := utils.HashPassword(randomPassword)

			_, err = s.db.Exec(
				"INSERT INTO users (id, email, full_name, role, password_hash) VALUES ($1, $2, $3, $4, $5)",
				user.ID, user.Email, user.FullName, user.Role, hashedPassword,
			)
			if err != nil {
				return nil, fmt.Errorf("failed to create user: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to query user: %w", err)
		}
	}

	// Generate JWT token
	jwtToken, err := utils.GenerateToken(user.ID.String(), user.Email, string(user.Role), s.cfg.JWTSecret, 24)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	refreshToken, _ := utils.GenerateRefreshToken()

	userResponse := models.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		FullName:  user.FullName,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	return &models.LoginResponse{
		Token:        jwtToken,
		RefreshToken: refreshToken,
		User:         userResponse,
		ExpiresIn:    86400,
	}, nil
}

func (s *AuthService) getOAuthUserInfoURL(provider string) string {
	switch provider {
	case "google":
		return "https://www.googleapis.com/oauth2/v2/userinfo"
	case "facebook":
		return "https://graph.facebook.com/me?fields=id,name,email"
	case "github":
		return "https://api.github.com/user"
	default:
		return ""
	}
}

// ChangePassword allows users to change their password
func (s *AuthService) ChangePassword(userID string, oldPassword, newPassword string) error {
	// Validate new password
	if err := s.validatePassword(newPassword); err != nil {
		return err
	}

	var currentHash string
	err := s.db.QueryRow("SELECT password_hash FROM users WHERE id = $1", userID).Scan(&currentHash)
	if err != nil {
		return fmt.Errorf("failed to query user: %w", err)
	}

	if !utils.CheckPasswordHash(oldPassword, currentHash) {
		return fmt.Errorf("invalid current password")
	}

	newHash, err := utils.HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	_, err = s.db.Exec("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", newHash, userID)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	return nil
}

// RequestPasswordReset sends a password reset email with a stored token
func (s *AuthService) RequestPasswordReset(email string) error {
	// Check if user exists
	var userID uuid.UUID
	err := s.db.QueryRow("SELECT id FROM users WHERE email = $1", email).Scan(&userID)
	if err != nil {
		// Don't reveal if email exists or not
		return nil
	}

	// Generate reset token and store in DB with 1-hour expiry
	resetToken, _ := utils.GenerateRefreshToken()
	expiry := time.Now().Add(1 * time.Hour)

	// Clean up old tokens for this user
	s.db.Exec("DELETE FROM password_reset_tokens WHERE user_id = $1", userID)

	// Insert new token
	_, err = s.db.Exec(
		"INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)",
		uuid.New(), userID, resetToken, expiry,
	)
	if err != nil {
		// Table might not exist, use users table fallback
		_, err = s.db.Exec(
			"UPDATE users SET password_reset_token = $1, password_reset_token_expiry = $2 WHERE id = $3",
			resetToken, expiry, userID,
		)
	}

	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.cfg.AppURL, resetToken)
	return s.emailService.SendPasswordReset(email, resetURL)
}

// ConfirmPasswordReset validates token and resets password
func (s *AuthService) ConfirmPasswordReset(token, newPassword string) error {
	// Validate new password
	if err := s.validatePassword(newPassword); err != nil {
		return err
	}

	// Find user by token
	var userID uuid.UUID
	err := s.db.QueryRow(
		"SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false",
		token,
	).Scan(&userID)

	if err != nil {
		// Fallback: check users table
		err = s.db.QueryRow(
			"SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_token_expiry > NOW()",
			token,
		).Scan(&userID)
	}

	if err != nil {
		return fmt.Errorf("invalid or expired reset token")
	}

	// Hash new password
	newHash, err := utils.HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Update password
	_, err = s.db.Exec(
		"UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
		newHash, userID,
	)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	// Mark token as used / clear it
	s.db.Exec("UPDATE password_reset_tokens SET used = true WHERE token = $1", token)
	s.db.Exec("UPDATE users SET password_reset_token = NULL, password_reset_token_expiry = NULL WHERE id = $1", userID)

	return nil
}

// Setup2FA enables or disables 2FA for a user
func (s *AuthService) Setup2FA(userID string, enable bool) (string, error) {
	if enable {
		// Generate TOTP secret
		secret, err := utils.GenerateTOTPSecret()
		if err != nil {
			return "", fmt.Errorf("failed to generate 2FA secret: %w", err)
		}

		_, err = s.db.Exec(
			"UPDATE users SET two_factor_secret = $1, two_factor_enabled = true, updated_at = NOW() WHERE id = $2",
			secret, userID,
		)
		if err != nil {
			return "", fmt.Errorf("failed to enable 2FA: %w", err)
		}

		return secret, nil
	}

	// Disable 2FA
	_, err := s.db.Exec(
		"UPDATE users SET two_factor_secret = NULL, two_factor_enabled = false, updated_at = NOW() WHERE id = $1",
		userID,
	)
	if err != nil {
		return "", fmt.Errorf("failed to disable 2FA: %w", err)
	}

	return "", nil
}

// Verify2FA verifies a 2FA code using TOTP
func (s *AuthService) Verify2FA(userID, code string) (bool, error) {
	var secret string
	err := s.db.QueryRow("SELECT two_factor_secret FROM users WHERE id = $1 AND two_factor_enabled = true", userID).Scan(&secret)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, fmt.Errorf("2FA not enabled")
		}
		return false, fmt.Errorf("failed to query 2FA secret: %w", err)
	}

	// Verify using TOTP
	return utils.VerifyTOTP(secret, code)
}

// GetUserProfile retrieves user profile
func (s *AuthService) GetUserProfile(userID uuid.UUID) (*models.UserResponse, error) {
	var user models.User
	err := s.db.QueryRow(`
		SELECT id, email, full_name, role, two_factor_enabled, is_email_verified, created_at
		FROM users WHERE id = $1
	`, userID).Scan(
		&user.ID, &user.Email, &user.FullName, &user.Role,
		&user.TwoFactorEnabled, &user.IsEmailVerified, &user.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to query user: %w", err)
	}

	return &models.UserResponse{
		ID:               user.ID,
		Email:            user.Email,
		FullName:         user.FullName,
		Role:             user.Role,
		TwoFactorEnabled: user.TwoFactorEnabled,
		IsEmailVerified:  user.IsEmailVerified,
		CreatedAt:        user.CreatedAt,
	}, nil
}

// UpdateUserProfile updates user profile
func (s *AuthService) UpdateUserProfile(userID uuid.UUID, fullName string) error {
	_, err := s.db.Exec(
		"UPDATE users SET full_name = $1, updated_at = NOW() WHERE id = $2",
		fullName, userID,
	)
	return err
}

// DeleteUser soft deletes a user
func (s *AuthService) DeleteUser(userID uuid.UUID) error {
	_, err := s.db.Exec("DELETE FROM users WHERE id = $1", userID)
	return err
}

// GetOAuthConfig returns OAuth2 configuration for a provider
func (s *AuthService) GetOAuthConfig(provider string) (*oauth2.Config, error) {
	switch provider {
	case "google":
		return &oauth2.Config{
			ClientID:     s.cfg.GoogleClientID,
			ClientSecret: s.cfg.GoogleClientSecret,
			RedirectURL:  "http://localhost:8080/api/v1/auth/oauth/callback",
			Scopes:       []string{"email", "profile"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://accounts.google.com/o/oauth2/auth",
				TokenURL: "https://oauth2.googleapis.com/token",
			},
		}, nil
	case "facebook":
		return &oauth2.Config{
			ClientID:     s.cfg.FacebookClientID,
			ClientSecret: s.cfg.FacebookClientSecret,
			RedirectURL:  "http://localhost:8080/api/v1/auth/oauth/callback",
			Scopes:       []string{"email", "public_profile"},
			Endpoint:     facebook.Endpoint,
		}, nil
	case "github":
		return &oauth2.Config{
			ClientID:     s.cfg.GitHubClientID,
			ClientSecret: s.cfg.GitHubClientSecret,
			RedirectURL:  "http://localhost:8080/api/v1/auth/oauth/callback",
			Scopes:       []string{"user:email"},
			Endpoint:     github.Endpoint,
		}, nil
	default:
		return nil, fmt.Errorf("unsupported OAuth provider")
	}
}

// GetOAuthURL returns the OAuth authorization URL
func (s *AuthService) GetOAuthURL(provider, state string) (string, error) {
	config, err := s.GetOAuthConfig(provider)
	if err != nil {
		return "", err
	}
	return config.AuthCodeURL(state), nil
}

// Response helper
func writeJSONResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

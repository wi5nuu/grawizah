package handlers

import (
	"encoding/json"
	"net/http"

	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/models"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type AuthHandler struct {
	authService  *services.AuthService
	auditService *services.AuditService
}

func NewAuthHandler(authService *services.AuthService, auditService *services.AuditService) *AuthHandler {
	return &AuthHandler{
		authService:  authService,
		auditService: auditService,
	}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.authService.Register(&req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "User registered successfully", response)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.authService.Login(&req)
	if err != nil {
		// If 2FA is required, return 403 with specific message
		if err.Error() == "2FA code required" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(models.APIResponse{
				Success: false,
				Message: "2FA code required",
				Data: map[string]interface{}{
					"two_fa_required": true,
				},
			})
			return
		}
		sendErrorResponse(w, err.Error(), http.StatusUnauthorized)
		return
	}

	sendSuccessResponse(w, "Login successful", response)

	// Audit log successful login
	if h.auditService != nil && response != nil {
		if userMap, ok := response.User.(map[string]interface{}); ok {
			if userIDStr, ok := userMap["id"].(string); ok {
				userID, err := uuid.Parse(userIDStr)
				if err == nil {
					h.auditService.LogLogin(userID, r.RemoteAddr, r.UserAgent())
				}
			}
		}
	}
}

func (h *AuthHandler) OAuthLogin(w http.ResponseWriter, r *http.Request) {
	var req models.OAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.authService.OAuthLogin(req.Provider, req.Code)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "OAuth login successful", response)
}

func (h *AuthHandler) GetOAuthURL(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	state := r.URL.Query().Get("state")

	url, err := h.authService.GetOAuthURL(provider, state)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "OAuth URL generated", map[string]string{"url": url})
}

func (h *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	var req models.ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.authService.ChangePassword(userID, req.OldPassword, req.NewPassword)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Password changed successfully", nil)
}

func (h *AuthHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req models.PasswordResetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.authService.RequestPasswordReset(req.Email)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Password reset email sent", nil)
}

func (h *AuthHandler) ConfirmPasswordReset(w http.ResponseWriter, r *http.Request) {
	var req models.PasswordResetConfirm
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.authService.ConfirmPasswordReset(req.Token, req.NewPassword)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Password reset successfully", nil)
}

func (h *AuthHandler) Setup2FA(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	var req struct {
		Enable bool `json:"enable"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	secret, err := h.authService.Setup2FA(userID, req.Enable)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"enabled": req.Enable,
		"secret":  secret,
	}
	sendSuccessResponse(w, "2FA updated successfully", response)
}

func (h *AuthHandler) Verify2FA(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(string)

	var req struct {
		Code string `json:"code" binding:"required"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	valid, err := h.authService.Verify2FA(userID, req.Code)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "2FA verified", map[string]bool{"valid": valid})
}

func (h *AuthHandler) Routes(r chi.Router) {
	r.Post("/register", h.Register)
	r.Post("/login", h.Login)
	r.Post("/oauth/login", h.OAuthLogin)
	r.Get("/oauth/url/{provider}", h.GetOAuthURL)
	r.Post("/password/change", h.ChangePassword)
	r.Post("/password/reset", h.ResetPassword)
	r.Post("/password/reset/confirm", h.ConfirmPasswordReset)
	r.Post("/2fa/setup", h.Setup2FA)
	r.Post("/2fa/verify", h.Verify2FA)
}

func sendSuccessResponse(w http.ResponseWriter, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(models.APIResponse{
		Success: false,
		Error:   message,
	})
}

package utils

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares a password with its hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GenerateToken creates a new JWT token
func GenerateToken(userID, email, role string, secret string, expiryHours int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"role":    role,
		"exp":     time.Now().Add(time.Duration(expiryHours) * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// GenerateRefreshToken creates a refresh token
func GenerateRefreshToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", b), nil
}

// ValidateToken validates a JWT token
func ValidateToken(tokenString, secret string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
}

// GenerateOTP generates a random OTP code
func GenerateOTP(length int) (string, error) {
	digits := "0123456789"
	otp := make([]byte, length)

	for i := range otp {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		if err != nil {
			return "", err
		}
		otp[i] = digits[num.Int64()]
	}

	return string(otp), nil
}

// GenerateSessionID generates a simple UUID-like string
func GenerateSessionID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

// GenerateTOTPSecret generates a base32-encoded secret for TOTP
func GenerateTOTPSecret() (string, error) {
	b := make([]byte, 20) // 160-bit secret
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base32.StdEncoding.EncodeToString(b), nil
}

// GenerateTOTP generates a TOTP code for a given secret and time
func GenerateTOTP(secret string, t time.Time) (string, error) {
	// Decode the base32 secret
	key, err := base32.StdEncoding.DecodeString(strings.ToUpper(secret))
	if err != nil {
		return "", fmt.Errorf("failed to decode base32 secret: %w", err)
	}

	// Calculate time step (30 seconds)
	timeStep := int64(t.Unix() / 30)

	// Create HMAC-SHA1
	mac := hmac.New(sha1.New, key)
	bs := make([]byte, 8)
	binary.BigEndian.PutUint64(bs, uint64(timeStep))
	mac.Write(bs)
	hash := mac.Sum(nil)

	// Dynamic truncation
	offset := hash[len(hash)-1] & 0x0f
	code := binary.BigEndian.Uint32(hash[offset : offset+4])
	code &= 0x7fffffff
	code %= 1000000 // 6-digit code

	return fmt.Sprintf("%06d", code), nil
}

// VerifyTOTP verifies a TOTP code with a 30-second window tolerance
func VerifyTOTP(secret, code string) (bool, error) {
	now := time.Now()

	// Check current, previous, and next time window (±30 seconds tolerance)
	for i := -1; i <= 1; i++ {
		t := now.Add(time.Duration(i*30) * time.Second)
		expected, err := GenerateTOTP(secret, t)
		if err != nil {
			return false, err
		}
		if code == expected {
			return true, nil
		}
	}

	return false, nil
}

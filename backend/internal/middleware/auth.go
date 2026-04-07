package middleware

import (
	"context"
	"net/http"
	"strings"

	"grawizah.com/backend/internal/config"
	"grawizah.com/backend/internal/models"
	"grawizah.com/backend/internal/utils"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	UserIDKey       contextKey = "user_id"
	UserEmailKey    contextKey = "user_email"
	UserRoleKey     contextKey = "user_role"
	SubscriptionKey contextKey = "subscription"
)

// AuthMiddleware validates JWT tokens
func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				sendErrorResponse(w, "Authorization header required", http.StatusUnauthorized)
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				sendErrorResponse(w, "Invalid authorization format. Use: Bearer <token>", http.StatusUnauthorized)
				return
			}

			token, err := utils.ValidateToken(tokenString, cfg.JWTSecret)
			if err != nil || !token.Valid {
				sendErrorResponse(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				sendErrorResponse(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}

			userID, ok := claims["user_id"].(string)
			if !ok {
				sendErrorResponse(w, "Invalid user ID in token", http.StatusUnauthorized)
				return
			}

			email, ok := claims["email"].(string)
			if !ok {
				sendErrorResponse(w, "Invalid email in token", http.StatusUnauthorized)
				return
			}

			role, ok := claims["role"].(string)
			if !ok {
				sendErrorResponse(w, "Invalid role in token", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			ctx = context.WithValue(ctx, UserEmailKey, email)
			ctx = context.WithValue(ctx, UserRoleKey, role)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RoleMiddleware checks if user has required role
func RoleMiddleware(requiredRoles ...models.UserRole) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userRoleStr := r.Context().Value(UserRoleKey).(string)
			userRole := models.UserRole(userRoleStr)

			for _, role := range requiredRoles {
				if userRole == role {
					next.ServeHTTP(w, r)
					return
				}
			}

			sendErrorResponse(w, "Insufficient permissions", http.StatusForbidden)
		})
	}
}

// OptionalAuthMiddleware adds user info to context if token is present, but doesn't require it
func OptionalAuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				tokenString := strings.TrimPrefix(authHeader, "Bearer ")
				token, err := utils.ValidateToken(tokenString, cfg.JWTSecret)

				if err == nil && token.Valid {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						userID := claims["user_id"].(string)
						email := claims["email"].(string)
						role := claims["role"].(string)

						ctx := context.WithValue(r.Context(), UserIDKey, userID)
						ctx = context.WithValue(ctx, UserEmailKey, email)
						ctx = context.WithValue(ctx, UserRoleKey, role)
						r = r.WithContext(ctx)
					}
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

func sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write([]byte(`{"success":false,"error":"` + message + `"}`))
}

package handlers

import (
	"encoding/json"
	"net/http"

	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type UserProfileHandler struct {
	authService *services.AuthService
}

func NewUserProfileHandler(authService *services.AuthService) *UserProfileHandler {
	return &UserProfileHandler{authService: authService}
}

type UserProfileResponse struct {
	ID               uuid.UUID `json:"id"`
	Email            string    `json:"email"`
	FullName         string    `json:"full_name"`
	Role             string    `json:"role"`
	TwoFactorEnabled bool      `json:"two_factor_enabled"`
	IsEmailVerified  bool      `json:"is_email_verified"`
	CreatedAt        string    `json:"created_at"`
}

func (h *UserProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	profile, err := h.authService.GetUserProfile(userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Profile retrieved successfully", profile)
}

func (h *UserProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	var req struct {
		FullName string `json:"full_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.authService.UpdateUserProfile(userID, req.FullName)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Profile updated successfully", nil)
}

func (h *UserProfileHandler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	err := h.authService.DeleteUser(userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Account deleted successfully", nil)
}

func (h *UserProfileHandler) Routes(r chi.Router) {
	r.Get("/", h.GetProfile)
	r.Put("/", h.UpdateProfile)
	r.Delete("/", h.DeleteAccount)
}

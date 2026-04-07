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

type SubscriptionHandler struct {
	subscriptionService *services.SubscriptionService
}

func NewSubscriptionHandler(subscriptionService *services.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{subscriptionService: subscriptionService}
}

func (h *SubscriptionHandler) GetSubscription(w http.ResponseWriter, r *http.Request) {
	companyIDStr := r.URL.Query().Get("company_id")
	if companyIDStr == "" {
		// Try to get from user context
		userIDStr := r.Context().Value(middleware.UserIDKey)
		if userIDStr != nil {
			companyIDStr = userIDStr.(string)
		}
	}

	if companyIDStr == "" {
		sendErrorResponse(w, "company_id is required", http.StatusBadRequest)
		return
	}

	companyID, err := uuid.Parse(companyIDStr)
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	subscription, err := h.subscriptionService.GetSubscription(companyID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Subscription retrieved successfully", subscription)
}

func (h *SubscriptionHandler) UpgradeSubscription(w http.ResponseWriter, r *http.Request) {
	companyIDStr := r.URL.Query().Get("company_id")
	if companyIDStr == "" {
		userIDStr := r.Context().Value(middleware.UserIDKey)
		if userIDStr != nil {
			companyIDStr = userIDStr.(string)
		}
	}

	if companyIDStr == "" {
		sendErrorResponse(w, "company_id is required", http.StatusBadRequest)
		return
	}

	companyID, err := uuid.Parse(companyIDStr)
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	var req models.SubscriptionUpgradeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	subscription, err := h.subscriptionService.UpgradeSubscription(companyID, req.Plan)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Subscription upgraded successfully", subscription)
}

func (h *SubscriptionHandler) CancelSubscription(w http.ResponseWriter, r *http.Request) {
	companyIDStr := r.URL.Query().Get("company_id")
	if companyIDStr == "" {
		userIDStr := r.Context().Value(middleware.UserIDKey)
		if userIDStr != nil {
			companyIDStr = userIDStr.(string)
		}
	}

	if companyIDStr == "" {
		sendErrorResponse(w, "company_id is required", http.StatusBadRequest)
		return
	}

	companyID, err := uuid.Parse(companyIDStr)
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	err = h.subscriptionService.CancelSubscription(companyID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Subscription cancelled successfully", nil)
}

func (h *SubscriptionHandler) Routes(r chi.Router) {
	r.Get("/", h.GetSubscription)
	r.Post("/upgrade", h.UpgradeSubscription)
	r.Post("/cancel", h.CancelSubscription)
}

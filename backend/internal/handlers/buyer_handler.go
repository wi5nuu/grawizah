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

type BuyerHandler struct {
	buyerService *services.BuyerService
}

func NewBuyerHandler(buyerService *services.BuyerService) *BuyerHandler {
	return &BuyerHandler{buyerService: buyerService}
}

func (h *BuyerHandler) CreateBuyerProfile(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	var req models.BuyerProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	profile, err := h.buyerService.CreateBuyerProfile(userID, &req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Buyer profile created successfully", profile)
}

func (h *BuyerHandler) GetBuyerProfile(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	profile, err := h.buyerService.GetBuyerProfile(userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Buyer profile retrieved successfully", profile)
}

func (h *BuyerHandler) UpdateBuyerProfile(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	var req models.BuyerProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	profile, err := h.buyerService.UpdateBuyerProfile(userID, &req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Buyer profile updated successfully", profile)
}

func (h *BuyerHandler) GetSupplierComparison(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	supplierIDs := r.URL.Query().Get("suppliers")
	if supplierIDs == "" {
		sendErrorResponse(w, "supplier_ids query parameter is required", http.StatusBadRequest)
		return
	}

	// Parse comma-separated supplier IDs
	var ids []string
	// Simple split for now
	ids = append(ids, supplierIDs)

	comparison, err := h.buyerService.GetSupplierComparison(userID, ids)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Supplier comparison retrieved successfully", comparison)
}

func (h *BuyerHandler) Routes(r chi.Router) {
	r.Post("/profile", h.CreateBuyerProfile)
	r.Get("/profile", h.GetBuyerProfile)
	r.Put("/profile", h.UpdateBuyerProfile)
	r.Get("/compare-suppliers", h.GetSupplierComparison)
}

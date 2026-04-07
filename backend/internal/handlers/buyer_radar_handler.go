package handlers

import (
	"net/http"

	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type BuyerRadarHandler struct {
	buyerRadarService *services.BuyerRadarService
}

func NewBuyerRadarHandler(buyerRadarService *services.BuyerRadarService) *BuyerRadarHandler {
	return &BuyerRadarHandler{buyerRadarService: buyerRadarService}
}

func (h *BuyerRadarHandler) GetBuyerRadar(w http.ResponseWriter, r *http.Request) {
	country := chi.URLParam(r, "country")
	if country == "" {
		sendErrorResponse(w, "Country parameter is required", http.StatusBadRequest)
		return
	}

	buyers, err := h.buyerRadarService.GetBuyerRadar(country)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Buyer radar data retrieved successfully", buyers)
}

func (h *BuyerRadarHandler) GetMarketInsights(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	country := r.URL.Query().Get("country")

	if category == "" || country == "" {
		sendErrorResponse(w, "Category and country parameters are required", http.StatusBadRequest)
		return
	}

	insight, err := h.buyerRadarService.GetMarketInsights(category, country)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Market insights retrieved successfully", insight)
}

func (h *BuyerRadarHandler) GetMarketAlerts(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	unreadOnly := r.URL.Query().Get("unread") == "true"

	alerts, err := h.buyerRadarService.GetMarketAlerts(userID, unreadOnly)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Market alerts retrieved successfully", alerts)
}

func (h *BuyerRadarHandler) MarkAlertAsRead(w http.ResponseWriter, r *http.Request) {
	alertID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid alert ID", http.StatusBadRequest)
		return
	}

	err = h.buyerRadarService.MarkAlertAsRead(alertID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Alert marked as read", nil)
}

func (h *BuyerRadarHandler) Routes(r chi.Router) {
	r.Get("/buyers/{country}", h.GetBuyerRadar)
	r.Get("/insights", h.GetMarketInsights)
	r.Get("/alerts", h.GetMarketAlerts)
	r.Post("/alerts/{id}/read", h.MarkAlertAsRead)
}

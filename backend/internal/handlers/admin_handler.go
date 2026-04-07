package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/models"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type AdminHandler struct {
	companyService    *services.CompanyService
	subscriptionService *services.SubscriptionService
}

func NewAdminHandler(companyService *services.CompanyService, subscriptionService *services.SubscriptionService) *AdminHandler {
	return &AdminHandler{
		companyService:    companyService,
		subscriptionService: subscriptionService,
	}
}

func (h *AdminHandler) ListPendingVerifications(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	companies, err := h.companyService.ListPendingVerification(page, limit)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Pending verifications retrieved", companies)
}

func (h *AdminHandler) VerifyCompany(w http.ResponseWriter, r *http.Request) {
	adminIDStr := r.Context().Value(middleware.UserIDKey).(string)
	adminID, _ := uuid.Parse(adminIDStr)

	companyID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	var req models.AdminVerificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.companyService.VerifyCompany(companyID, adminID, req.IsApproved)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	message := "Company verified successfully"
	if !req.IsApproved {
		message = "Company verification rejected"
	}

	sendSuccessResponse(w, message, nil)
}

func (h *AdminHandler) Routes(r chi.Router) {
	r.Get("/pending", h.ListPendingVerifications)
	r.Post("/verify/{id}", h.VerifyCompany)
}

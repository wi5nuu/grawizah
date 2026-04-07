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

type CompanyHandler struct {
	companyService *services.CompanyService
}

func NewCompanyHandler(companyService *services.CompanyService) *CompanyHandler {
	return &CompanyHandler{companyService: companyService}
}

func (h *CompanyHandler) CreateCompany(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	var req models.CompanyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	company, err := h.companyService.CreateCompany(&req, userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Company created successfully", company)
}

func (h *CompanyHandler) GetCompany(w http.ResponseWriter, r *http.Request) {
	companyID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	company, err := h.companyService.GetCompany(companyID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Company retrieved successfully", company)
}

func (h *CompanyHandler) GetMyCompany(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	company, err := h.companyService.GetCompanyByOwnerID(userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if company == nil {
		sendErrorResponse(w, "Company not found", http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Company retrieved successfully", company)
}

func (h *CompanyHandler) UpdateCompany(w http.ResponseWriter, r *http.Request) {
	companyID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	var req models.CompanyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	company, err := h.companyService.UpdateCompany(companyID, &req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Company updated successfully", company)
}

func (h *CompanyHandler) Routes(r chi.Router) {
	r.Post("/", h.CreateCompany)
	r.Get("/my", h.GetMyCompany)
	r.Get("/{id}", h.GetCompany)
	r.Put("/{id}", h.UpdateCompany)
}

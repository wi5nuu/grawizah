package handlers

import (
	"encoding/json"
	"net/http"

	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type DocumentHandler struct {
	documentService *services.DocumentService
	companyService  *services.CompanyService
}

func NewDocumentHandler(documentService *services.DocumentService, companyService *services.CompanyService) *DocumentHandler {
	return &DocumentHandler{
		documentService: documentService,
		companyService:  companyService,
	}
}

func (h *DocumentHandler) GetMyDocuments(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	// Get company ID for this user
	company, err := h.companyService.GetCompanyByOwnerID(userID)
	if err != nil || company == nil {
		sendErrorResponse(w, "Failed to find company for user", http.StatusNotFound)
		return
	}

	docs, err := h.documentService.GetCompanyDocuments(company.ID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Documents retrieved successfully", docs)
}

func (h *DocumentHandler) UploadDocument(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	company, err := h.companyService.GetCompanyByOwnerID(userID)
	if err != nil || company == nil {
		sendErrorResponse(w, "Failed to find company for user", http.StatusNotFound)
		return
	}

	// In a real app, we'd handle multipart file upload here. 
	// To keep it simple for this simulation, we'll expect JSON with file info.
	var req struct {
		DocType  string `json:"doc_type"`
		FileName string `json:"file_name"`
		FileURL  string `json:"file_url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.DocType == "" || req.FileName == "" {
		sendErrorResponse(w, "Document type and file name are required", http.StatusBadRequest)
		return
	}

	err = h.documentService.UploadDocument(company.ID, req.DocType, req.FileName, req.FileURL)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Document uploaded successfully", nil)
}

func (h *DocumentHandler) Routes(r chi.Router) {
	r.Get("/my", h.GetMyDocuments)
	r.Post("/upload", h.UploadDocument)
}

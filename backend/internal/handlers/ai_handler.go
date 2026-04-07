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

type AIHandler struct {
	groqService     *services.GroqService
	productService  *services.ProductService
}

func NewAIHandler(groqService *services.GroqService, productService *services.ProductService) *AIHandler {
	return &AIHandler{
		groqService:    groqService,
		productService: productService,
	}
}

func (h *AIHandler) ClassifyHSCode(w http.ResponseWriter, r *http.Request) {
	var req models.HSCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.groqService.ClassifyHSCode(&req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Determine role and user ID
	roleStr, _ := r.Context().Value(middleware.UserRoleKey).(string)
	userIDStr, _ := r.Context().Value(middleware.UserIDKey).(string)
	
	// Mask result if guest
	if roleStr == string(models.RoleGuest) || roleStr == "" {
		if len(response.HSCode) > 3 {
			response.HSCode = response.HSCode[:3] + ".xxx"
		}
		response.Explanation = "Preview mode: Sign in to view full HS Code and compliance details."
	}

	// Save to AI history if user is authenticated
	if userIDStr != "" {
		userID, _ := uuid.Parse(userIDStr)
		payload, _ := json.Marshal(req)
		aiResponse, _ := json.Marshal(response)

		h.groqService.SaveAIHistory(&models.AIComplianceHistory{
			UserID:          userID,
			FeatureType:     models.FeatureHSCode,
			InputPayload:    payload,
			AIResponse:      aiResponse,
			ConfidenceScore: response.ConfidenceScore,
		})
	}

	sendSuccessResponse(w, "HS Code classified successfully", response)
}

func (h *AIHandler) CheckSanction(w http.ResponseWriter, r *http.Request) {
	var req models.SanctionCheckRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.groqService.CheckSanction(&req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Save to AI history
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	payload, _ := json.Marshal(req)
	aiResponse, _ := json.Marshal(response)

	h.groqService.SaveAIHistory(&models.AIComplianceHistory{
		UserID:      userID,
		FeatureType: models.FeatureSanction,
		InputPayload: payload,
		AIResponse:  aiResponse,
	})

	sendSuccessResponse(w, "Sanction check completed", response)
}

func (h *AIHandler) ExtractDocumentData(w http.ResponseWriter, r *http.Request) {
	var req models.OCRDocumentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.groqService.ExtractDocumentData(&req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Save to AI history
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	payload, _ := json.Marshal(req)
	aiResponse, _ := json.Marshal(response)

	h.groqService.SaveAIHistory(&models.AIComplianceHistory{
		UserID:          userID,
		FeatureType:     models.FeatureOCR,
		InputPayload:    payload,
		AIResponse:      aiResponse,
		ConfidenceScore: response.ConfidenceScore,
	})

	sendSuccessResponse(w, "Document data extracted successfully", response)
}

func (h *AIHandler) Routes(r chi.Router) {
	r.Post("/hs-code", h.ClassifyHSCode)
	r.Post("/sanction-check", h.CheckSanction)
	r.Post("/ocr", h.ExtractDocumentData)
}

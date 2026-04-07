package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/models"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type InquiryHandler struct {
	inquiryService *services.InquiryService
}

func NewInquiryHandler(inquiryService *services.InquiryService) *InquiryHandler {
	return &InquiryHandler{inquiryService: inquiryService}
}

func (h *InquiryHandler) CreateInquiry(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	var req models.InquiryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.inquiryService.CreateInquiry(&req, userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Inquiry created successfully", response)
}

func (h *InquiryHandler) GetInquiry(w http.ResponseWriter, r *http.Request) {
	inquiryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid inquiry ID", http.StatusBadRequest)
		return
	}

	response, err := h.inquiryService.GetInquiry(inquiryID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Inquiry retrieved successfully", response)
}

func (h *InquiryHandler) ListInquiries(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)
	userRole := r.Context().Value(middleware.UserRoleKey).(string)

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	inquiries, err := h.inquiryService.ListInquiries(userID, userRole, page, limit)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Inquiries retrieved successfully", inquiries)
}

func (h *InquiryHandler) CreateMessage(w http.ResponseWriter, r *http.Request) {
	inquiryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid inquiry ID", http.StatusBadRequest)
		return
	}

	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	var req models.MessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	message, err := h.inquiryService.CreateMessage(inquiryID, userID, req.Message)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Message sent successfully", message)
}

func (h *InquiryHandler) GetMessages(w http.ResponseWriter, r *http.Request) {
	inquiryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid inquiry ID", http.StatusBadRequest)
		return
	}

	messages, err := h.inquiryService.GetMessages(inquiryID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Messages retrieved successfully", messages)
}

func (h *InquiryHandler) CloseInquiry(w http.ResponseWriter, r *http.Request) {
	inquiryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid inquiry ID", http.StatusBadRequest)
		return
	}

	err = h.inquiryService.CloseInquiry(inquiryID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Inquiry closed successfully", nil)
}

func (h *InquiryHandler) GetWhatsAppLink(w http.ResponseWriter, r *http.Request) {
	inquiryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid inquiry ID", http.StatusBadRequest)
		return
	}

	// Get inquiry details to find receiver
	_, err = h.inquiryService.GetInquiry(inquiryID)
	if err != nil {
		sendErrorResponse(w, "Inquiry not found", http.StatusNotFound)
		return
	}

	// Get company WhatsApp number (from company profile)
	// In production, this would be stored in companies table
	whatsappNumber := "+6281234567890" // Placeholder

	message := fmt.Sprintf("Hello, I'm contacting you via Grawizah. Inquiry ID: %s", inquiryID)
	encodedMessage := url.QueryEscape(message)
	whatsappURL := fmt.Sprintf("https://wa.me/%s?text=%s", whatsappNumber, encodedMessage)

	sendSuccessResponse(w, "WhatsApp bridge URL generated", map[string]string{
		"url":   whatsappURL,
		"phone": whatsappNumber,
	})
}

func (h *InquiryHandler) Routes(r chi.Router) {
	r.Post("/", h.CreateInquiry)
	r.Get("/", h.ListInquiries)
	r.Get("/{id}", h.GetInquiry)
	r.Post("/{id}/messages", h.CreateMessage)
	r.Get("/{id}/messages", h.GetMessages)
	r.Post("/{id}/close", h.CloseInquiry)
	r.Get("/{id}/whatsapp", h.GetWhatsAppLink)
}

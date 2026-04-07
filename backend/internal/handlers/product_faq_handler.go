package handlers

import (
	"encoding/json"
	"net/http"

	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ProductFAQHandler struct {
	productService *services.ProductService
}

func NewProductFAQHandler(productService *services.ProductService) *ProductFAQHandler {
	return &ProductFAQHandler{productService: productService}
}

type FAQRequest struct {
	Question string `json:"question" binding:"required"`
	Answer   string `json:"answer" binding:"required"`
}

func (h *ProductFAQHandler) AddFAQ(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "product_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	var req FAQRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.productService.AddProductFAQ(productID, req.Question, req.Answer)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "FAQ added successfully", nil)
}

func (h *ProductFAQHandler) GetFAQ(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "product_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	faq, err := h.productService.GetProductFAQ(productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "FAQ retrieved successfully", faq)
}

func (h *ProductFAQHandler) DeleteFAQ(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "product_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	faqID, err := uuid.Parse(chi.URLParam(r, "faq_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid FAQ ID", http.StatusBadRequest)
		return
	}

	err = h.productService.DeleteProductFAQ(faqID, productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "FAQ deleted successfully", nil)
}

func (h *ProductFAQHandler) Routes(r chi.Router) {
	r.Get("/{product_id}", h.GetFAQ)
	r.Post("/{product_id}", h.AddFAQ)
	r.Delete("/{product_id}/{faq_id}", h.DeleteFAQ)
}

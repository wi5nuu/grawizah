package handlers

import (
	"encoding/json"
	"net/http"

	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ProductSpecHandler struct {
	productService *services.ProductService
}

func NewProductSpecHandler(productService *services.ProductService) *ProductSpecHandler {
	return &ProductSpecHandler{productService: productService}
}

type SpecRequest struct {
	Key   string `json:"key" binding:"required"`
	Value string `json:"value" binding:"required"`
}

func (h *ProductSpecHandler) AddSpecification(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "product_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	var req SpecRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.productService.AddSpecification(productID, req.Key, req.Value)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Specification added successfully", nil)
}

func (h *ProductSpecHandler) GetSpecifications(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "product_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	specs, err := h.productService.GetSpecifications(productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Specifications retrieved successfully", specs)
}

func (h *ProductSpecHandler) DeleteSpecification(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "product_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	specID, err := uuid.Parse(chi.URLParam(r, "spec_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid spec ID", http.StatusBadRequest)
		return
	}

	err = h.productService.DeleteSpecification(specID, productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Specification deleted successfully", nil)
}

func (h *ProductSpecHandler) Routes(r chi.Router) {
	r.Get("/{product_id}", h.GetSpecifications)
	r.Post("/{product_id}", h.AddSpecification)
	r.Delete("/{product_id}/{spec_id}", h.DeleteSpecification)
}

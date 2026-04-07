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

type ProductHandler struct {
	productService *services.ProductService
}

func NewProductHandler(productService *services.ProductService) *ProductHandler {
	return &ProductHandler{productService: productService}
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	companyIDStr := r.Context().Value(middleware.UserIDKey).(string)
	// Get company ID from user
	companyID, err := uuid.Parse(companyIDStr)
	if err != nil {
		sendErrorResponse(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var req models.ProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.productService.CreateProduct(&req, companyID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Product created successfully", response)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	userID := ""
	userRole := "guest"

	if id := r.Context().Value(middleware.UserIDKey); id != nil {
		userID = id.(string)
	}
	if role := r.Context().Value(middleware.UserRoleKey); role != nil {
		userRole = role.(string)
	}

	response, err := h.productService.GetProduct(productID, userID, userRole)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Product retrieved successfully", response)
}

func (h *ProductHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	filter := &models.ProductFilter{
		Category: r.URL.Query().Get("category"),
		Search:   r.URL.Query().Get("search"),
		Country:  r.URL.Query().Get("country"),
	}

	if minPrice := r.URL.Query().Get("min_price"); minPrice != "" {
		filter.MinPrice, _ = strconv.ParseFloat(minPrice, 64)
	}
	if maxPrice := r.URL.Query().Get("max_price"); maxPrice != "" {
		filter.MaxPrice, _ = strconv.ParseFloat(maxPrice, 64)
	}
	if isVerified := r.URL.Query().Get("is_verified"); isVerified != "" {
		val := isVerified == "true"
		filter.IsVerified = &val
	}
	if page := r.URL.Query().Get("page"); page != "" {
		filter.Page, _ = strconv.Atoi(page)
	}
	if limit := r.URL.Query().Get("limit"); limit != "" {
		filter.Limit, _ = strconv.Atoi(limit)
	}

	response, err := h.productService.ListProducts(filter)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Products retrieved successfully", response)
}

func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	companyIDStr := r.Context().Value(middleware.UserIDKey).(string)
	companyID, _ := uuid.Parse(companyIDStr)

	var req models.ProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := h.productService.UpdateProduct(productID, companyID, &req)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Product updated successfully", response)
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	companyIDStr := r.Context().Value(middleware.UserIDKey).(string)
	companyID, _ := uuid.Parse(companyIDStr)

	err = h.productService.DeleteProduct(productID, companyID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	sendSuccessResponse(w, "Product deleted successfully", nil)
}

func (h *ProductHandler) SuggestHSCode(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	response, err := h.productService.SuggestHSCode(productID, userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "HS Code suggestion generated", response)
}

func (h *ProductHandler) GetCompanyProducts(w http.ResponseWriter, r *http.Request) {
	companyID, err := uuid.Parse(chi.URLParam(r, "company_id"))
	if err != nil {
		sendErrorResponse(w, "Invalid company ID", http.StatusBadRequest)
		return
	}

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	response, err := h.productService.GetCompanyProducts(companyID, page, limit)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Company products retrieved successfully", response)
}

func (h *ProductHandler) GetProductDetail(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	detail, err := h.productService.GetProductDetail360(productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusNotFound)
		return
	}

	sendSuccessResponse(w, "Product detail retrieved successfully", detail)
}

func (h *ProductHandler) GetRelatedProducts(w http.ResponseWriter, r *http.Request) {
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit <= 0 {
		limit = 5
	}

	products, err := h.productService.GetRelatedProductsAI(productID, limit)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Related products retrieved successfully", products)
}

func (h *ProductHandler) SaveProduct(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	err = h.productService.SaveProduct(userID, productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Product saved to comparison list", nil)
}

func (h *ProductHandler) UnsaveProduct(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		sendErrorResponse(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	err = h.productService.UnsaveProduct(userID, productID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Product removed from comparison list", nil)
}

func (h *ProductHandler) GetSavedProducts(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value(middleware.UserIDKey).(string)
	userID, _ := uuid.Parse(userIDStr)

	products, err := h.productService.GetSavedProducts(userID)
	if err != nil {
		sendErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sendSuccessResponse(w, "Saved products retrieved successfully", products)
}

func (h *ProductHandler) Routes(r chi.Router) {
	r.Post("/", h.CreateProduct)
	r.Get("/", h.ListProducts)
	r.Get("/saved", h.GetSavedProducts)
	r.Get("/{id}", h.GetProduct)
	r.Get("/{id}/detail", h.GetProductDetail)
	r.Get("/{id}/related", h.GetRelatedProducts)
	r.Put("/{id}", h.UpdateProduct)
	r.Delete("/{id}", h.DeleteProduct)
	r.Post("/{id}/hs-code", h.SuggestHSCode)
	r.Post("/{id}/save", h.SaveProduct)
	r.Delete("/{id}/save", h.UnsaveProduct)
	r.Get("/company/{company_id}", h.GetCompanyProducts)
}

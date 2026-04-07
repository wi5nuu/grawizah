package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID                uuid.UUID       `json:"id" db:"id"`
	CompanyID         uuid.UUID       `json:"company_id" db:"company_id"`
	Title             string          `json:"title" db:"title"`
	Description       string          `json:"description" db:"description"`
	Category          string          `json:"category" db:"category"`
	HSCodeManual      string          `json:"hs_code_manual" db:"hs_code_manual"`
	HSCodeAISuggested string          `json:"hs_code_ai_suggested" db:"hs_code_ai_suggested"`
	PriceMin          float64         `json:"price_min" db:"price_est_min"`
	PriceMax          float64         `json:"price_max" db:"price_est_max"`
	Currency          string          `json:"currency" db:"currency"`
	ImagesURL         json.RawMessage `json:"images_url" db:"images_url"`
	IsActive          bool            `json:"is_active" db:"is_active"`
	CreatedAt         time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time       `json:"updated_at" db:"updated_at"`
}

type ProductRequest struct {
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Category    string   `json:"category" binding:"required"`
	HSCode      string   `json:"hs_code_manual"`
	PriceMin    float64  `json:"price_min" binding:"required"`
	PriceMax    float64  `json:"price_max" binding:"required"`
	Currency    string   `json:"currency"`
	ImagesURL   []string `json:"images_url"`
}

type ProductResponse struct {
	ID                uuid.UUID       `json:"id"`
	CompanyID         uuid.UUID       `json:"company_id"`
	Title             string          `json:"title"`
	Description       string          `json:"description"`
	Category          string          `json:"category"`
	HSCodeManual      string          `json:"hs_code_manual"`
	HSCodeAISuggested string          `json:"hs_code_ai_suggested"`
	PriceMin          float64         `json:"price_min"`
	PriceMax          float64         `json:"price_max"`
	Currency          string          `json:"currency"`
	ImagesURL         json.RawMessage `json:"images_url"`
	IsActive          bool            `json:"is_active"`
	CompanyName       string          `json:"company_name,omitempty"`
	IsVerified        bool            `json:"is_verified"`
	IsPremium         bool            `json:"is_premium"`
	CreatedAt         time.Time       `json:"created_at"`
}

type ProductFilter struct {
	Category   string  `form:"category"`
	Search     string  `form:"search"`
	MinPrice   float64 `form:"min_price"`
	MaxPrice   float64 `form:"max_price"`
	Country    string  `form:"country"`
	IsVerified *bool   `form:"is_verified"`
	Page       int     `form:"page"`
	Limit      int     `form:"limit"`
}

func (pf *ProductFilter) GetOffset() int {
	if pf.Page <= 0 {
		pf.Page = 1
	}
	if pf.Limit <= 0 {
		pf.Limit = 20
	}
	return (pf.Page - 1) * pf.Limit
}

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Total      int64       `json:"total"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	TotalPages int         `json:"total_pages"`
}

type Specification struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type ProductDetail struct {
	Product
	Specifications  []Specification `json:"specifications,omitempty"`
	SupplierInfo    *SupplierInfo   `json:"supplier_info,omitempty"`
	FAQ             []FAQ           `json:"faq,omitempty"`
	RelatedProducts []uuid.UUID     `json:"related_products,omitempty"`
}

type SupplierInfo struct {
	CompanyName string  `json:"company_name"`
	IsVerified  bool    `json:"is_verified"`
	Rating      float64 `json:"rating"`
	Country     string  `json:"country"`
}

type FAQ struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

func NewNullTime(t time.Time) sql.NullTime {
	if t.IsZero() {
		return sql.NullTime{}
	}
	return sql.NullTime{Time: t, Valid: true}
}

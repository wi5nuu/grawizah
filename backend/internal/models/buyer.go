package models

import (
	"time"

	"github.com/google/uuid"
)

type BuyerProfile struct {
	ID               uuid.UUID `json:"id" db:"id"`
	CompanyName      string    `json:"company_name" db:"company_name"`
	CountryInterest  string    `json:"country_interest" db:"country_interest"`
	TradePreferences []string  `json:"trade_preferences" db:"trade_preferences"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`
}

type BuyerProfileRequest struct {
	CompanyName      string   `json:"company_name"`
	CountryInterest  string   `json:"country_interest"`
	TradePreferences []string `json:"trade_preferences"`
}

type SupplierComparison struct {
	ID           uuid.UUID `json:"id"`
	CompanyName  string    `json:"company_name"`
	IsVerified   bool      `json:"is_verified"`
	Country      string    `json:"country"`
	ProductCount int       `json:"product_count"`
	AvgPrice     float64   `json:"avg_price"`
	Rating       float64   `json:"rating,omitempty"`
	LegalDocs    int       `json:"legal_docs_count"`
}

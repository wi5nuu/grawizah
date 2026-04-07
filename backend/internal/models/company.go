package models

import (
	"time"

	"github.com/google/uuid"
)

type Company struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	OwnerID      uuid.UUID  `json:"owner_id" db:"owner_id"`
	CompanyName  string     `json:"company_name" db:"company_name"`
	TaxID        string     `json:"tax_id" db:"tax_id"`
	Address      string     `json:"address" db:"address"`
	City         string     `json:"city" db:"city"`
	Country      string     `json:"country" db:"country"`
	IsVerified   bool       `json:"is_verified" db:"is_verified"`
	VerifiedBy   *uuid.UUID `json:"verified_by,omitempty" db:"verified_by"`
	VerifiedAt   *time.Time `json:"verified_at,omitempty" db:"verified_at"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

type CompanyRequest struct {
	CompanyName string `json:"company_name" binding:"required"`
	TaxID       string `json:"tax_id" binding:"required"`
	Address     string `json:"address" binding:"required"`
	City        string `json:"city" binding:"required"`
	Country     string `json:"country" binding:"required"`
}

type CompanyResponse struct {
	ID           uuid.UUID  `json:"id"`
	OwnerID      uuid.UUID  `json:"owner_id"`
	CompanyName  string     `json:"company_name"`
	TaxID        string     `json:"tax_id"`
	Address      string     `json:"address"`
	City         string     `json:"city"`
	Country      string     `json:"country"`
	IsVerified   bool       `json:"is_verified"`
	VerifiedAt   *time.Time `json:"verified_at,omitempty"`
}

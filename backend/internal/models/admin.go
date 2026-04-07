package models

import (
	"time"

	"github.com/google/uuid"
)

type SuperAdmin struct {
	ID         uuid.UUID `json:"id" db:"id"`
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	AdminLevel int       `json:"admin_level" db:"admin_level"`
	Department string    `json:"department" db:"department"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type AdminVerificationRequest struct {
	CompanyID  uuid.UUID `json:"company_id" binding:"required"`
	IsApproved bool      `json:"is_approved"`
	Notes      string    `json:"notes,omitempty"`
}

type AdminVerificationResponse struct {
	CompanyID   uuid.UUID `json:"company_id"`
	IsApproved  bool      `json:"is_approved"`
	VerifiedAt  time.Time `json:"verified_at"`
	VerifiedBy  uuid.UUID `json:"verified_by"`
	CompanyName string    `json:"company_name"`
	TaxID       string    `json:"tax_id"`
}

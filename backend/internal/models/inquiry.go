package models

import (
	"time"

	"github.com/google/uuid"
)

type InquiryStatus string

const (
	StatusOpen      InquiryStatus = "open"
	StatusResponded InquiryStatus = "responded"
	StatusClosed    InquiryStatus = "closed"
)

type LeadSource string

const (
	SourceInApp LeadSource = "in_app"
	SourceWA    LeadSource = "whatsapp"
	SourceEmail LeadSource = "email"
)

type Inquiry struct {
	ID              uuid.UUID     `json:"id" db:"id"`
	SenderID        uuid.UUID     `json:"sender_id" db:"sender_id"`
	ReceiverID      uuid.UUID     `json:"receiver_id" db:"receiver_id"`
	ProductID       *uuid.UUID    `json:"product_id,omitempty" db:"product_id"`
	InitialMessage  string        `json:"initial_message" db:"initial_message"`
	Status          InquiryStatus `json:"status" db:"status"`
	LeadSource      LeadSource    `json:"lead_source" db:"lead_source"`
	CreatedAt       time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at" db:"updated_at"`
}

type InquiryRequest struct {
	ReceiverID     uuid.UUID `json:"receiver_id" binding:"required"`
	ProductID      *uuid.UUID `json:"product_id,omitempty"`
	InitialMessage string    `json:"initial_message" binding:"required"`
	LeadSource     string    `json:"lead_source"`
}

type InquiryResponse struct {
	ID              uuid.UUID     `json:"id"`
	SenderID        uuid.UUID     `json:"sender_id"`
	ReceiverID      uuid.UUID     `json:"receiver_id"`
	ProductID       *uuid.UUID    `json:"product_id,omitempty"`
	InitialMessage  string        `json:"initial_message"`
	Status          InquiryStatus `json:"status"`
	LeadSource      LeadSource    `json:"lead_source"`
	SenderName      string        `json:"sender_name,omitempty"`
	CompanyName     string        `json:"company_name,omitempty"`
	ProductTitle    string        `json:"product_title,omitempty"`
	CreatedAt       time.Time     `json:"created_at"`
}

type Message struct {
	ID         uuid.UUID `json:"id" db:"id"`
	InquiryID  uuid.UUID `json:"inquiry_id" db:"inquiry_id"`
	SenderID   uuid.UUID `json:"sender_id" db:"sender_id"`
	Message    string    `json:"message" db:"message"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type MessageRequest struct {
	Message string `json:"message" binding:"required"`
}

type MessageResponse struct {
	ID        uuid.UUID `json:"id"`
	InquiryID uuid.UUID `json:"inquiry_id"`
	SenderID  uuid.UUID `json:"sender_id"`
	Message   string    `json:"message"`
	SenderName string `json:"sender_name,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type AIFeatureType string

const (
	FeatureHSCode  AIFeatureType = "HS_CODE"
	FeatureSanction AIFeatureType = "SANCTION"
	FeatureOCR     AIFeatureType = "OCR"
)

type AIComplianceHistory struct {
	ID             uuid.UUID     `json:"id" db:"id"`
	ProductID      *uuid.UUID    `json:"product_id,omitempty" db:"product_id"`
	UserID         uuid.UUID     `json:"user_id" db:"user_id"`
	FeatureType    AIFeatureType `json:"feature_type" db:"feature_type"`
	InputPayload   json.RawMessage `json:"input_payload" db:"input_payload"`
	AIResponse     json.RawMessage `json:"ai_response" db:"ai_response"`
	ConfidenceScore int          `json:"confidence_score" db:"confidence_score"`
	CheckedAt      time.Time     `json:"checked_at" db:"checked_at"`
}

type HSCodeRequest struct {
	ProductDescription string `json:"product_description" binding:"required"`
	ProductName        string `json:"product_name" binding:"required"`
	Material           string `json:"material"`
	Usage              string `json:"usage"`
}

type HSCodeResponse struct {
	HSCode          string   `json:"hs_code"`
	Description     string   `json:"description"`
	ConfidenceScore int      `json:"confidence_score"`
	AlternativeCodes []string `json:"alternative_codes,omitempty"`
	Explanation     string   `json:"explanation"`
}

type SanctionCheckRequest struct {
	EntityName    string `json:"entity_name" binding:"required"`
	EntityCountry string `json:"entity_country,omitempty"`
	EntityType    string `json:"entity_type"` // individual or company
}

type SanctionCheckResponse struct {
	IsSanctioned bool     `json:"is_sanctioned"`
	RiskLevel    string   `json:"risk_level"` // LOW, MEDIUM, HIGH, CRITICAL
	MatchFound   bool     `json:"match_found"`
	Matches      []SanctionMatch `json:"matches,omitempty"`
	Recommendation string `json:"recommendation"`
}

type SanctionMatch struct {
	Name       string `json:"name"`
	List       string `json:"list"` // OFAC, UN, EU
	Country    string `json:"country"`
	MatchScore float64 `json:"match_score"`
	Reason     string `json:"reason"`
}

type OCRDocumentRequest struct {
	DocumentType string `json:"document_type" binding:"required"` // invoice, bl, packing_list
	ImageURL     string `json:"image_url" binding:"required"`
}

type OCRDocumentResponse struct {
	ExtractedData map[string]interface{} `json:"extracted_data"`
	ConfidenceScore int                  `json:"confidence_score"`
	DocumentType  string                 `json:"document_type"`
	RawText       string                 `json:"raw_text,omitempty"`
}

type AIRequestLimit struct {
	UserID      uuid.UUID `json:"user_id"`
	Date        string    `json:"date"`
	RequestCount int     `json:"request_count"`
	Limit       int       `json:"limit"`
}

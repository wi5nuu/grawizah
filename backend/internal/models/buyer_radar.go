package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type BuyerRadar struct {
	ID                uuid.UUID       `json:"id" db:"id"`
	TargetCountry     string          `json:"target_country" db:"target_country"`
	CompanyName       string          `json:"company_name" db:"company_name"`
	BuyScore          float64         `json:"buy_score" db:"buy_score"`
	TradeHistoryData  json.RawMessage `json:"trade_history_data" db:"trade_history_data"`
	ImportFrequency   string          `json:"import_frequency" db:"import_frequency"`
	LastImportDate    *time.Time      `json:"last_import_date,omitempty" db:"last_import_date"`
	PreferredProducts []string        `json:"preferred_products" db:"preferred_products"`
	CreatedAt         time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time       `json:"updated_at" db:"updated_at"`
}

type BuyerRadarResponse struct {
	ID              uuid.UUID          `json:"id"`
	CompanyName     string             `json:"company_name"`
	TargetCountry   string             `json:"target_country"`
	BuyScore        float64            `json:"buy_score"`
	ImportFrequency string             `json:"import_frequency"`
	LastImportDate  *time.Time         `json:"last_import_date,omitempty"`
	RiskIndicators  []string           `json:"risk_indicators,omitempty"`
	TradeHistory    []TradeHistoryItem `json:"trade_history,omitempty"`
}

type TradeHistoryItem struct {
	Date        string  `json:"date"`
	Product     string  `json:"product"`
	Quantity    string  `json:"quantity"`
	Origin      string  `json:"origin"`
	Value       float64 `json:"value,omitempty"`
	Supplier    string  `json:"supplier,omitempty"`
}

type MarketInsight struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Category    string    `json:"category" db:"category"`
	Country     string    `json:"country" db:"country"`
	TrendData   json.RawMessage `json:"trend_data" db:"trend_data"`
	AvgPrice    float64   `json:"avg_price" db:"avg_price"`
	DemandLevel string    `json:"demand_level" db:"demand_level"`
	GeneratedAt time.Time `json:"generated_at" db:"generated_at"`
}

type MarketInsightResponse struct {
	Category      string       `json:"category"`
	Country       string       `json:"country"`
	TrendData     interface{}  `json:"trend_data"`
	AvgPrice      float64      `json:"avg_price"`
	DemandLevel   string       `json:"demand_level"`
	Recommendations []string   `json:"recommendations,omitempty"`
	Competitors   []CompetitorInfo `json:"competitors,omitempty"`
}

type CompetitorInfo struct {
	CompanyName string  `json:"company_name"`
	Country     string  `json:"country"`
	PriceRange  string  `json:"price_range"`
	MarketShare float64 `json:"market_share,omitempty"`
	Strengths   []string `json:"strengths,omitempty"`
	Weaknesses  []string `json:"weaknesses,omitempty"`
}

type MarketAlert struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	AlertType string    `json:"alert_type" db:"alert_type"`
	Message   string    `json:"message" db:"message"`
	IsRead    bool      `json:"is_read" db:"is_read"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type MarketAlertResponse struct {
	ID        uuid.UUID `json:"id"`
	AlertType string    `json:"alert_type"`
	Message   string    `json:"message"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}

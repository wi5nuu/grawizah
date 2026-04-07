package services

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type BuyerRadarService struct {
	db          *sql.DB
	groqService *GroqService
}

func NewBuyerRadarService(db *sql.DB, groqService *GroqService) *BuyerRadarService {
	return &BuyerRadarService{db: db, groqService: groqService}
}

// GetBuyerRadar retrieves buyer radar data
func (s *BuyerRadarService) GetBuyerRadar(country string) ([]models.BuyerRadarResponse, error) {
	rows, err := s.db.Query(`
		SELECT id, target_country, company_name, buy_score, trade_history_data, 
		       import_frequency, last_import_date, preferred_products
		FROM buyer_radar 
		WHERE target_country = $1
		ORDER BY buy_score DESC
		LIMIT 50
	`, country)
	if err != nil {
		return nil, fmt.Errorf("failed to query buyer radar: %w", err)
	}
	defer rows.Close()

	var buyers []models.BuyerRadarResponse
	for rows.Next() {
		var buyer models.BuyerRadar
		err := rows.Scan(
			&buyer.ID, &buyer.TargetCountry, &buyer.CompanyName, &buyer.BuyScore,
			&buyer.TradeHistoryData, &buyer.ImportFrequency, &buyer.LastImportDate, &buyer.PreferredProducts,
		)
		if err != nil {
			continue
		}

		response := models.BuyerRadarResponse{
			ID:              buyer.ID,
			CompanyName:     buyer.CompanyName,
			TargetCountry:   buyer.TargetCountry,
			BuyScore:        buyer.BuyScore,
			ImportFrequency: buyer.ImportFrequency,
			LastImportDate:  buyer.LastImportDate,
		}

		// Parse trade history
		if buyer.TradeHistoryData != nil {
			json.Unmarshal(buyer.TradeHistoryData, &response.TradeHistory)
		}

		buyers = append(buyers, response)
	}

	return buyers, nil
}

// GetMarketInsights retrieves market insights
func (s *BuyerRadarService) GetMarketInsights(category, country string) (*models.MarketInsightResponse, error) {
	// Try to get from cache first
	var insight models.MarketInsight
	err := s.db.QueryRow(`
		SELECT id, category, country, trend_data, avg_price, demand_level, generated_at
		FROM market_insights 
		WHERE category = $1 AND country = $2
		ORDER BY generated_at DESC
		LIMIT 1
	`, category, country).Scan(
		&insight.ID, &insight.Category, &insight.Country, &insight.TrendData,
		&insight.AvgPrice, &insight.DemandLevel, &insight.GeneratedAt,
	)

	if err == nil {
		// Return cached insight
		var trendData interface{}
		json.Unmarshal(insight.TrendData, &trendData)

		return &models.MarketInsightResponse{
			Category:    insight.Category,
			Country:     insight.Country,
			TrendData:   trendData,
			AvgPrice:    insight.AvgPrice,
			DemandLevel: insight.DemandLevel,
		}, nil
	}

	// Generate new insight using Groq AI
	insightResp, err := s.groqService.GenerateMarketInsight(category, country)
	if err != nil {
		return nil, fmt.Errorf("failed to generate market insight: %w", err)
	}

	// Save to database
	trendData, _ := json.Marshal(insightResp.TrendData)
	insightID := uuid.New()
	_, err = s.db.Exec(`
		INSERT INTO market_insights (id, category, country, trend_data, avg_price, demand_level, generated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW())
	`, insightID, insightResp.Category, insightResp.Country, trendData, insightResp.AvgPrice, insightResp.DemandLevel)

	return insightResp, nil
}

// GetMarketAlerts retrieves market alerts for a user
func (s *BuyerRadarService) GetMarketAlerts(userID uuid.UUID, unreadOnly bool) ([]models.MarketAlertResponse, error) {
	var query string
	var rows *sql.Rows
	var err error

	if unreadOnly {
		query = `
			SELECT id, user_id, alert_type, message, is_read, created_at
			FROM market_alerts 
			WHERE user_id = $1 AND is_read = false
			ORDER BY created_at DESC
			LIMIT 50
		`
		rows, err = s.db.Query(query, userID)
	} else {
		query = `
			SELECT id, user_id, alert_type, message, is_read, created_at
			FROM market_alerts 
			WHERE user_id = $1
			ORDER BY created_at DESC
			LIMIT 50
		`
		rows, err = s.db.Query(query, userID)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to query alerts: %w", err)
	}
	defer rows.Close()

	var alerts []models.MarketAlertResponse
	for rows.Next() {
		var alert models.MarketAlert
		err := rows.Scan(&alert.ID, &alert.UserID, &alert.AlertType, &alert.Message, &alert.IsRead, &alert.CreatedAt)
		if err != nil {
			continue
		}
		alerts = append(alerts, models.MarketAlertResponse{
			ID:        alert.ID,
			AlertType: alert.AlertType,
			Message:   alert.Message,
			IsRead:    alert.IsRead,
			CreatedAt: alert.CreatedAt,
		})
	}

	return alerts, nil
}

// MarkAlertAsRead marks an alert as read
func (s *BuyerRadarService) MarkAlertAsRead(alertID uuid.UUID) error {
	_, err := s.db.Exec("UPDATE market_alerts SET is_read = true WHERE id = $1", alertID)
	return err
}

// CreateAlert creates a new market alert
func (s *BuyerRadarService) CreateAlert(userID uuid.UUID, alertType, message string) error {
	_, err := s.db.Exec(`
		INSERT INTO market_alerts (id, user_id, alert_type, message, is_read, created_at)
		VALUES ($1, $2, $3, $4, false, NOW())
	`, uuid.New(), userID, alertType, message)
	return err
}

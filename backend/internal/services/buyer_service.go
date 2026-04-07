package services

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type BuyerService struct {
	db *sql.DB
}

func NewBuyerService(db *sql.DB) *BuyerService {
	return &BuyerService{db: db}
}

// BuyerProfileRequest represents the request to create/update buyer profile
type BuyerProfileRequest struct {
	CompanyName      string   `json:"company_name"`
	CountryInterest  string   `json:"country_interest"`
	TradePreferences []string `json:"trade_preferences"`
}

// CreateBuyerProfile creates a buyer profile
func (s *BuyerService) CreateBuyerProfile(userID uuid.UUID, req *models.BuyerProfileRequest) (*models.BuyerProfile, error) {
	prefs, _ := json.Marshal(req.TradePreferences)

	query := `
		INSERT INTO buyers (id, company_name, country_interest, trade_preferences, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		ON CONFLICT (id) DO UPDATE SET 
			company_name = $2, 
			country_interest = $3, 
			trade_preferences = $4, 
			updated_at = NOW()
		RETURNING id, company_name, country_interest, trade_preferences, created_at
	`

	var profile models.BuyerProfile
	err := s.db.QueryRow(query, userID, req.CompanyName, req.CountryInterest, prefs).Scan(
		&profile.ID, &profile.CompanyName, &profile.CountryInterest,
		&profile.TradePreferences, &profile.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create buyer profile: %w", err)
	}

	return &profile, nil
}

// GetBuyerProfile retrieves a buyer profile
func (s *BuyerService) GetBuyerProfile(userID uuid.UUID) (*models.BuyerProfile, error) {
	query := `
		SELECT id, company_name, country_interest, trade_preferences, created_at, updated_at
		FROM buyers WHERE id = $1
	`

	var profile models.BuyerProfile
	var prefs []byte
	err := s.db.QueryRow(query, userID).Scan(
		&profile.ID, &profile.CompanyName, &profile.CountryInterest,
		&prefs, &profile.CreatedAt, &profile.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("buyer profile not found")
		}
		return nil, fmt.Errorf("failed to query buyer profile: %w", err)
	}

	json.Unmarshal(prefs, &profile.TradePreferences)
	return &profile, nil
}

// UpdateBuyerProfile updates a buyer profile
func (s *BuyerService) UpdateBuyerProfile(userID uuid.UUID, req *models.BuyerProfileRequest) (*models.BuyerProfile, error) {
	prefs, _ := json.Marshal(req.TradePreferences)

	query := `
		UPDATE buyers 
		SET company_name = $1, country_interest = $2, trade_preferences = $3, updated_at = NOW()
		WHERE id = $4
		RETURNING id, company_name, country_interest, trade_preferences, created_at
	`

	var profile models.BuyerProfile
	err := s.db.QueryRow(query, req.CompanyName, req.CountryInterest, prefs, userID).Scan(
		&profile.ID, &profile.CompanyName, &profile.CountryInterest,
		&profile.TradePreferences, &profile.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update buyer profile: %w", err)
	}

	return &profile, nil
}

// GetSupplierComparison compares multiple suppliers for a buyer
func (s *BuyerService) GetSupplierComparison(userID uuid.UUID, supplierIDs []string) ([]models.SupplierComparison, error) {
	var comparisons []models.SupplierComparison

	for _, supplierID := range supplierIDs {
		id, err := uuid.Parse(supplierID)
		if err != nil {
			continue
		}

		var supplier models.SupplierComparison
		err = s.db.QueryRow(`
			SELECT c.id, c.company_name, c.is_verified, c.country,
			       COUNT(p.id) as product_count,
			       AVG(p.price_est_min) as avg_price
			FROM companies c
			LEFT JOIN products p ON c.id = p.company_id AND p.is_active = true
			WHERE c.id = $1
			GROUP BY c.id
		`, id).Scan(
			&supplier.ID, &supplier.CompanyName, &supplier.IsVerified,
			&supplier.Country, &supplier.ProductCount, &supplier.AvgPrice,
		)
		if err != nil {
			continue
		}

		comparisons = append(comparisons, supplier)
	}

	return comparisons, nil
}

// BuyerProfile represents a buyer's profile
type BuyerProfile struct {
	ID               uuid.UUID `json:"id"`
	CompanyName      string    `json:"company_name"`
	CountryInterest  string    `json:"country_interest"`
	TradePreferences []string  `json:"trade_preferences"`
	CreatedAt        string    `json:"created_at"`
	UpdatedAt        string    `json:"updated_at,omitempty"`
}

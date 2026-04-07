package services

import (
	"database/sql"
	"fmt"
	"time"

	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type SubscriptionService struct {
	db *sql.DB
}

func NewSubscriptionService(db *sql.DB) *SubscriptionService {
	return &SubscriptionService{db: db}
}

// GetSubscription retrieves subscription for a company
func (s *SubscriptionService) GetSubscription(companyID uuid.UUID) (*models.SubscriptionResponse, error) {
	query := `
		SELECT id, company_id, plan, start_date, end_date, auto_renew, created_at
		FROM subscriptions 
		WHERE company_id = $1 
		ORDER BY end_date DESC 
		LIMIT 1
	`

	var sub models.Subscription
	err := s.db.QueryRow(query, companyID).Scan(
		&sub.ID, &sub.CompanyID, &sub.Plan, &sub.StartDate, &sub.EndDate, &sub.AutoRenew, &sub.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			// Return default free subscription
			return &models.SubscriptionResponse{
				CompanyID: companyID,
				Plan:      models.PlanFree,
				StartDate: time.Now(),
				EndDate:   time.Now().AddDate(100, 0, 0), // Far future
				IsActive:  true,
				DaysLeft:  999999,
			}, nil
		}
		return nil, fmt.Errorf("failed to query subscription: %w", err)
	}

	return &models.SubscriptionResponse{
		ID:        sub.ID,
		CompanyID: sub.CompanyID,
		Plan:      sub.Plan,
		StartDate: sub.StartDate,
		EndDate:   sub.EndDate,
		AutoRenew: sub.AutoRenew,
		IsActive:  sub.IsActive(),
		DaysLeft:  sub.GetDaysLeft(),
	}, nil
}

// UpgradeSubscription upgrades a company's subscription
func (s *SubscriptionService) UpgradeSubscription(companyID uuid.UUID, plan models.SubscriptionPlan) (*models.SubscriptionResponse, error) {
	// Check if subscription exists
	var existingSub models.Subscription
	err := s.db.QueryRow(`
		SELECT id, company_id, plan, start_date, end_date, auto_renew
		FROM subscriptions 
		WHERE company_id = $1 
		ORDER BY end_date DESC 
		LIMIT 1
	`, companyID).Scan(
		&existingSub.ID, &existingSub.CompanyID, &existingSub.Plan, 
		&existingSub.StartDate, &existingSub.EndDate, &existingSub.AutoRenew,
	)

	now := time.Now()
	endDate := now.AddDate(0, 1, 0) // 1 month subscription

	if err == sql.ErrNoRows {
		// Create new subscription
		subID := uuid.New()
		query := `
			INSERT INTO subscriptions (id, company_id, plan, start_date, end_date, auto_renew, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())
			RETURNING id, company_id, plan, start_date, end_date, auto_renew, created_at
		`

		err = s.db.QueryRow(query, subID, companyID, plan, now, endDate).Scan(
			&existingSub.ID, &existingSub.CompanyID, &existingSub.Plan,
			&existingSub.StartDate, &existingSub.EndDate, &existingSub.AutoRenew, &existingSub.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create subscription: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("failed to query subscription: %w", err)
	} else {
		// Update existing subscription
		query := `
			UPDATE subscriptions 
			SET plan = $1, start_date = $2, end_date = $3, updated_at = NOW()
			WHERE id = $4
			RETURNING id, company_id, plan, start_date, end_date, auto_renew, created_at
		`

		err = s.db.QueryRow(query, plan, now, endDate, existingSub.ID).Scan(
			&existingSub.ID, &existingSub.CompanyID, &existingSub.Plan,
			&existingSub.StartDate, &existingSub.EndDate, &existingSub.AutoRenew, &existingSub.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to update subscription: %w", err)
		}
	}

	return &models.SubscriptionResponse{
		ID:        existingSub.ID,
		CompanyID: existingSub.CompanyID,
		Plan:      existingSub.Plan,
		StartDate: existingSub.StartDate,
		EndDate:   existingSub.EndDate,
		AutoRenew: existingSub.AutoRenew,
		IsActive:  true,
		DaysLeft:  30,
	}, nil
}

// IsPremium checks if a company has premium subscription
func (s *SubscriptionService) IsPremium(companyID uuid.UUID) bool {
	sub, err := s.GetSubscription(companyID)
	if err != nil {
		return false
	}
	return sub.Plan == models.PlanPremium && sub.IsActive
}

// CancelSubscription cancels a subscription
func (s *SubscriptionService) CancelSubscription(companyID uuid.UUID) error {
	_, err := s.db.Exec(`
		UPDATE subscriptions 
		SET auto_renew = false, updated_at = NOW()
		WHERE company_id = $1
	`, companyID)
	return err
}

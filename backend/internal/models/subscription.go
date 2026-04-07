package models

import (
	"time"

	"github.com/google/uuid"
)

type SubscriptionPlan string

const (
	PlanFree      SubscriptionPlan = "free"
	PlanPremium   SubscriptionPlan = "premium"
	PlanEnterprise SubscriptionPlan = "enterprise"
)

type Subscription struct {
	ID        uuid.UUID        `json:"id" db:"id"`
	CompanyID uuid.UUID        `json:"company_id" db:"company_id"`
	Plan      SubscriptionPlan `json:"plan" db:"plan"`
	StartDate time.Time        `json:"start_date" db:"start_date"`
	EndDate   time.Time        `json:"end_date" db:"end_date"`
	AutoRenew bool             `json:"auto_renew" db:"auto_renew"`
	CreatedAt time.Time        `json:"created_at" db:"created_at"`
	UpdatedAt time.Time        `json:"updated_at" db:"updated_at"`
}

type SubscriptionResponse struct {
	ID        uuid.UUID        `json:"id"`
	CompanyID uuid.UUID        `json:"company_id"`
	Plan      SubscriptionPlan `json:"plan"`
	StartDate time.Time        `json:"start_date"`
	EndDate   time.Time        `json:"end_date"`
	AutoRenew bool             `json:"auto_renew"`
	IsActive  bool             `json:"is_active"`
	DaysLeft  int              `json:"days_left,omitempty"`
}

func (s *Subscription) IsActive() bool {
	return time.Now().Before(s.EndDate)
}

func (s *Subscription) IsPremium() bool {
	return s.Plan == PlanPremium && s.IsActive()
}

func (s *Subscription) GetDaysLeft() int {
	if !s.IsActive() {
		return 0
	}
	return int(time.Until(s.EndDate).Hours() / 24)
}

type SubscriptionUpgradeRequest struct {
	Plan SubscriptionPlan `json:"plan" binding:"required"`
}

type PaymentInfo struct {
	Amount       float64 `json:"amount"`
	Currency     string  `json:"currency"`
	PaymentMethod string `json:"payment_method"`
	TransactionID string `json:"transaction_id"`
	PaidAt       time.Time `json:"paid_at"`
}

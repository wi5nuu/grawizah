package services

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
)

type AuditService struct {
	db *sql.DB
}

func NewAuditService(db *sql.DB) *AuditService {
	return &AuditService{db: db}
}

// Log records an audit log entry
func (s *AuditService) Log(actorID uuid.UUID, action string, tableName string, metadata map[string]interface{}) error {
	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
		metadataJSON = []byte("{}")
	}

	query := `
		INSERT INTO audit_logs (id, actor_id, action, table_name, metadata, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
	`

	_, err = s.db.Exec(query, uuid.New(), actorID, action, tableName, metadataJSON)
	if err != nil {
		return fmt.Errorf("failed to write audit log: %w", err)
	}

	return nil
}

// LogLogin records a successful login
func (s *AuditService) LogLogin(userID uuid.UUID, ip string, userAgent string) error {
	return s.Log(userID, "LOGIN", "users", map[string]interface{}{
		"ip":         ip,
		"user_agent": userAgent,
		"event":      "user_login",
	})
}

// LogFailedLogin records a failed login attempt
func (s *AuditService) LogFailedLogin(email string, ip string, reason string) error {
	return s.Log(uuid.Nil, "FAILED_LOGIN", "users", map[string]interface{}{
		"email":      email,
		"ip":         ip,
		"user_agent": "",
		"reason":     reason,
	})
}

// LogPasswordChange records a password change
func (s *AuditService) LogPasswordChange(userID uuid.UUID) error {
	return s.Log(userID, "PASSWORD_CHANGE", "users", map[string]interface{}{
		"event": "password_changed",
	})
}

// LogAICheck records an AI compliance check
func (s *AuditService) LogAICheck(userID uuid.UUID, featureType string, productID uuid.UUID, confidenceScore int) error {
	return s.Log(userID, "AI_CHECK", "ai_compliance_history", map[string]interface{}{
		"feature_type":     featureType,
		"product_id":       productID,
		"confidence_score": confidenceScore,
	})
}

// LogCompanyVerify records a company verification action
func (s *AuditService) LogCompanyVerify(adminID uuid.UUID, companyID uuid.UUID, approved bool) error {
	return s.Log(adminID, "VERIFY_COMPANY", "companies", map[string]interface{}{
		"company_id": companyID,
		"approved":   approved,
	})
}

// LogProductCreate records a product creation
func (s *AuditService) LogProductCreate(userID uuid.UUID, productID uuid.UUID, title string) error {
	return s.Log(userID, "CREATE_PRODUCT", "products", map[string]interface{}{
		"product_id": productID,
		"title":      title,
	})
}

// LogProductDelete records a product deletion
func (s *AuditService) LogProductDelete(userID uuid.UUID, productID uuid.UUID) error {
	return s.Log(userID, "DELETE_PRODUCT", "products", map[string]interface{}{
		"product_id": productID,
	})
}

// LogSubscriptionChange records a subscription change
func (s *AuditService) LogSubscriptionChange(userID uuid.UUID, companyID uuid.UUID, oldPlan string, newPlan string) error {
	return s.Log(userID, "SUBSCRIPTION_CHANGE", "subscriptions", map[string]interface{}{
		"company_id": companyID,
		"old_plan":   oldPlan,
		"new_plan":   newPlan,
	})
}

// LogSanctionUpdate records a sanction list update
func (s *AuditService) LogSanctionUpdate(adminID uuid.UUID, sanctionID uuid.UUID, action string) error {
	return s.Log(adminID, "SANCTION_UPDATE", "sanction_list", map[string]interface{}{
		"sanction_id": sanctionID,
		"action":      action,
	})
}

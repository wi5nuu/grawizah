package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type AuditLog struct {
	ID        uuid.UUID       `json:"id" db:"id"`
	ActorID   uuid.UUID       `json:"actor_id" db:"actor_id"`
	Action    string          `json:"action" db:"action"`
	TableName string          `json:"table_name" db:"table_name"`
	Metadata  json.RawMessage `json:"metadata" db:"metadata"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
}

type AuditLogResponse struct {
	ID        uuid.UUID       `json:"id"`
	ActorID   uuid.UUID       `json:"actor_id"`
	Action    string          `json:"action"`
	TableName string          `json:"table_name"`
	Metadata  json.RawMessage `json:"metadata"`
	CreatedAt time.Time       `json:"created_at"`
}

type AuditLogFilter struct {
	ActorID   *uuid.UUID `form:"actor_id"`
	Action    string     `form:"action"`
	TableName string     `form:"table_name"`
	StartDate string     `form:"start_date"`
	EndDate   string     `form:"end_date"`
	Page      int        `form:"page"`
	Limit     int        `form:"limit"`
}

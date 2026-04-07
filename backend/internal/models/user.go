package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	RoleGuest  UserRole = "guest"
	RoleTrader UserRole = "trader"
	RoleBuyer  UserRole = "buyer"
	RoleAdmin  UserRole = "admin"
)

type User struct {
	ID               uuid.UUID      `json:"id" db:"id"`
	Email            string         `json:"email" db:"email"`
	FullName         string         `json:"full_name" db:"full_name"`
	Role             UserRole       `json:"role" db:"role"`
	Password         string         `json:"-" db:"password_hash"`
	TwoFactorSecret  sql.NullString `json:"-" db:"two_factor_secret"`
	TwoFactorEnabled bool           `json:"two_factor_enabled" db:"two_factor_enabled"`
	IsEmailVerified  bool           `json:"is_email_verified" db:"is_email_verified"`
	CreatedAt        time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at" db:"updated_at"`
}

type UserResponse struct {
	ID               uuid.UUID `json:"id"`
	Email            string    `json:"email"`
	FullName         string    `json:"full_name"`
	Role             UserRole  `json:"role"`
	TwoFactorEnabled bool      `json:"two_factor_enabled"`
	IsEmailVerified  bool      `json:"is_email_verified"`
	CreatedAt        time.Time `json:"created_at"`
}

package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"grawizah.com/backend/internal/config"

	_ "github.com/lib/pq"
)

func NewDatabase(cfg *config.Config) (*sql.DB, error) {
	var dbURL string

	if cfg.DatabaseURL != "" {
		dbURL = cfg.DatabaseURL
	} else if cfg.SupabaseServiceKey != "" && cfg.SupabaseURL != "" {
		// Construct PostgreSQL URL from Supabase credentials
		dbURL = fmt.Sprintf("%s/postgres?options=-c%%20search_path=public,public", cfg.SupabaseURL)
	} else {
		return nil, fmt.Errorf("database credentials not provided")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("✅ Successfully connected to PostgreSQL database")
	return db, nil
}

func CloseDatabase(db *sql.DB) {
	if err := db.Close(); err != nil {
		log.Printf("❌ Error closing database connection: %v", err)
	}
}

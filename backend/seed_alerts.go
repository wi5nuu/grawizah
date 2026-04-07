package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgresql://postgres.wsdhumiwikldvpjiksag:Grawizah.1285@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}

	// Find the user ID for Wisnu Alfian Nur Ashar
	var userID uuid.UUID
	err = db.QueryRow("SELECT id FROM users WHERE full_name = 'Wisnu Alfian Nur Ashar' LIMIT 1").Scan(&userID)
	if err != nil {
		log.Fatalf("❌ Failed to find user 'Wisnu Alfian Nur Ashar': %v", err)
	}

	fmt.Printf("✅ Found user Wisnu: %s\n", userID)

	// Clean existing alerts to avoid duplicates
	_, _ = db.Exec("DELETE FROM market_alerts WHERE user_id = $1", userID)

	alerts := []struct {
		AlertType string
		Message   string
	}{
		{"inquiry", "New inquiry received from European Coffee Distributors for Indonesian Coffee Beans."},
		{"order", "Order #ORD-10293 has been confirmed for 5000kg Palm Oil."},
		{"compliance", "Compliance certificate for 'Organic Coffee Beans' verified by AI Successfully."},
		{"payment", "Payment of $12,500 received from Asia Import Co."},
		{"subscription", "Welcome to Grawizah Premium! Your market intelligence tools are now active."},
	}

	for _, a := range alerts {
		_, err = db.Exec("INSERT INTO market_alerts (user_id, alert_type, message, is_read, created_at) VALUES ($1, $2, $3, $4, NOW())",
			userID, a.AlertType, a.Message, false)
		if err != nil {
			log.Printf("❌ Failed to insert alert: %v", err)
		}
	}

	fmt.Println("✅ Successfully seeded 5 professional notifications for Wisnu.")
}

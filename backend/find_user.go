package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgresql://postgres.wsdhumiwikldvpjiksag:Grawizah.1285@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer db.Close()

	var email, fullName, passwordHash string
	err = db.QueryRow("SELECT email, full_name, password_hash FROM users WHERE full_name = 'Wisnu Alfian Nur Ashar'").Scan(&email, &fullName, &passwordHash)
	if err != nil {
		log.Fatalf("❌ User not found: %v", err)
	}

	fmt.Printf("User Found:\nEmail: %s\nName: %s\nHash: %s\n", email, fullName, passwordHash)
}

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

	// Find the user ID for Wisnu Alfian Nur Ashar
	var userID uuid.UUID
	err = db.QueryRow("SELECT id FROM users WHERE full_name = 'Wisnu Alfian Nur Ashar' LIMIT 1").Scan(&userID)
	if err != nil {
		log.Fatalf("❌ Failed to find user 'Wisnu Alfian Nur Ashar': %v", err)
	}

	// Find company for Wisnu
	var companyID uuid.UUID
	err = db.QueryRow("SELECT id FROM companies WHERE owner_id = $1 LIMIT 1", userID).Scan(&companyID)
	if err != nil {
		log.Fatalf("❌ Failed to find company for user: %v", err)
	}

	fmt.Printf("✅ Found company: %s\n", companyID)

	// Clean existing docs
	_, _ = db.Exec("DELETE FROM company_documents WHERE company_id = $1", companyID)

	docs := []struct {
		Type     string
		Name     string
		Status   string
		Date     string
	}{
		{"nib", "NIB_Grawizah_Trade.pdf", "verified", "2024-03-15"},
		{"tax_id", "TaxID_2024.pdf", "pending", "2024-04-01"},
	}

	for _, d := range docs {
		_, err = db.Exec(`
			INSERT INTO company_documents (company_id, doc_type, file_name, file_url, status, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6)
		`, companyID, d.Type, d.Name, "https://grawizah.storage/simulated/"+d.Name, d.Status, d.Date)
		if err != nil {
			log.Printf("❌ Failed to insert document: %v", err)
		}
	}

	fmt.Println("✅ Successfully seeded Document Vault for Wisnu.")
}

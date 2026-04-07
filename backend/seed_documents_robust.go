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

	var userID uuid.UUID
	var role string
	err = db.QueryRow("SELECT id, role FROM users WHERE full_name = 'Wisnu Alfian Nur Ashar' LIMIT 1").Scan(&userID, &role)
	if err != nil {
		log.Fatalf("❌ User not found: %v", err)
	}

	fmt.Printf("User: %s, Role: %s\n", userID, role)

	var companyID uuid.UUID
	err = db.QueryRow("SELECT id FROM companies WHERE owner_id = $1 LIMIT 1", userID).Scan(&companyID)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No company found. Creating one for Wisnu...")
			companyID = uuid.New()
			_, err = db.Exec(`
				INSERT INTO companies (id, owner_id, company_name, tax_id, address, city, country, is_verified)
				VALUES ($1, $2, 'Grawizah Trading Ltd', 'ID-TAX-9921', 'Sudirman Central Business District', 'Jakarta', 'Indonesia', false)
			`, companyID, userID)
			if err != nil {
				log.Fatalf("Failed to create company: %v", err)
			}
			fmt.Printf("Created Company: %s\n", companyID)
		} else {
			log.Fatalf("Query error: %v", err)
		}
	} else {
		fmt.Printf("Found Company: %s\n", companyID)
	}

	// Seed Documents based on role
	_, _ = db.Exec("DELETE FROM company_documents WHERE company_id = $1", companyID)

	var docs []struct {
		Type   string
		Name   string
		Status string
	}

	if role == "buyer" { // Role is 'buyer'
		docs = []struct {
			Type   string
			Name   string
			Status string
		}{
			{"invoice", "Proforma_Invoice_Grawizah_992.pdf", "verified"},
			{"bill_of_lading", "BL_Ocean_Freight_GZ.pdf", "pending"},
		}
	} else { // Role is 'trader'
		docs = []struct {
			Type   string
			Name   string
			Status string
		}{
			{"nib", "NIB_Grawizah_Trade.pdf", "verified"},
			{"tax_id", "TaxID_2024.pdf", "pending"},
		}
	}

	for _, d := range docs {
		_, err = db.Exec(`
			INSERT INTO company_documents (company_id, doc_type, file_name, file_url, status, updated_at)
			VALUES ($1, $2, $3, $4, $5, NOW())
		`, companyID, d.Type, d.Name, "https://grawizah.storage/simulated/"+d.Name, d.Status)
		if err != nil {
			log.Printf("❌ Failed to insert document: %v", err)
		}
	}

	fmt.Println("✅ Successfully seeded Document Vault for Wisnu.")
}

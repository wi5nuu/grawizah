package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgresql://postgres.wsdhumiwikldvpjiksag:Grawizah.1285@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require")
	if err != nil {
		log.Fatalf("❌ Failed to connect: %v", err)
	}
	defer db.Close()

	query := `
	CREATE TABLE IF NOT EXISTS company_documents (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
		doc_type VARCHAR(50) NOT NULL,
		file_name VARCHAR(255),
		file_url TEXT,
		status VARCHAR(50) DEFAULT 'missing',
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);`

	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("❌ Failed to create table: %v", err)
	}

	log.Println("✅ Table company_documents created successfully.")
}

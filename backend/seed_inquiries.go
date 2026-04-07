package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	_ = godotenv.Load(".env")
	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 1. Find the User (Wisnu)
	var wisnuID uuid.UUID
	err = db.QueryRow("SELECT id FROM users WHERE full_name LIKE '%Wisnu%'").Scan(&wisnuID)
	if err != nil {
		log.Fatal("Could not find Wisnu in users table. Please sign up first.")
	}

	// 2. Create a Supplier (User + Company)
	supplierUserID := uuid.New()
	_, err = db.Exec(`
		INSERT INTO users (id, email, full_name, role, password_hash)
		VALUES ($1, $2, $3, 'trader', '$2a$10$UnR81lS6S1A1G1A1G1A1G.G1A1G1A1G1A1G1A1G1A1G1A1G1A1G1A')
		ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
		RETURNING id
	`, supplierUserID, "supplier@coffeeco.com", "John Smith (Coffee Supplier)")
	
	// Create Company
	companyID := uuid.New()
	_, err = db.Exec(`
		INSERT INTO companies (id, owner_id, company_name, tax_id, address, city, country, is_verified)
		VALUES ($1, $2, $3, $4, 'Coffee Street 123', 'Medan', 'Indonesia', true)
		ON CONFLICT (tax_id) DO NOTHING
	`, companyID, supplierUserID, "European Coffee Distributors", "TAX-COFFEE-123")
	
	// Re-fetch companyID if it existed
	db.QueryRow("SELECT id FROM companies WHERE tax_id = 'TAX-COFFEE-123'").Scan(&companyID)

	// 3. Create a Product
	productID := uuid.New()
	_, err = db.Exec(`
		INSERT INTO products (id, company_id, title, description, category, price_est_min, price_est_max, currency)
		VALUES ($1, $2, $3, $4, 'Coffee', 15.00, 25.00, 'USD')
	`, productID, companyID, "Indonesian Coffee Beans (Arabica)", "High quality Arabica beans from Sumatra.", "Food & Beverage")

	// 4. Create Inquiries (John Smith)
	inquiry1ID := uuid.New()
	_, err = db.Exec(`
		INSERT INTO inquiries (id, sender_id, receiver_id, product_id, initial_message, status)
		VALUES ($1, $2, $3, $4, 'Hi, we are interested in your coffee beans. What is your MOQ?', 'open')
	`, inquiry1ID, wisnuID, companyID, productID)

	// Add messages to Inquiry 1
	db.Exec("INSERT INTO messages (id, inquiry_id, sender_id, message) VALUES ($1, $2, $3, $4)", uuid.New(), inquiry1ID, wisnuID, "Hi, we are interested in your coffee beans. What is your MOQ?")
	db.Exec("INSERT INTO messages (id, inquiry_id, sender_id, message) VALUES ($1, $2, $3, $4)", uuid.New(), inquiry1ID, supplierUserID, "Hello Wisnu! Our MOQ for these beans is 5000kg. Are you looking for sea freight?")
	db.Exec("INSERT INTO messages (id, inquiry_id, sender_id, message) VALUES ($1, $2, $3, $4)", uuid.New(), inquiry1ID, wisnuID, "Yes, shipping to Jakarta. Can you provide a quote for that volume?")

	// 5. Create Inquiry 2 (Maria Garcia - Global Trading)
	mariaUserID := uuid.New()
	db.Exec("INSERT INTO users (id, email, full_name, role, password_hash) VALUES ($1, 'maria@global.com', 'Maria Garcia', 'trader', 'hash')", mariaUserID)
	mariaCoID := uuid.New()
	db.Exec("INSERT INTO companies (id, owner_id, company_name, tax_id, address, city, country) VALUES ($1, $2, 'Global Trading Co', 'TAX-GLOBAL-456', 'Global Way 1', 'Singapore', 'Singapore')", mariaCoID, mariaUserID)
	
	inquiry2ID := uuid.New()
	db.Exec("INSERT INTO inquiries (id, sender_id, receiver_id, initial_message, status) VALUES ($1, $2, $3, 'We need palm oil for our manufacturing. Can you provide samples?', 'responded')", inquiry2ID, wisnuID, mariaCoID)
	db.Exec("INSERT INTO messages (id, inquiry_id, sender_id, message) VALUES ($1, $2, $3, 'We need palm oil for our manufacturing. Can you provide samples?')", inquiry2ID, wisnuID)

	fmt.Println("✅ Database successfully seeded with 3 realistic inquiries for Wisnu!")
}

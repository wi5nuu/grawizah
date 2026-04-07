package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load .env from the backend directory
	_ = godotenv.Load(".env")

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Check Connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Connection failed: ", err)
	}
	fmt.Println("✅ Backend is successfully connected to Supabase PostgreSQL.")

	// Query Counts
	var usersCount, productsCount, inquiriesCount int
	err = db.QueryRow("SELECT count(*) FROM users").Scan(&usersCount)
	err = db.QueryRow("SELECT count(*) FROM products").Scan(&productsCount)
	err = db.QueryRow("SELECT count(*) FROM inquiries").Scan(&inquiriesCount)

	fmt.Printf("📊 Database Stats:\n")
	fmt.Printf("   - Total Users: %d\n", usersCount)
	fmt.Printf("   - Total Products: %d\n", productsCount)
	fmt.Printf("   - Total Inquiries: %d\n", inquiriesCount)

	// Check for current user
	var fullName, role string
	err = db.QueryRow("SELECT full_name, role FROM users WHERE full_name LIKE '%Wisnu%'").Scan(&fullName, &role)
	if err == nil {
		fmt.Printf("✅ Found User in Database: %s (%s)\n", fullName, role)
	} else {
		fmt.Println("ℹ️ Profile verification: No user named 'Wisnu' found in DB (might be in localStorage if not synced).")
	}
}

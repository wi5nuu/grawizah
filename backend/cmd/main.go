package main

import (
	"log"
	"net/http"

	"grawizah.com/backend/internal/config"
	"grawizah.com/backend/internal/database"
	"grawizah.com/backend/internal/routes"

	"github.com/joho/godotenv"
)

func main() {
	// Standard logging setup
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  .env file not found, using system environment variables")
	}

	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("CRITICAL: Failed to load configuration: %v", err)
	}

	// Initialize database
	db, err := database.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("CRITICAL: Failed to connect to database: %v", err)
	}
	defer database.CloseDatabase(db)

	// Run database migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("CRITICAL: Failed to run migrations: %v", err)
	}

	// Initialize router
	router := routes.SetupRouter(db, cfg)

	// Explicitly bind to 0.0.0.0 and block on ListenAndServe
	// No goroutines, no complex signal handling for maximum Hugging Face compatibility
	port := cfg.Port
	if port == "" {
		port = "7860"
	}
	
	addr := "0.0.0.0:" + port
	log.Printf("🚀 GRAWIZAH BACKEND STARTING ON %s", addr)
	
	// This call is BLOCKING, which ensures the container stays alive as long as the server is running
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("CRITICAL: Server failed: %v", err)
	}
}

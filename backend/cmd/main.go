package main

import (
	"log"
	"net/http"
	"os"

	"grawizah.com/backend/internal/config"
	"grawizah.com/backend/internal/database"
	"grawizah.com/backend/internal/routes"

	"github.com/joho/godotenv"
)

func main() {
	// Standard logging setup to see everything in Hugging Face logs
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("ℹ️  .env file not found, using system environment variables")
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

	// Run database migrations (can be skipped if already done)
	if os.Getenv("SKIP_MIGRATIONS") == "true" {
		log.Println("⏭️  Skipping migrations (SKIP_MIGRATIONS=true)")
	} else {
		log.Println("🔄 Running database migrations...")
		if err := database.RunMigrations(db); err != nil {
			log.Fatalf("CRITICAL: Failed to run migrations: %v", err)
		}
	}

	// Initialize router
	router := routes.SetupRouter(db, cfg)

	// --- LOGIKA PORT FINAL UNTUK HUGGING FACE ---
	// Kami mengambil PORT langsung dari OS untuk menghindari kesalahan fallback di package config
	port := os.Getenv("PORT")
	if port == "" {
		port = "7860" // Port default wajib untuk Spaces
		log.Println("⚠️  HUGGING FACE PORT ENV NOT DETECTED! FORCING FALLBACK TO 7860")
	}
	
	addr := "0.0.0.0:" + port
	log.Printf("🚀 SERVER STATUS: BINDING TO %s", addr)
	log.Printf("📡 PUBLIC ACCESS SHOULD BE AVAILABLE AT THE SPACES URL")
	
	// Blocking call - kontainer akan tetap hidup selama server ini berjalan
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("CRITICAL ERROR: Failed to start server on %s: %v", addr, err)
	}
}

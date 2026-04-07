package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port string

	// Supabase Configuration
	SupabaseURL        string
	SupabaseKey        string
	SupabaseServiceKey string
	DatabaseURL        string

	// JWT Configuration
	JWTSecret string

	// Groq AI Configuration
	GroqAPIKey string
	GroqModel  string

	// OAuth2 Configuration
	GoogleClientID        string
	GoogleClientSecret    string
	FacebookClientID      string
	FacebookClientSecret  string
	GitHubClientID        string
	GitHubClientSecret    string
	InstagramClientID     string
	InstagramClientSecret string

	// SMTP Configuration
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string

	// Rate Limiting
	RateLimitRequests int
	RateLimitDuration int

	// Environment
	Environment string

	// App URL
	AppURL string

	// Frontend URL for OAuth redirects
	FrontendURL string
}

func LoadConfig() (*Config, error) {
	smtpPort, _ := strconv.Atoi(getEnv("SMTP_PORT", "587"))
	rateLimitRequests, _ := strconv.Atoi(getEnv("RATE_LIMIT_REQUESTS", "100"))
	rateLimitDuration, _ := strconv.Atoi(getEnv("RATE_LIMIT_DURATION", "60"))

	return &Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("ENVIRONMENT", "development"),

		SupabaseURL:        getEnv("SUPABASE_URL", ""),
		SupabaseKey:        getEnv("SUPABASE_KEY", ""),
		SupabaseServiceKey: getEnv("SUPABASE_SERVICE_KEY", ""),
		DatabaseURL:        getEnv("DATABASE_URL", ""),

		JWTSecret: getEnv("JWT_SECRET", "grawizah-secret-key-change-in-production"),

		GroqAPIKey: getEnv("GROQ_API_KEY", ""),
		GroqModel:  getEnv("GROQ_MODEL", "llama-3.1-70b-versatile"),

		GoogleClientID:        getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret:    getEnv("GOOGLE_CLIENT_SECRET", ""),
		FacebookClientID:      getEnv("FACEBOOK_CLIENT_ID", ""),
		FacebookClientSecret:  getEnv("FACEBOOK_CLIENT_SECRET", ""),
		GitHubClientID:        getEnv("GITHUB_CLIENT_ID", ""),
		GitHubClientSecret:    getEnv("GITHUB_CLIENT_SECRET", ""),
		InstagramClientID:     getEnv("INSTAGRAM_CLIENT_ID", ""),
		InstagramClientSecret: getEnv("INSTAGRAM_CLIENT_SECRET", ""),

		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     smtpPort,
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", "noreply@grawizah.com"),

		RateLimitRequests: rateLimitRequests,
		RateLimitDuration: rateLimitDuration,

		AppURL: getEnv("APP_URL", "http://localhost:3000"),
		FrontendURL: getEnv("FRONTEND_URL", "https://grawizah.vercel.app"),
	}, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

func (c *Config) GetSupabaseRESTURL() string {
	return fmt.Sprintf("%s/rest/v1", c.SupabaseURL)
}

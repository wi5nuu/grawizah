package routes

import (
	"database/sql"
	"net/http"

	"grawizah.com/backend/internal/config"
	"grawizah.com/backend/internal/handlers"
	"grawizah.com/backend/internal/middleware"
	"grawizah.com/backend/internal/models"
	"grawizah.com/backend/internal/services"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func SetupRouter(db *sql.DB, cfg *config.Config) http.Handler {
	// Initialize services
	authService := services.NewAuthService(db, cfg)
	auditService := services.NewAuditService(db)
	groqService := services.NewGroqService(cfg, db)
	productService := services.NewProductService(db, groqService)
	companyService := services.NewCompanyService(db)
	inquiryService := services.NewInquiryService(db)
	subscriptionService := services.NewSubscriptionService(db)
	buyerRadarService := services.NewBuyerRadarService(db, groqService)
	buyerService := services.NewBuyerService(db)
	documentService := services.NewDocumentService(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService, auditService)
	productHandler := handlers.NewProductHandler(productService)
	inquiryHandler := handlers.NewInquiryHandler(inquiryService)
	adminHandler := handlers.NewAdminHandler(companyService, subscriptionService)
	aiHandler := handlers.NewAIHandler(groqService, productService)
	buyerRadarHandler := handlers.NewBuyerRadarHandler(buyerRadarService)
	companyHandler := handlers.NewCompanyHandler(companyService)
	productSpecHandler := handlers.NewProductSpecHandler(productService)
	productFAQHandler := handlers.NewProductFAQHandler(productService)
	userProfileHandler := handlers.NewUserProfileHandler(authService)
	buyerHandler := handlers.NewBuyerHandler(buyerService)
	subscriptionHandler := handlers.NewSubscriptionHandler(subscriptionService)
	dashboardHandler := handlers.NewDashboardHandler(db)
	documentHandler := handlers.NewDocumentHandler(documentService, companyService)

	// Initialize router
	r := chi.NewRouter()

	// Global middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(middleware.LoggingMiddleware())
	r.Use(middleware.SecurityMiddleware())

	// Initialize rate limiter
	middleware.InitRateLimiter(cfg.RateLimitRequests, cfg.RateLimitDuration)
	r.Use(middleware.RateLimitMiddleware())

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"grawizah-backend"}`))
	})

	// API v1 routes
	r.Route("/api/v1", func(r chi.Router) {
		// Public routes
		r.Group(func(r chi.Router) {
			r.Route("/auth", func(r chi.Router) {
				authHandler.Routes(r)
			})
		})

		// Optional auth routes (public catalog)
		r.With(middleware.OptionalAuthMiddleware(cfg)).Group(func(r chi.Router) {
			r.Route("/products", func(r chi.Router) {
				productHandler.Routes(r)
				r.Route("/specs", func(r chi.Router) {
					productSpecHandler.Routes(r)
				})
				r.Route("/faq", func(r chi.Router) {
					productFAQHandler.Routes(r)
				})
			})
		})

		// Authenticated routes
		r.With(middleware.AuthMiddleware(cfg)).Group(func(r chi.Router) {
			// User Profile
			r.Route("/profile", func(r chi.Router) {
				userProfileHandler.Routes(r)
			})

			// Dashboard stats
			r.Route("/dashboard", func(r chi.Router) {
				dashboardHandler.Routes(r)
			})

			// Company management
			r.Route("/companies", func(r chi.Router) {
				companyHandler.Routes(r)
			})

			// Document Vault
			r.Route("/documents", func(r chi.Router) {
				documentHandler.Routes(r)
			})

			// Inquiries
			r.Route("/inquiries", func(r chi.Router) {
				inquiryHandler.Routes(r)
			})

			// AI services (with usage limits) - Optional auth for guest previews
			r.With(middleware.OptionalAuthMiddleware(cfg), middleware.AIUsageMiddleware(db)).Route("/ai", func(r chi.Router) {
				aiHandler.Routes(r)
			})

			// Buyer routes
			r.Route("/buyer", func(r chi.Router) {
				buyerHandler.Routes(r)
			})

			// Subscription management
			r.Route("/subscription", func(r chi.Router) {
				subscriptionHandler.Routes(r)
			})
		})

		// Premium routes (Premium Trader only - Intelligence features)
		r.With(
			middleware.AuthMiddleware(cfg),
			middleware.PremiumMiddleware(db),
		).Group(func(r chi.Router) {
			r.Route("/intelligence", func(r chi.Router) {
				buyerRadarHandler.Routes(r)
			})
		})

		// Admin routes
		r.With(middleware.AuthMiddleware(cfg), middleware.RoleMiddleware(models.RoleAdmin)).Group(func(r chi.Router) {
			r.Route("/admin", func(r chi.Router) {
				adminHandler.Routes(r)
			})
		})
	})

	return r
}

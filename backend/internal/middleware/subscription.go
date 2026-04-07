package middleware

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"grawizah.com/backend/internal/models"
)

// PremiumMiddleware checks if the user has an active premium subscription
func PremiumMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get user info from context (set by AuthMiddleware)
			userID, ok := r.Context().Value("user_id").(string)
			if !ok {
				http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
				return
			}

			role, _ := r.Context().Value("role").(string)

			// Admins always have access to premium features
			if role == string(models.RoleAdmin) {
				next.ServeHTTP(w, r)
				return
			}

			// Check subscription status
			var subscription models.Subscription
			err := db.QueryRow(`
				SELECT s.id, s.company_id, s.plan, s.start_date, s.end_date, s.auto_renew
				FROM subscriptions s
				JOIN companies c ON c.id = s.company_id
				WHERE c.owner_id = $1
				AND s.end_date >= NOW()
				ORDER BY s.end_date DESC
				LIMIT 1
			`, userID).Scan(
				&subscription.ID,
				&subscription.CompanyID,
				&subscription.Plan,
				&subscription.StartDate,
				&subscription.EndDate,
				&subscription.AutoRenew,
			)

			if err != nil {
				if err == sql.ErrNoRows {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusForbidden)
					json.NewEncoder(w).Encode(models.APIResponse{
						Success: false,
						Message: "Premium subscription required",
						Data:    nil,
					})
					return
				}
				http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
				return
			}

			// Check if subscription is premium or enterprise
			if subscription.Plan != models.PlanPremium && subscription.Plan != models.PlanEnterprise {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusForbidden)
				json.NewEncoder(w).Encode(models.APIResponse{
					Success: false,
					Message: "Premium subscription required. Please upgrade your plan.",
					Data: map[string]interface{}{
						"current_plan":  subscription.Plan,
						"required_plan": "premium",
					},
				})
				return
			}

			// Add subscription to context for downstream handlers
			ctx := context.WithValue(r.Context(), SubscriptionKey, &subscription)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetSubscriptionFromContext retrieves the subscription from the request context
func GetSubscriptionFromContext(r *http.Request) *models.Subscription {
	sub, ok := r.Context().Value(SubscriptionKey).(*models.Subscription)
	if !ok {
		return nil
	}
	return sub
}

// AIUsageMiddleware checks if the user has remaining AI quota
func AIUsageMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIDVal := r.Context().Value(UserIDKey)
			roleVal := r.Context().Value(UserRoleKey)

			userID, _ := userIDVal.(string)
			role, _ := roleVal.(string)

			if role == "" {
				role = string(models.RoleGuest)
			}

			// Define daily AI limits per role
			dailyLimits := map[string]int{
				string(models.RoleGuest):  1,  // Guests get 1 preview check/day
				string(models.RoleTrader): 3,  // Free traders get 3 checks/day
				string(models.RoleBuyer):  5,  // Buyers get 5 checks/day
				string(models.RoleAdmin):  -1, // Unlimited for admins
			}

			limit, exists := dailyLimits[role]
			if !exists {
				limit = 0
			}

			// Unlimited for admins
			if limit < 0 {
				next.ServeHTTP(w, r)
				return
			}

			// If user is guest (no userID), skip premium and history check (limit handled later if 0)
			if userID == "" {
				if limit > 0 {
					next.ServeHTTP(w, r)
				} else {
					http.Error(w, `{"error":"Daily AI usage limit exceeded"}`, http.StatusTooManyRequests)
				}
				return
			}

			// Check if user has premium subscription (unlimited AI)
			var plan string
			err := db.QueryRow(`
				SELECT s.plan
				FROM subscriptions s
				JOIN companies c ON c.id = s.company_id
				WHERE c.owner_id = $1
				AND s.end_date >= NOW()
				AND s.plan IN ('premium', 'enterprise')
				LIMIT 1
			`, userID).Scan(&plan)

			if err == nil && plan != "" {
				// Premium user has unlimited AI
				next.ServeHTTP(w, r)
				return
			}

			// Check daily usage count
			today := time.Now().Truncate(24 * time.Hour)
			var count int
			err = db.QueryRow(`
				SELECT COUNT(*)
				FROM ai_compliance_history
				WHERE user_id = $1
				AND checked_at >= $2
			`, userID, today).Scan(&count)

			if err != nil {
				// If we can't check usage, allow the request (fail open)
				next.ServeHTTP(w, r)
				return
			}

			if count >= limit {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusTooManyRequests)
				json.NewEncoder(w).Encode(models.APIResponse{
					Success: false,
					Message: "Daily AI usage limit exceeded. Upgrade to Premium for unlimited access.",
					Data: map[string]interface{}{
						"used":      count,
						"limit":     limit,
						"resets_at": today.Add(24 * time.Hour).Format(time.RFC3339),
					},
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

type DashboardHandler struct {
	db *sql.DB
}

func NewDashboardHandler(db *sql.DB) *DashboardHandler {
	return &DashboardHandler{db: db}
}

func (h *DashboardHandler) Routes(r chi.Router) {
	r.Get("/stats", h.GetStats)
	r.Get("/inquiries", h.GetRecentInquiries)
	r.Get("/products/top", h.GetTopProducts)
	r.Get("/ai-usage", h.GetAIUsage)
}

type DashboardStats struct {
	TotalProducts   int `json:"total_products"`
	ActiveInquiries int `json:"active_inquiries"`
	TotalAIUsage    int `json:"total_ai_usage"`
	ProfileViews    int `json:"profile_views"`
	VerifiedBuyers  int `json:"verified_buyers"`
}

func (h *DashboardHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	var stats DashboardStats

	// Total products for this user's company
	err := h.db.QueryRow(`
		SELECT COUNT(*) FROM products p
		JOIN companies c ON p.company_id = c.id
		WHERE c.owner_id = $1
	`, userID).Scan(&stats.TotalProducts)
	if err != nil {
		stats.TotalProducts = 0
	}

	// Active inquiries (where user is the company owner or inquiry recipient)
	err = h.db.QueryRow(`
		SELECT COUNT(*) FROM inquiries
		WHERE company_id IN (SELECT id FROM companies WHERE owner_id = $1)
		AND status IN ('open', 'responded')
	`, userID).Scan(&stats.ActiveInquiries)
	if err != nil {
		stats.ActiveInquiries = 0
	}

	// Total AI usage (sum of all AI usage for this user)
	err = h.db.QueryRow(`
		SELECT COALESCE(SUM(usage_count), 0) FROM ai_usage
		WHERE user_id = $1
		AND usage_date >= date_trunc('month', CURRENT_DATE)
	`, userID).Scan(&stats.TotalAIUsage)
	if err != nil {
		stats.TotalAIUsage = 0
	}

	// Profile views (if table exists, otherwise default to 0)
	err = h.db.QueryRow(`
		SELECT COALESCE(SUM(view_count), 0) FROM profile_views
		WHERE user_id = $1
	`, userID).Scan(&stats.ProfileViews)
	if err != nil {
		// Table might not exist, default to 0
		stats.ProfileViews = 0
	}

	// Verified buyers (users with role 'buyer' who are verified)
	err = h.db.QueryRow(`
		SELECT COUNT(*) FROM users
		WHERE role = 'buyer' AND is_email_verified = true
	`).Scan(&stats.VerifiedBuyers)
	if err != nil {
		stats.VerifiedBuyers = 0
	}

	sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
		"success": true,
		"data":    stats,
	})
}

type RecentInquiry struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Product   string    `json:"product"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	Avatar    string    `json:"avatar"`
}

func (h *DashboardHandler) GetRecentInquiries(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	rows, err := h.db.Query(`
		SELECT i.id, u.full_name, i.subject, i.status, i.created_at
		FROM inquiries i
		LEFT JOIN users u ON i.created_by = u.id
		WHERE i.company_id IN (SELECT id FROM companies WHERE owner_id = $1)
		ORDER BY i.created_at DESC
		LIMIT 10
	`, userID)
	if err != nil {
		sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
			"success": true,
			"data":    []RecentInquiry{},
		})
		return
	}
	defer rows.Close()

	var inquiries []RecentInquiry
	for rows.Next() {
		var iq RecentInquiry
		if err := rows.Scan(&iq.ID, &iq.Name, &iq.Product, &iq.Status, &iq.CreatedAt); err != nil {
			continue
		}
		if len(iq.Name) > 0 {
			iq.Avatar = string(iq.Name[0])
		}
		inquiries = append(inquiries, iq)
	}

	if inquiries == nil {
		inquiries = []RecentInquiry{}
	}

	sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
		"success": true,
		"data":    inquiries,
	})
}

type TopProduct struct {
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Views    int     `json:"views"`
	Rating   float64 `json:"rating"`
}

func (h *DashboardHandler) GetTopProducts(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	rows, err := h.db.Query(`
		SELECT p.title, p.category, 0 as views, 0.0 as rating
		FROM products p
		JOIN companies c ON p.company_id = c.id
		WHERE c.owner_id = $1
		AND p.is_active = true
		ORDER BY p.created_at DESC
		LIMIT 10
	`, userID)
	if err != nil {
		sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
			"success": true,
			"data":    []TopProduct{},
		})
		return
	}
	defer rows.Close()

	var products []TopProduct
	for rows.Next() {
		var p TopProduct
		if err := rows.Scan(&p.Name, &p.Category, &p.Views, &p.Rating); err != nil {
			continue
		}
		products = append(products, p)
	}

	if products == nil {
		products = []TopProduct{}
	}

	sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
		"success": true,
		"data":    products,
	})
}

type AIUsageStat struct {
	Type  string `json:"type"`
	Count int    `json:"count"`
}

func (h *DashboardHandler) GetAIUsage(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	rows, err := h.db.Query(`
		SELECT feature_type, COALESCE(SUM(usage_count), 0) as count
		FROM ai_usage
		WHERE user_id = $1
		AND usage_date >= date_trunc('month', CURRENT_DATE)
		GROUP BY feature_type
	`, userID)
	if err != nil {
		sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
			"success": true,
			"data": map[string]int{
				"hs_code":  0,
				"sanction": 0,
				"ocr":      0,
			},
		})
		return
	}
	defer rows.Close()

	usage := map[string]int{
		"hs_code":  0,
		"sanction": 0,
		"ocr":      0,
	}

	for rows.Next() {
		var stat AIUsageStat
		if err := rows.Scan(&stat.Type, &stat.Count); err != nil {
			continue
		}
		switch stat.Type {
		case "hs_code":
			usage["hs_code"] = stat.Count
		case "sanction":
			usage["sanction"] = stat.Count
		case "ocr":
			usage["ocr"] = stat.Count
		}
	}

	sendSuccessResponse(w, "Dashboard data retrieved", map[string]interface{}{
		"success": true,
		"data":    usage,
	})
}

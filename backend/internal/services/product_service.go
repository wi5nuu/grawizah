package services

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"

	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type ProductService struct {
	db          *sql.DB
	groqService *GroqService
}

func NewProductService(db *sql.DB, groqService *GroqService) *ProductService {
	return &ProductService{db: db, groqService: groqService}
}

// AddSpecification adds a specification to a product
func (s *ProductService) AddSpecification(productID uuid.UUID, key, value string) error {
	_, err := s.db.Exec(`
		INSERT INTO product_specifications (id, product_id, spec_key, spec_value, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`, uuid.New(), productID, key, value)
	return err
}

// GetSpecifications retrieves specifications for a product
func (s *ProductService) GetSpecifications(productID uuid.UUID) ([]models.Specification, error) {
	rows, err := s.db.Query(`
		SELECT spec_key, spec_value FROM product_specifications 
		WHERE product_id = $1 
		ORDER BY spec_key
	`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var specs []models.Specification
	for rows.Next() {
		var spec models.Specification
		if err := rows.Scan(&spec.Key, &spec.Value); err != nil {
			continue
		}
		specs = append(specs, spec)
	}

	return specs, nil
}

// DeleteSpecification deletes a specification
func (s *ProductService) DeleteSpecification(specID, productID uuid.UUID) error {
	_, err := s.db.Exec(`
		DELETE FROM product_specifications WHERE id = $1 AND product_id = $2
	`, specID, productID)
	return err
}

// AddProductFAQ adds FAQ to a product
func (s *ProductService) AddProductFAQ(productID uuid.UUID, question, answer string) error {
	_, err := s.db.Exec(`
		INSERT INTO product_faq (id, product_id, question, answer, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`, uuid.New(), productID, question, answer)
	return err
}

// GetProductFAQ retrieves FAQ for a product
func (s *ProductService) GetProductFAQ(productID uuid.UUID) ([]models.FAQ, error) {
	rows, err := s.db.Query(`
		SELECT question, answer FROM product_faq 
		WHERE product_id = $1 
		ORDER BY created_at
	`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var faqs []models.FAQ
	for rows.Next() {
		var faq models.FAQ
		if err := rows.Scan(&faq.Question, &faq.Answer); err != nil {
			continue
		}
		faqs = append(faqs, faq)
	}

	return faqs, nil
}

// DeleteProductFAQ deletes a FAQ
func (s *ProductService) DeleteProductFAQ(faqID, productID uuid.UUID) error {
	_, err := s.db.Exec(`
		DELETE FROM product_faq WHERE id = $1 AND product_id = $2
	`, faqID, productID)
	return err
}

// GetProductDetail360 retrieves complete product information with specs, FAQ, supplier info
func (s *ProductService) GetProductDetail360(productID uuid.UUID) (*models.ProductDetail, error) {
	var product models.Product
	err := s.db.QueryRow(`
		SELECT id, company_id, title, description, category, hs_code_manual, 
		       hs_code_ai_suggested, price_est_min, price_est_max, currency, 
		       images_url, is_active, created_at
		FROM products WHERE id = $1 AND is_active = true
	`, productID).Scan(
		&product.ID, &product.CompanyID, &product.Title, &product.Description,
		&product.Category, &product.HSCodeManual, &product.HSCodeAISuggested,
		&product.PriceMin, &product.PriceMax, &product.Currency,
		&product.ImagesURL, &product.IsActive, &product.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("product not found")
	}

	detail := &models.ProductDetail{
		Product: product,
	}

	// Get specifications
	specs, _ := s.GetSpecifications(productID)
	detail.Specifications = specs

	// Get FAQ
	faq, _ := s.GetProductFAQ(productID)
	detail.FAQ = faq

	// Get supplier info
	var supplierInfo models.SupplierInfo
	err = s.db.QueryRow(`
		SELECT c.company_name, c.is_verified, c.country
		FROM companies c WHERE c.id = $1
	`, product.CompanyID).Scan(
		&supplierInfo.CompanyName, &supplierInfo.IsVerified, &supplierInfo.Country,
	)
	if err == nil {
		detail.SupplierInfo = &supplierInfo
	}

	// Get related products (same category)
	relatedRows, _ := s.db.Query(`
		SELECT id FROM products 
		WHERE category = $1 AND id != $2 AND is_active = true 
		LIMIT 5
	`, product.Category, productID)

	if relatedRows != nil {
		defer relatedRows.Close()
		var related []uuid.UUID
		for relatedRows.Next() {
			var id uuid.UUID
			relatedRows.Scan(&id)
			related = append(related, id)
		}
		detail.RelatedProducts = related
	}

	return detail, nil
}

// GetRelatedProductsAI uses AI to recommend related products
func (s *ProductService) GetRelatedProductsAI(productID uuid.UUID, limit int) ([]models.ProductResponse, error) {
	var product models.Product
	err := s.db.QueryRow(`
		SELECT title, description, category FROM products WHERE id = $1
	`, productID).Scan(
		&product.Title, &product.Description, &product.Category,
	)
	if err != nil {
		return nil, fmt.Errorf("product not found")
	}

	// Use AI to find related products (or fallback to category match)
	rows, err := s.db.Query(`
		SELECT id, company_id, title, description, category, hs_code_manual, 
		       hs_code_ai_suggested, price_est_min, price_est_max, currency, 
		       images_url, is_active, created_at
		FROM products 
		WHERE category = $1 AND id != $2 AND is_active = true 
		LIMIT $3
		ORDER BY created_at DESC
	`, product.Category, productID, limit)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.ProductResponse
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(
			&p.ID, &p.CompanyID, &p.Title, &p.Description, &p.Category,
			&p.HSCodeManual, &p.HSCodeAISuggested, &p.PriceMin, &p.PriceMax,
			&p.Currency, &p.ImagesURL, &p.IsActive, &p.CreatedAt,
		); err != nil {
			continue
		}
		products = append(products, models.ProductResponse{
			ID:           p.ID,
			CompanyID:    p.CompanyID,
			Title:        p.Title,
			Description:  p.Description,
			Category:     p.Category,
			HSCodeManual: p.HSCodeManual,
			PriceMin:     p.PriceMin,
			PriceMax:     p.PriceMax,
			Currency:     p.Currency,
			ImagesURL:    p.ImagesURL,
			IsActive:     p.IsActive,
			CreatedAt:    p.CreatedAt,
		})
	}

	return products, nil
}

// CreateProduct creates a new product
func (s *ProductService) CreateProduct(req *models.ProductRequest, companyID uuid.UUID) (*models.ProductResponse, error) {
	productID := uuid.New()
	imagesURL, _ := json.Marshal(req.ImagesURL)

	if req.Currency == "" {
		req.Currency = "USD"
	}

	query := `
		INSERT INTO products (id, company_id, title, description, category, hs_code_manual, 
		                      price_est_min, price_est_max, currency, images_url, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW(), NOW())
		RETURNING id, company_id, title, description, category, hs_code_manual, 
		          price_est_min, price_est_max, currency, images_url, is_active, created_at
	`

	var product models.Product
	err := s.db.QueryRow(query, productID, companyID, req.Title, req.Description, req.Category,
		req.HSCode, req.PriceMin, req.PriceMax, req.Currency, imagesURL).Scan(
		&product.ID, &product.CompanyID, &product.Title, &product.Description, &product.Category,
		&product.HSCodeManual, &product.PriceMin, &product.PriceMax, &product.Currency,
		&product.ImagesURL, &product.IsActive, &product.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	// Get company info
	var companyName string
	var isVerified bool
	var isPremium bool

	companyQuery := `
		SELECT c.company_name, c.is_verified, 
		       CASE WHEN s.plan = 'premium' AND s.end_date > NOW() THEN true ELSE false END as is_premium
		FROM companies c
		LEFT JOIN subscriptions s ON c.id = s.company_id
		WHERE c.id = $1
		ORDER BY s.end_date DESC
		LIMIT 1
	`

	s.db.QueryRow(companyQuery, companyID).Scan(&companyName, &isVerified, &isPremium)

	return &models.ProductResponse{
		ID:           product.ID,
		CompanyID:    product.CompanyID,
		Title:        product.Title,
		Description:  product.Description,
		Category:     product.Category,
		HSCodeManual: product.HSCodeManual,
		PriceMin:     product.PriceMin,
		PriceMax:     product.PriceMax,
		Currency:     product.Currency,
		ImagesURL:    product.ImagesURL,
		IsActive:     product.IsActive,
		CompanyName:  companyName,
		IsVerified:   isVerified,
		IsPremium:    isPremium,
		CreatedAt:    product.CreatedAt,
	}, nil
}

// GetProduct retrieves a product by ID
func (s *ProductService) GetProduct(productID uuid.UUID, userID string, userRole string) (*models.ProductResponse, error) {
	query := `
		SELECT p.id, p.company_id, p.title, p.description, p.category, p.hs_code_manual, 
		       p.hs_code_ai_suggested, p.price_est_min, p.price_est_max, p.currency, 
		       p.images_url, p.is_active, p.created_at, c.company_name, c.is_verified
		FROM products p
		JOIN companies c ON p.company_id = c.id
		WHERE p.id = $1 AND p.is_active = true
	`

	var product models.ProductResponse
	err := s.db.QueryRow(query, productID).Scan(
		&product.ID, &product.CompanyID, &product.Title, &product.Description, &product.Category,
		&product.HSCodeManual, &product.HSCodeAISuggested, &product.PriceMin, &product.PriceMax,
		&product.Currency, &product.ImagesURL, &product.IsActive, &product.CreatedAt,
		&product.CompanyName, &product.IsVerified,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to query product: %w", err)
	}

	// Mask pricing and HS Code for guests
	if userRole == string(models.RoleGuest) {
		product.PriceMin = 0
		product.PriceMax = 0
		product.Currency = ""
		
		// Mask HS Code (keep first 3 digits if available)
		if len(product.HSCodeManual) > 3 {
			product.HSCodeManual = product.HSCodeManual[:3] + ".xxx"
		}
		if len(product.HSCodeAISuggested) > 3 {
			product.HSCodeAISuggested = product.HSCodeAISuggested[:3] + ".xxx"
		}
	}

	return &product, nil
}

// ListProducts retrieves products with filtering
func (s *ProductService) ListProducts(filter *models.ProductFilter) (*models.PaginatedResponse, error) {
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}

	// Build dynamic query
	whereClause := "WHERE p.is_active = true"
	args := []interface{}{}
	argCount := 1

	if filter.Category != "" {
		whereClause += fmt.Sprintf(" AND p.category = $%d", argCount)
		args = append(args, filter.Category)
		argCount++
	}

	if filter.Search != "" {
		whereClause += fmt.Sprintf(" AND (p.title ILIKE $%d OR p.description ILIKE $%d)", argCount, argCount)
		args = append(args, "%"+filter.Search+"%")
		argCount++
	}

	if filter.MinPrice > 0 {
		whereClause += fmt.Sprintf(" AND p.price_est_min >= $%d", argCount)
		args = append(args, filter.MinPrice)
		argCount++
	}

	if filter.MaxPrice > 0 {
		whereClause += fmt.Sprintf(" AND p.price_est_max <= $%d", argCount)
		args = append(args, filter.MaxPrice)
		argCount++
	}

	if filter.Country != "" {
		whereClause += fmt.Sprintf(" AND c.country = $%d", argCount)
		args = append(args, filter.Country)
		argCount++
	}

	if filter.IsVerified != nil {
		whereClause += fmt.Sprintf(" AND c.is_verified = $%d", argCount)
		args = append(args, *filter.IsVerified)
		argCount++
	}

	// Count total
	countQuery := fmt.Sprintf(`
		SELECT COUNT(*) FROM products p 
		JOIN companies c ON p.company_id = c.id 
		%s
	`, whereClause)

	var total int64
	err := s.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("failed to count products: %w", err)
	}

	// Get products
	offset := filter.GetOffset()
	args = append(args, filter.Limit, offset)

	query := fmt.Sprintf(`
		SELECT p.id, p.company_id, p.title, p.description, p.category, p.hs_code_manual, 
		       p.hs_code_ai_suggested, p.price_est_min, p.price_est_max, p.currency, 
		       p.images_url, p.is_active, p.created_at, c.company_name, c.is_verified
		FROM products p
		JOIN companies c ON p.company_id = c.id 
		%s
		ORDER BY p.created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argCount, argCount+1)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}
	defer rows.Close()

	var products []models.ProductResponse
	for rows.Next() {
		var product models.ProductResponse
		err := rows.Scan(
			&product.ID, &product.CompanyID, &product.Title, &product.Description, &product.Category,
			&product.HSCodeManual, &product.HSCodeAISuggested, &product.PriceMin, &product.PriceMax,
			&product.Currency, &product.ImagesURL, &product.IsActive, &product.CreatedAt,
			&product.CompanyName, &product.IsVerified,
		)
		if err != nil {
			continue
		}
		products = append(products, product)
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	return &models.PaginatedResponse{
		Data:       products,
		Total:      total,
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalPages: totalPages,
	}, nil
}

// UpdateProduct updates a product
func (s *ProductService) UpdateProduct(productID, companyID uuid.UUID, req *models.ProductRequest) (*models.ProductResponse, error) {
	// Verify ownership
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM products WHERE id = $1 AND company_id = $2)", productID, companyID).Scan(&exists)
	if err != nil || !exists {
		return nil, fmt.Errorf("product not found or unauthorized")
	}

	imagesURL, _ := json.Marshal(req.ImagesURL)
	if req.Currency == "" {
		req.Currency = "USD"
	}

	query := `
		UPDATE products 
		SET title = $1, description = $2, category = $3, hs_code_manual = $4,
		    price_est_min = $5, price_est_max = $6, currency = $7, images_url = $8, updated_at = NOW()
		WHERE id = $9
		RETURNING id, company_id, title, description, category, hs_code_manual, 
		          price_est_min, price_est_max, currency, images_url, is_active, created_at
	`

	var product models.Product
	err = s.db.QueryRow(query, req.Title, req.Description, req.Category, req.HSCode,
		req.PriceMin, req.PriceMax, req.Currency, imagesURL, productID).Scan(
		&product.ID, &product.CompanyID, &product.Title, &product.Description, &product.Category,
		&product.HSCodeManual, &product.PriceMin, &product.PriceMax, &product.Currency,
		&product.ImagesURL, &product.IsActive, &product.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update product: %w", err)
	}

	var companyName string
	var isVerified bool
	s.db.QueryRow("SELECT company_name, is_verified FROM companies WHERE id = $1", companyID).Scan(&companyName, &isVerified)

	return &models.ProductResponse{
		ID:           product.ID,
		CompanyID:    product.CompanyID,
		Title:        product.Title,
		Description:  product.Description,
		Category:     product.Category,
		HSCodeManual: product.HSCodeManual,
		PriceMin:     product.PriceMin,
		PriceMax:     product.PriceMax,
		Currency:     product.Currency,
		ImagesURL:    product.ImagesURL,
		IsActive:     product.IsActive,
		CompanyName:  companyName,
		IsVerified:   isVerified,
		CreatedAt:    product.CreatedAt,
	}, nil
}

// DeleteProduct soft deletes a product
func (s *ProductService) DeleteProduct(productID, companyID uuid.UUID) error {
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM products WHERE id = $1 AND company_id = $2)", productID, companyID).Scan(&exists)
	if err != nil || !exists {
		return fmt.Errorf("product not found or unauthorized")
	}

	_, err = s.db.Exec("UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1", productID)
	return err
}

// SuggestHSCode uses AI to suggest HS Code
func (s *ProductService) SuggestHSCode(productID uuid.UUID, userID uuid.UUID) (*models.HSCodeResponse, error) {
	var product models.Product
	err := s.db.QueryRow(`
		SELECT id, company_id, title, description, category, hs_code_manual 
		FROM products WHERE id = $1
	`, productID).Scan(
		&product.ID, &product.CompanyID, &product.Title, &product.Description,
		&product.Category, &product.HSCodeManual,
	)
	if err != nil {
		return nil, fmt.Errorf("product not found: %w", err)
	}

	hsCodeReq := &models.HSCodeRequest{
		ProductName:        product.Title,
		ProductDescription: product.Description,
	}

	response, err := s.groqService.ClassifyHSCode(hsCodeReq)
	if err != nil {
		return nil, err
	}

	// Update product with AI suggestion
	_, err = s.db.Exec("UPDATE products SET hs_code_ai_suggested = $1, updated_at = NOW() WHERE id = $2", response.HSCode, productID)
	if err != nil {
		return nil, fmt.Errorf("failed to update product with HS Code: %w", err)
	}

	// Save to AI history
	payload, _ := json.Marshal(hsCodeReq)
	aiResponse, _ := json.Marshal(response)

	s.groqService.SaveAIHistory(&models.AIComplianceHistory{
		ProductID:       &productID,
		UserID:          userID,
		FeatureType:     models.FeatureHSCode,
		InputPayload:    payload,
		AIResponse:      aiResponse,
		ConfidenceScore: response.ConfidenceScore,
	})

	return response, nil
}

// GetCompanyProducts retrieves all products for a company
func (s *ProductService) GetCompanyProducts(companyID uuid.UUID, page, limit int) (*models.PaginatedResponse, error) {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}

	offset := (page - 1) * limit

	var total int64
	err := s.db.QueryRow("SELECT COUNT(*) FROM products WHERE company_id = $1 AND is_active = true", companyID).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("failed to count products: %w", err)
	}

	rows, err := s.db.Query(`
		SELECT id, company_id, title, description, category, hs_code_manual, 
		       hs_code_ai_suggested, price_est_min, price_est_max, currency, 
		       images_url, is_active, created_at
		FROM products 
		WHERE company_id = $1 AND is_active = true
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`, companyID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}
	defer rows.Close()

	var products []models.ProductResponse
	for rows.Next() {
		var product models.Product
		err := rows.Scan(
			&product.ID, &product.CompanyID, &product.Title, &product.Description, &product.Category,
			&product.HSCodeManual, &product.HSCodeAISuggested, &product.PriceMin, &product.PriceMax,
			&product.Currency, &product.ImagesURL, &product.IsActive, &product.CreatedAt,
		)
		if err != nil {
			continue
		}
		products = append(products, models.ProductResponse{
			ID:           product.ID,
			CompanyID:    product.CompanyID,
			Title:        product.Title,
			Description:  product.Description,
			Category:     product.Category,
			HSCodeManual: product.HSCodeManual,
			PriceMin:     product.PriceMin,
			PriceMax:     product.PriceMax,
			Currency:     product.Currency,
			ImagesURL:    product.ImagesURL,
			IsActive:     product.IsActive,
			CreatedAt:    product.CreatedAt,
		})
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &models.PaginatedResponse{
		Data:       products,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}, nil
}

// SaveProduct saves a product to the user's comparison list
func (s *ProductService) SaveProduct(userID, productID uuid.UUID) error {
	_, err := s.db.Exec(`
		INSERT INTO saved_products (user_id, product_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, product_id) DO NOTHING
	`, userID, productID)
	return err
}

// UnsaveProduct removes a product from the user's comparison list
func (s *ProductService) UnsaveProduct(userID, productID uuid.UUID) error {
	_, err := s.db.Exec(`
		DELETE FROM saved_products WHERE user_id = $1 AND product_id = $2
	`, userID, productID)
	return err
}

// GetSavedProducts retrieves all products saved by the user
func (s *ProductService) GetSavedProducts(userID uuid.UUID) ([]models.ProductResponse, error) {
	rows, err := s.db.Query(`
		SELECT p.id, p.company_id, p.title, p.description, p.category, p.hs_code_manual, 
		       p.price_est_min, p.price_est_max, p.currency, p.images_url, p.is_active, 
		       p.created_at, c.company_name, c.is_verified
		FROM products p
		JOIN saved_products sp ON p.id = sp.product_id
		JOIN companies c ON p.company_id = c.id
		WHERE sp.user_id = $1 AND p.is_active = true
		ORDER BY sp.created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.ProductResponse
	for rows.Next() {
		var p models.ProductResponse
		err := rows.Scan(
			&p.ID, &p.CompanyID, &p.Title, &p.Description, &p.Category, &p.HSCodeManual,
			&p.PriceMin, &p.PriceMax, &p.Currency, &p.ImagesURL, &p.IsActive, &p.CreatedAt,
			&p.CompanyName, &p.IsVerified,
		)
		if err != nil {
			continue
		}
		products = append(products, p)
	}
	return products, nil
}

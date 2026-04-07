package services

import (
	"database/sql"
	"fmt"
	"time"

	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type CompanyService struct {
	db *sql.DB
}

func NewCompanyService(db *sql.DB) *CompanyService {
	return &CompanyService{db: db}
}

// CreateCompany creates a new company
func (s *CompanyService) CreateCompany(req *models.CompanyRequest, ownerID uuid.UUID) (*models.CompanyResponse, error) {
	companyID := uuid.New()

	query := `
		INSERT INTO companies (id, owner_id, company_name, tax_id, address, city, country, is_verified, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW(), NOW())
		RETURNING id, owner_id, company_name, tax_id, address, city, country, is_verified, created_at
	`

	var company models.Company
	err := s.db.QueryRow(query, companyID, ownerID, req.CompanyName, req.TaxID, req.Address, req.City, req.Country).Scan(
		&company.ID, &company.OwnerID, &company.CompanyName, &company.TaxID,
		&company.Address, &company.City, &company.Country, &company.IsVerified, &company.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create company: %w", err)
	}

	return &models.CompanyResponse{
		ID:          company.ID,
		OwnerID:     company.OwnerID,
		CompanyName: company.CompanyName,
		TaxID:       company.TaxID,
		Address:     company.Address,
		City:        company.City,
		Country:     company.Country,
		IsVerified:  company.IsVerified,
	}, nil
}

// GetCompany retrieves a company by ID
func (s *CompanyService) GetCompany(companyID uuid.UUID) (*models.CompanyResponse, error) {
	query := `
		SELECT id, owner_id, company_name, tax_id, address, city, country, is_verified, verified_at, created_at
		FROM companies WHERE id = $1
	`

	var company models.Company
	err := s.db.QueryRow(query, companyID).Scan(
		&company.ID, &company.OwnerID, &company.CompanyName, &company.TaxID,
		&company.Address, &company.City, &company.Country, &company.IsVerified,
		&company.VerifiedAt, &company.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("company not found")
		}
		return nil, fmt.Errorf("failed to query company: %w", err)
	}

	return &models.CompanyResponse{
		ID:          company.ID,
		OwnerID:     company.OwnerID,
		CompanyName: company.CompanyName,
		TaxID:       company.TaxID,
		Address:     company.Address,
		City:        company.City,
		Country:     company.Country,
		IsVerified:  company.IsVerified,
		VerifiedAt:  company.VerifiedAt,
	}, nil
}

// GetCompanyByOwnerID retrieves a company by owner ID
func (s *CompanyService) GetCompanyByOwnerID(ownerID uuid.UUID) (*models.CompanyResponse, error) {
	query := `
		SELECT id, owner_id, company_name, tax_id, address, city, country, is_verified, verified_at, created_at
		FROM companies WHERE owner_id = $1
	`

	var company models.Company
	err := s.db.QueryRow(query, ownerID).Scan(
		&company.ID, &company.OwnerID, &company.CompanyName, &company.TaxID,
		&company.Address, &company.City, &company.Country, &company.IsVerified,
		&company.VerifiedAt, &company.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No company yet
		}
		return nil, fmt.Errorf("failed to query company: %w", err)
	}

	return &models.CompanyResponse{
		ID:          company.ID,
		OwnerID:     company.OwnerID,
		CompanyName: company.CompanyName,
		TaxID:       company.TaxID,
		Address:     company.Address,
		City:        company.City,
		Country:     company.Country,
		IsVerified:  company.IsVerified,
		VerifiedAt:  company.VerifiedAt,
	}, nil
}

// UpdateCompany updates a company
func (s *CompanyService) UpdateCompany(companyID uuid.UUID, req *models.CompanyRequest) (*models.CompanyResponse, error) {
	query := `
		UPDATE companies 
		SET company_name = $1, tax_id = $2, address = $3, city = $4, country = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING id, owner_id, company_name, tax_id, address, city, country, is_verified, created_at
	`

	var company models.Company
	err := s.db.QueryRow(query, req.CompanyName, req.TaxID, req.Address, req.City, req.Country, companyID).Scan(
		&company.ID, &company.OwnerID, &company.CompanyName, &company.TaxID,
		&company.Address, &company.City, &company.Country, &company.IsVerified, &company.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update company: %w", err)
	}

	return &models.CompanyResponse{
		ID:          company.ID,
		OwnerID:     company.OwnerID,
		CompanyName: company.CompanyName,
		TaxID:       company.TaxID,
		Address:     company.Address,
		City:        company.City,
		Country:     company.Country,
		IsVerified:  company.IsVerified,
	}, nil
}

// VerifyCompany verifies a company (Admin only)
func (s *CompanyService) VerifyCompany(companyID, adminID uuid.UUID, isApproved bool) error {
	var verifiedAt *time.Time
	if isApproved {
		now := time.Now()
		verifiedAt = &now
	}

	query := `
		UPDATE companies 
		SET is_verified = $1, verified_by = $2, verified_at = $3, updated_at = NOW()
		WHERE id = $4
	`

	_, err := s.db.Exec(query, isApproved, adminID, verifiedAt, companyID)
	return err
}

// ListPendingVerification lists companies pending verification
func (s *CompanyService) ListPendingVerification(page, limit int) ([]models.CompanyResponse, error) {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	rows, err := s.db.Query(`
		SELECT id, owner_id, company_name, tax_id, address, city, country, is_verified, created_at
		FROM companies 
		WHERE is_verified = false
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query companies: %w", err)
	}
	defer rows.Close()

	var companies []models.CompanyResponse
	for rows.Next() {
		var company models.Company
		err := rows.Scan(
			&company.ID, &company.OwnerID, &company.CompanyName, &company.TaxID,
			&company.Address, &company.City, &company.Country, &company.IsVerified, &company.CreatedAt,
		)
		if err != nil {
			continue
		}
		companies = append(companies, models.CompanyResponse{
			ID:          company.ID,
			OwnerID:     company.OwnerID,
			CompanyName: company.CompanyName,
			TaxID:       company.TaxID,
			Address:     company.Address,
			City:        company.City,
			Country:     company.Country,
			IsVerified:  company.IsVerified,
		})
	}

	return companies, nil
}

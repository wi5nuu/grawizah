package services

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type CompanyDocument struct {
	ID        uuid.UUID `json:"id"`
	CompanyID uuid.UUID `json:"company_id"`
	DocType   string    `json:"doc_type"`
	FileName  string    `json:"file_name"`
	FileURL   string    `json:"file_url"`
	Status    string    `json:"status"`
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}

type DocumentService struct {
	db *sql.DB
}

func NewDocumentService(db *sql.DB) *DocumentService {
	return &DocumentService{db: db}
}

func (s *DocumentService) GetCompanyDocuments(companyID uuid.UUID) ([]CompanyDocument, error) {
	rows, err := s.db.Query(`
		SELECT id, company_id, doc_type, file_name, file_url, status, updated_at, created_at
		FROM company_documents
		WHERE company_id = $1
		ORDER BY created_at ASC
	`, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var docs []CompanyDocument
	for rows.Next() {
		var d CompanyDocument
		if err := rows.Scan(&d.ID, &d.CompanyID, &d.DocType, &d.FileName, &d.FileURL, &d.Status, &d.UpdatedAt, &d.CreatedAt); err != nil {
			return nil, err
		}
		docs = append(docs, d)
	}

	return docs, nil
}

func (s *DocumentService) UploadDocument(companyID uuid.UUID, docType, fileName, fileURL string) error {
	// Check if document of this type already exists to update it
	var existingID uuid.UUID
	err := s.db.QueryRow("SELECT id FROM company_documents WHERE company_id = $1 AND doc_type = $2", companyID, docType).Scan(&existingID)

	if err == sql.ErrNoRows {
		// Insert new
		_, err = s.db.Exec(`
			INSERT INTO company_documents (company_id, doc_type, file_name, file_url, status, updated_at)
			VALUES ($1, $2, $3, $4, 'pending', NOW())
		`, companyID, docType, fileName, fileURL)
	} else if err == nil {
		// Update existing
		_, err = s.db.Exec(`
			UPDATE company_documents
			SET file_name = $1, file_url = $2, status = 'pending', updated_at = NOW()
			WHERE id = $3
		`, fileName, fileURL, existingID)
	}

	return err
}

func (s *DocumentService) VerifyDocument(docID uuid.UUID, status string) error {
	_, err := s.db.Exec("UPDATE company_documents SET status = $1, updated_at = NOW() WHERE id = $2", status, docID)
	return err
}

package services

import (
	"database/sql"
	"fmt"

	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type InquiryService struct {
	db *sql.DB
}

func NewInquiryService(db *sql.DB) *InquiryService {
	return &InquiryService{db: db}
}

// CreateInquiry creates a new inquiry
func (s *InquiryService) CreateInquiry(req *models.InquiryRequest, senderID uuid.UUID) (*models.InquiryResponse, error) {
	inquiryID := uuid.New()
	leadSource := models.LeadSource(req.LeadSource)
	if leadSource == "" {
		leadSource = models.SourceInApp
	}

	query := `
		INSERT INTO inquiries (id, sender_id, receiver_id, product_id, initial_message, status, lead_source, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, 'open', $6, NOW(), NOW())
		RETURNING id, sender_id, receiver_id, product_id, initial_message, status, lead_source, created_at
	`

	var inquiry models.Inquiry
	err := s.db.QueryRow(query, inquiryID, senderID, req.ReceiverID, req.ProductID, req.InitialMessage, leadSource).Scan(
		&inquiry.ID, &inquiry.SenderID, &inquiry.ReceiverID, &inquiry.ProductID,
		&inquiry.InitialMessage, &inquiry.Status, &inquiry.LeadSource, &inquiry.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create inquiry: %w", err)
	}

	// Get additional info
	var senderName, companyName, productTitle string
	s.db.QueryRow("SELECT full_name FROM users WHERE id = $1", senderID).Scan(&senderName)
	s.db.QueryRow("SELECT company_name FROM companies WHERE id = $1", req.ReceiverID).Scan(&companyName)
	if req.ProductID != nil {
		s.db.QueryRow("SELECT title FROM products WHERE id = $1", *req.ProductID).Scan(&productTitle)
	}

	return &models.InquiryResponse{
		ID:             inquiry.ID,
		SenderID:       inquiry.SenderID,
		ReceiverID:     inquiry.ReceiverID,
		ProductID:      inquiry.ProductID,
		InitialMessage: inquiry.InitialMessage,
		Status:         inquiry.Status,
		LeadSource:     inquiry.LeadSource,
		SenderName:     senderName,
		CompanyName:    companyName,
		ProductTitle:   productTitle,
		CreatedAt:      inquiry.CreatedAt,
	}, nil
}

// GetInquiry retrieves an inquiry by ID
func (s *InquiryService) GetInquiry(inquiryID uuid.UUID) (*models.InquiryResponse, error) {
	query := `
		SELECT i.id, i.sender_id, i.receiver_id, i.product_id, i.initial_message, 
		       i.status, i.lead_source, i.created_at,
		       u.full_name as sender_name, c.company_name, p.title as product_title
		FROM inquiries i
		JOIN users u ON i.sender_id = u.id
		JOIN companies c ON i.receiver_id = c.id
		LEFT JOIN products p ON i.product_id = p.id
		WHERE i.id = $1
	`

	var inquiry models.InquiryResponse
	err := s.db.QueryRow(query, inquiryID).Scan(
		&inquiry.ID, &inquiry.SenderID, &inquiry.ReceiverID, &inquiry.ProductID,
		&inquiry.InitialMessage, &inquiry.Status, &inquiry.LeadSource, &inquiry.CreatedAt,
		&inquiry.SenderName, &inquiry.CompanyName, &inquiry.ProductTitle,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("inquiry not found")
		}
		return nil, fmt.Errorf("failed to query inquiry: %w", err)
	}

	return &inquiry, nil
}

// ListInquiries retrieves inquiries with filtering
func (s *InquiryService) ListInquiries(userID uuid.UUID, role string, page, limit int) ([]models.InquiryResponse, error) {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	var query string
	var rows *sql.Rows
	var err error

	if role == "buyer" || role == "guest" {
		// Buyer sees inquiries they sent
		query = `
			SELECT i.id, i.sender_id, i.receiver_id, i.product_id, i.initial_message, 
			       i.status, i.lead_source, i.created_at,
			       u.full_name as sender_name, c.company_name, p.title as product_title
			FROM inquiries i
			JOIN users u ON i.sender_id = u.id
			JOIN companies c ON i.receiver_id = c.id
			LEFT JOIN products p ON i.product_id = p.id
			WHERE i.sender_id = $1
			ORDER BY i.created_at DESC
			LIMIT $2 OFFSET $3
		`
		rows, err = s.db.Query(query, userID, limit, offset)
	} else {
		// Trader sees inquiries received by their company
		query = `
			SELECT i.id, i.sender_id, i.receiver_id, i.product_id, i.initial_message, 
			       i.status, i.lead_source, i.created_at,
			       u.full_name as sender_name, c.company_name, p.title as product_title
			FROM inquiries i
			JOIN users u ON i.sender_id = u.id
			JOIN companies c ON i.receiver_id = c.id
			LEFT JOIN products p ON i.product_id = p.id
			WHERE i.receiver_id IN (SELECT id FROM companies WHERE owner_id = $1)
			ORDER BY i.created_at DESC
			LIMIT $2 OFFSET $3
		`
		rows, err = s.db.Query(query, userID, limit, offset)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to query inquiries: %w", err)
	}
	defer rows.Close()

	var inquiries []models.InquiryResponse
	for rows.Next() {
		var inquiry models.InquiryResponse
		err := rows.Scan(
			&inquiry.ID, &inquiry.SenderID, &inquiry.ReceiverID, &inquiry.ProductID,
			&inquiry.InitialMessage, &inquiry.Status, &inquiry.LeadSource, &inquiry.CreatedAt,
			&inquiry.SenderName, &inquiry.CompanyName, &inquiry.ProductTitle,
		)
		if err != nil {
			continue
		}
		inquiries = append(inquiries, inquiry)
	}

	return inquiries, nil
}

// CreateMessage creates a new message in an inquiry
func (s *InquiryService) CreateMessage(inquiryID, senderID uuid.UUID, message string) (*models.MessageResponse, error) {
	// Verify inquiry exists and is open
	var status models.InquiryStatus
	err := s.db.QueryRow("SELECT status FROM inquiries WHERE id = $1", inquiryID).Scan(&status)
	if err != nil {
		return nil, fmt.Errorf("inquiry not found")
	}
	if status == models.StatusClosed {
		return nil, fmt.Errorf("inquiry is closed")
	}

	messageID := uuid.New()
	query := `
		INSERT INTO messages (id, inquiry_id, sender_id, message, created_at)
		VALUES ($1, $2, $3, $4, NOW())
		RETURNING id, inquiry_id, sender_id, message, created_at
	`

	var msg models.Message
	err = s.db.QueryRow(query, messageID, inquiryID, senderID, message).Scan(
		&msg.ID, &msg.InquiryID, &msg.SenderID, &msg.Message, &msg.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create message: %w", err)
	}

	// Update inquiry status to responded
	if status == models.StatusOpen {
		_, err = s.db.Exec("UPDATE inquiries SET status = 'responded', updated_at = NOW() WHERE id = $1", inquiryID)
		if err != nil {
			return nil, fmt.Errorf("failed to update inquiry status: %w", err)
		}
	}

	// Get sender name
	var senderName string
	s.db.QueryRow("SELECT full_name FROM users WHERE id = $1", senderID).Scan(&senderName)

	return &models.MessageResponse{
		ID:         msg.ID,
		InquiryID:  msg.InquiryID,
		SenderID:   msg.SenderID,
		Message:    msg.Message,
		SenderName: senderName,
		CreatedAt:  msg.CreatedAt,
	}, nil
}

// GetMessages retrieves all messages for an inquiry
func (s *InquiryService) GetMessages(inquiryID uuid.UUID) ([]models.MessageResponse, error) {
	rows, err := s.db.Query(`
		SELECT m.id, m.inquiry_id, m.sender_id, m.message, m.created_at, u.full_name
		FROM messages m
		JOIN users u ON m.sender_id = u.id
		WHERE m.inquiry_id = $1
		ORDER BY m.created_at ASC
	`, inquiryID)
	if err != nil {
		return nil, fmt.Errorf("failed to query messages: %w", err)
	}
	defer rows.Close()

	var messages []models.MessageResponse
	for rows.Next() {
		var msg models.Message
		var senderName string
		err := rows.Scan(&msg.ID, &msg.InquiryID, &msg.SenderID, &msg.Message, &msg.CreatedAt, &senderName)
		if err != nil {
			continue
		}
		messages = append(messages, models.MessageResponse{
			ID:         msg.ID,
			InquiryID:  msg.InquiryID,
			SenderID:   msg.SenderID,
			Message:    msg.Message,
			SenderName: senderName,
			CreatedAt:  msg.CreatedAt,
		})
	}

	return messages, nil
}

// CloseInquiry closes an inquiry
func (s *InquiryService) CloseInquiry(inquiryID uuid.UUID) error {
	_, err := s.db.Exec("UPDATE inquiries SET status = 'closed', updated_at = NOW() WHERE id = $1", inquiryID)
	return err
}

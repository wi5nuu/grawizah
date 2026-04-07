package services

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"grawizah.com/backend/internal/config"
	"grawizah.com/backend/internal/models"

	"github.com/google/uuid"
)

type GroqService struct {
	cfg    *config.Config
	client *http.Client
	db     *sql.DB
}

func NewGroqService(cfg *config.Config, db *sql.DB) *GroqService {
	return &GroqService{
		cfg:    cfg,
		client: &http.Client{Timeout: 30 * time.Second},
		db:     db,
	}
}

// ClassifyHSCode uses Groq AI to suggest HS Code based on product description
func (s *GroqService) ClassifyHSCode(req *models.HSCodeRequest) (*models.HSCodeResponse, error) {
	prompt := fmt.Sprintf(`You are an expert in international trade and HS (Harmonized System) Code classification. 
Given the following product information, provide the most accurate HS Code (6-10 digits).

Product Name: %s
Description: %s
Material: %s
Usage: %s

Please provide your response in the following JSON format:
{
  "hs_code": "The primary HS Code (10 digits if possible)",
  "description": "Official description of the HS Code",
  "confidence_score": 0-100 indicating your confidence level,
  "alternative_codes": ["Alternative HS Code 1", "Alternative HS Code 2"],
  "explanation": "Brief explanation of why this HS Code was chosen"
}

Only return valid JSON, no additional text.`, req.ProductName, req.ProductDescription, req.Material, req.Usage)

	response, err := s.callGroqAPI(prompt)
	if err != nil {
		return nil, err
	}

	var hsCodeResponse models.HSCodeResponse
	if err := json.Unmarshal([]byte(response), &hsCodeResponse); err != nil {
		// Try to extract JSON from response if it contains additional text
		jsonStr := extractJSON(response)
		if jsonStr != "" {
			if err := json.Unmarshal([]byte(jsonStr), &hsCodeResponse); err != nil {
				return nil, fmt.Errorf("failed to parse Groq response: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to parse Groq response: invalid JSON")
		}
	}

	return &hsCodeResponse, nil
}

// CheckSanction checks if an entity is on any sanctions list
func (s *GroqService) CheckSanction(req *models.SanctionCheckRequest) (*models.SanctionCheckResponse, error) {
	// First check local database
	dbMatches, err := s.checkSanctionDatabase(req)
	if err != nil {
		return nil, err
	}

	// Then use Groq AI for comprehensive analysis
	prompt := fmt.Sprintf(`You are a compliance officer specializing in international trade sanctions. 
Check if the following entity appears on any global sanctions lists (OFAC, UN, EU).

Entity Name: %s
Country: %s
Entity Type: %s

Analyze the risk and provide a comprehensive sanctions screening result in the following JSON format:
{
  "is_sanctioned": true/false,
  "risk_level": "LOW/MEDIUM/HIGH/CRITICAL",
  "match_found": true/false,
  "matches": [
    {
      "name": "Name on sanctions list",
      "list": "OFAC/UN/EU",
      "country": "Country",
      "match_score": 0.0-1.0,
      "reason": "Why this entity is sanctioned"
    }
  ],
  "recommendation": "Recommendation for proceeding with this entity"
}

Only return valid JSON, no additional text.`, req.EntityName, req.EntityCountry, req.EntityType)

	response, err := s.callGroqAPI(prompt)
	if err != nil {
		return nil, err
	}

	var sanctionResponse models.SanctionCheckResponse
	if err := json.Unmarshal([]byte(response), &sanctionResponse); err != nil {
		jsonStr := extractJSON(response)
		if jsonStr != "" {
			if err := json.Unmarshal([]byte(jsonStr), &sanctionResponse); err != nil {
				return nil, fmt.Errorf("failed to parse Groq response: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to parse Groq response: invalid JSON")
		}
	}

	// Merge database matches if any
	if len(dbMatches) > 0 {
		sanctionResponse.MatchFound = true
		sanctionResponse.Matches = append(sanctionResponse.Matches, dbMatches...)
		if sanctionResponse.RiskLevel == "LOW" {
			sanctionResponse.RiskLevel = "HIGH"
		}
	}

	return &sanctionResponse, nil
}

// ExtractDocumentData uses Groq AI to extract data from documents (OCR)
func (s *GroqService) ExtractDocumentData(req *models.OCRDocumentRequest) (*models.OCRDocumentResponse, error) {
	// In production, this would download the image and use Groq's vision capabilities
	// For now, we'll simulate the OCR extraction

	prompt := fmt.Sprintf(`You are an expert in international trade document processing. 
Given a %s document, extract all relevant information and return it in JSON format.

Expected fields for %s:
- For Invoice: Invoice Number, Date, Seller Name, Buyer Name, Items (description, quantity, unit price, total), Total Amount, Currency, Payment Terms
- For Bill of Lading: BL Number, Shipper, Consignee, Notify Party, Vessel Name, Port of Loading, Port of Discharge, Description of Goods, Weight, Volume
- For Packing List: Invoice Number, Package Count, Package Type, Gross Weight, Net Weight, Dimensions, Contents

Return the extracted data in the following JSON format:
{
  "extracted_data": {
    // All extracted fields
  },
  "confidence_score": 0-100,
  "document_type": "%s",
  "raw_text": "Full text if available"
}

Only return valid JSON, no additional text.`, req.DocumentType, req.DocumentType, req.DocumentType)

	response, err := s.callGroqAPI(prompt)
	if err != nil {
		return nil, err
	}

	var ocrResponse models.OCRDocumentResponse
	if err := json.Unmarshal([]byte(response), &ocrResponse); err != nil {
		jsonStr := extractJSON(response)
		if jsonStr != "" {
			if err := json.Unmarshal([]byte(jsonStr), &ocrResponse); err != nil {
				return nil, fmt.Errorf("failed to parse Groq response: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to parse Groq response: invalid JSON")
		}
	}

	return &ocrResponse, nil
}

// GenerateMarketInsight uses Groq AI to generate market intelligence
func (s *GroqService) GenerateMarketInsight(category, country string) (*models.MarketInsightResponse, error) {
	prompt := fmt.Sprintf(`You are a market intelligence analyst specializing in international B2B trade. 
Analyze the market for the following product category in %s.

Category: %s
Target Country: %s

Provide a comprehensive market analysis in the following JSON format:
{
  "category": "%s",
  "country": "%s",
  "trend_data": {
    "growth_rate": "X%%",
    "market_size": "Market size description",
    "key_trends": ["Trend 1", "Trend 2", "Trend 3"]
  },
  "avg_price": 0.0,
  "demand_level": "LOW/MEDIUM/HIGH",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "competitors": [
    {
      "company_name": "Competitor Name",
      "country": "Country",
      "price_range": "$X - $Y",
      "market_share": 0.0,
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1"]
    }
  ]
}

Only return valid JSON, no additional text.`, country, category, country, category, country)

	response, err := s.callGroqAPI(prompt)
	if err != nil {
		return nil, err
	}

	var insight models.MarketInsightResponse
	if err := json.Unmarshal([]byte(response), &insight); err != nil {
		jsonStr := extractJSON(response)
		if jsonStr != "" {
			if err := json.Unmarshal([]byte(jsonStr), &insight); err != nil {
				return nil, fmt.Errorf("failed to parse Groq response: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to parse Groq response: invalid JSON")
		}
	}

	return &insight, nil
}

// callGroqAPI makes the actual API call to Groq
func (s *GroqService) callGroqAPI(prompt string) (string, error) {
	requestBody := map[string]interface{}{
		"model": s.cfg.GroqModel,
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": "You are a professional B2B trade intelligence AI assistant. Always respond with valid JSON when requested.",
			},
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"temperature": 0.3,
		"max_tokens":  2000,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request body: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.cfg.GroqAPIKey)

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call Groq API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("Groq API error (status %d): %s", resp.StatusCode, string(body))
	}

	var groqResponse map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&groqResponse); err != nil {
		return "", fmt.Errorf("failed to decode Groq response: %w", err)
	}

	// Extract the message content
	choices, ok := groqResponse["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return "", fmt.Errorf("invalid Groq response format")
	}

	choice := choices[0].(map[string]interface{})
	message := choice["message"].(map[string]interface{})
	content := message["content"].(string)

	return content, nil
}

// checkSanctionDatabase checks the local sanctions database
func (s *GroqService) checkSanctionDatabase(req *models.SanctionCheckRequest) ([]models.SanctionMatch, error) {
	query := `SELECT name, alias, country, list_source, reason FROM sanction_list 
			  WHERE is_active = true AND (
				name ILIKE $1 OR 
				country ILIKE $2 OR
				$1 = ANY(alias)
			  )`

	rows, err := s.db.Query(query, "%"+req.EntityName+"%", "%"+req.EntityCountry+"%")
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	defer rows.Close()

	var matches []models.SanctionMatch
	for rows.Next() {
		var match models.SanctionMatch
		var alias []string
		err := rows.Scan(&match.Name, &alias, &match.Country, &match.List, &match.Reason)
		if err != nil {
			continue
		}
		match.MatchScore = 0.8 // High confidence for exact DB match
		matches = append(matches, match)
	}

	return matches, nil
}

// SaveAIHistory saves AI interaction to database
func (s *GroqService) SaveAIHistory(history *models.AIComplianceHistory) error {
	query := `
		INSERT INTO ai_compliance_history (id, product_id, user_id, feature_type, input_payload, ai_response, confidence_score, checked_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
	`
	_, err := s.db.Exec(query, uuid.New(), history.ProductID, history.UserID, history.FeatureType, history.InputPayload, history.AIResponse, history.ConfidenceScore)
	return err
}

// Helper function to extract JSON from text
func extractJSON(text string) string {
	start := strings.Index(text, "{")
	end := strings.LastIndex(text, "}")

	if start == -1 || end == -1 || end <= start {
		return ""
	}

	return text[start : end+1]
}

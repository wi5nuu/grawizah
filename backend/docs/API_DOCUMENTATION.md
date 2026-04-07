# Grawizah Backend API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 Register
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "role": "trader"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "a1b2c3d4e5f6...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "trader",
      "created_at": "2026-04-06T10:00:00Z"
    },
    "expires_in": 86400
  }
}
```

### 1.2 Login
**POST** `/auth/login`

Authenticate with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "a1b2c3d4e5f6...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "trader",
      "created_at": "2026-04-06T10:00:00Z"
    },
    "expires_in": 86400
  }
}
```

### 1.3 OAuth Login
**POST** `/auth/oauth/login`

Login using OAuth2 providers (Google, Facebook, GitHub).

**Request Body:**
```json
{
  "provider": "google",
  "code": "oauth_authorization_code"
}
```

### 1.4 Get OAuth URL
**GET** `/auth/oauth/url/{provider}?state=random_state`

Get OAuth2 authorization URL.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "OAuth URL generated",
  "data": {
    "url": "https://accounts.google.com/o/oauth2/auth?..."
  }
}
```

### 1.5 Change Password
**POST** `/auth/password/change` (Authenticated)

Change user password.

**Request Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewSecurePass456!"
}
```

---

## 2. Product Endpoints

### 2.1 List Products (Public)
**GET** `/products`

Get paginated list of products with filters.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20)
- `category` (string): Filter by category
- `search` (string): Search in title/description
- `min_price` (float): Minimum price
- `max_price` (float): Maximum price
- `country` (string): Filter by supplier country
- `is_verified` (bool): Filter by verified suppliers

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "company_id": "uuid",
        "title": "Indonesian Coffee Beans",
        "description": "Premium arabica coffee...",
        "category": "Agriculture",
        "hs_code_manual": "0901.21",
        "hs_code_ai_suggested": "0901.21.0000",
        "price_min": 3.50,
        "price_max": 5.00,
        "currency": "USD",
        "images_url": ["https://..."],
        "is_active": true,
        "company_name": "PT Coffee Export",
        "is_verified": true,
        "created_at": "2026-04-06T10:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20,
    "total_pages": 8
  }
}
```

### 2.2 Get Product Details
**GET** `/products/{id}`

Get detailed product information.

### 2.3 Create Product (Authenticated)
**POST** `/products`

Create a new product listing.

**Request Body:**
```json
{
  "title": "Indonesian Coffee Beans",
  "description": "Premium arabica coffee from Aceh...",
  "category": "Agriculture",
  "hs_code_manual": "0901.21",
  "price_min": 3.50,
  "price_max": 5.00,
  "currency": "USD",
  "images_url": ["https://..."]
}
```

### 2.4 Update Product (Owner Only)
**PUT** `/products/{id}`

Update product details.

### 2.5 Delete Product (Owner Only)
**DELETE** `/products/{id}`

Soft delete a product.

### 2.6 Get HS Code Suggestion (Authenticated)
**POST** `/products/{id}/hs-code`

Get AI-powered HS Code suggestion.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "HS Code suggestion generated",
  "data": {
    "hs_code": "0901.21.0000",
    "description": "Coffee, roasted, not decaffeinated",
    "confidence_score": 95,
    "alternative_codes": ["0901.90"],
    "explanation": "Based on product description mentioning roasted arabica coffee beans..."
  }
}
```

### 2.7 Get Company Products
**GET** `/products/company/{company_id}`

Get all products from a specific company.

---

## 3. Inquiry Endpoints (Authenticated)

### 3.1 Create Inquiry
**POST** `/inquiries`

Send an inquiry to a supplier.

**Request Body:**
```json
{
  "receiver_id": "uuid",
  "product_id": "uuid",
  "initial_message": "I'm interested in your coffee beans. What's your MOQ?",
  "lead_source": "in_app"
}
```

### 3.2 List Inquiries
**GET** `/inquiries?page=1&limit=20`

Get user's inquiries (sent or received based on role).

### 3.3 Get Inquiry Details
**GET** `/inquiries/{id}`

Get specific inquiry details.

### 3.4 Send Message
**POST** `/inquiries/{id}/messages`

Send a message in an inquiry thread.

**Request Body:**
```json
{
  "message": "We can offer 1000kg at $4.50/kg FOB"
}
```

### 3.5 Get Messages
**GET** `/inquiries/{id}/messages`

Get all messages in an inquiry.

### 3.6 Close Inquiry
**POST** `/inquiries/{id}/close`

Close an inquiry thread.

---

## 4. AI Services (Authenticated)

### 4.1 HS Code Classification
**POST** `/ai/hs-code`

Classify product using AI.

**Request Body:**
```json
{
  "product_name": "Arabica Coffee Beans",
  "product_description": "Roasted arabica coffee beans from Indonesia",
  "material": "Coffee beans",
  "usage": "Beverage"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "HS Code classified successfully",
  "data": {
    "hs_code": "0901.21.0000",
    "description": "Coffee, roasted, not decaffeinated",
    "confidence_score": 95,
    "alternative_codes": ["0901.90"],
    "explanation": "Based on product description..."
  }
}
```

### 4.2 Sanction Check
**POST** `/ai/sanction-check`

Check if entity is on sanctions list.

**Request Body:**
```json
{
  "entity_name": "ABC Trading LLC",
  "entity_country": "Iran",
  "entity_type": "company"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Sanction check completed",
  "data": {
    "is_sanctioned": false,
    "risk_level": "MEDIUM",
    "match_found": false,
    "matches": [],
    "recommendation": "Proceed with standard due diligence. Country of operation has moderate risk."
  }
}
```

### 4.3 Document OCR Extraction
**POST** `/ai/ocr`

Extract data from trade documents.

**Request Body:**
```json
{
  "document_type": "invoice",
  "image_url": "https://storage.supabase.co/documents/invoice.pdf"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Document data extracted successfully",
  "data": {
    "extracted_data": {
      "invoice_number": "INV-2026-001",
      "date": "2026-04-06",
      "seller_name": "PT Export Indonesia",
      "buyer_name": "Global Trading Co",
      "items": [
        {
          "description": "Coffee Beans",
          "quantity": 1000,
          "unit_price": 4.50,
          "total": 4500.00
        }
      ],
      "total_amount": 4500.00,
      "currency": "USD"
    },
    "confidence_score": 92,
    "document_type": "invoice"
  }
}
```

---

## 5. Buyer Intelligence (Premium Only)

### 5.1 Get Buyer Radar
**GET** `/intelligence/buyers/{country}`

Get potential buyers by country.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Buyer radar data retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "company_name": "European Coffee Distributors GmbH",
      "target_country": "Germany",
      "buy_score": 87.5,
      "import_frequency": "Monthly",
      "last_import_date": "2026-03-15T00:00:00Z",
      "trade_history": [
        {
          "date": "2026-03-15",
          "product": "Coffee Beans",
          "quantity": "5000 kg",
          "origin": "Indonesia",
          "value": 22500.00
        }
      ]
    }
  ]
}
```

### 5.2 Get Market Insights
**GET** `/intelligence/insights?category=Agriculture&country=Germany`

Get AI-generated market insights.

### 5.3 Get Market Alerts
**GET** `/intelligence/alerts?unread=true`

Get market opportunity alerts.

### 5.4 Mark Alert as Read
**POST** `/intelligence/alerts/{id}/read`

Mark an alert as read.

---

## 6. Admin Endpoints (Admin Only)

### 6.1 List Pending Verifications
**GET** `/admin/pending?page=1&limit=20`

Get companies awaiting verification.

### 6.2 Verify Company
**POST** `/admin/verify/{id}`

Approve or reject company verification.

**Request Body:**
```json
{
  "company_id": "uuid",
  "is_approved": true,
  "notes": "Documents verified successfully"
}
```

---

## 7. Health Check

### 7.1 Service Health
**GET** `/health`

Check service health status.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "service": "grawizah-backend"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- Default: 100 requests per 60 seconds
- Rate limit headers included in response:
  - `Retry-After`: Seconds until limit resets

---

## Role-Based Access Control

| Endpoint | Guest | Trader | Premium | Buyer | Admin |
|----------|-------|--------|---------|-------|-------|
| GET /products | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /products | ❌ | ✅ | ✅ | ❌ | ❌ |
| POST /inquiries | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /ai/* | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /intelligence/* | ❌ | ❌ | ✅ | ❌ | ❌ |
| GET /admin/* | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /products?page=1&limit=20
```

**Response includes:**
```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "total_pages": 8
}
```

---

*Grawizah Intelligence Hub - 2026*

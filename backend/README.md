# Grawizah Backend API

The backend service for Grawizah - The Next-Gen B2B Export-Import Intelligence & Marketplace Hub.

## Features

- **Authentication & Authorization**: JWT-based auth with OAuth2 support (Google, Facebook, GitHub, Instagram)
- **Product Management**: Full CRUD operations for product catalog with AI-powered HS Code classification
- **Inquiry System**: Real-time messaging between buyers and traders
- **AI Compliance**: Groq AI integration for HS Code classification, Sanction Screening, and Document OCR
- **Buyer Intelligence**: Premium features including Buyer Radar and Market Insights
- **Subscription Management**: Tiered access (Free, Premium, Enterprise)
- **Admin Dashboard**: Company verification and system management
- **Security**: Rate limiting, password hashing (bcrypt), JWT tokens, security headers

## Tech Stack

- **Language**: Go 1.21+
- **Router**: go-chi/chi
- **Database**: PostgreSQL (via Supabase)
- **AI Engine**: Groq API (Llama 3)
- **Authentication**: JWT + OAuth2
- **Containerization**: Docker

## Architecture

```
backend/
├── cmd/
│   └── main.go                 # Application entry point
├── internal/
│   ├── config/                 # Configuration management
│   ├── database/               # Database connection & migrations
│   ├── handlers/               # HTTP request handlers
│   │   ├── auth_handler.go
│   │   ├── product_handler.go
│   │   ├── inquiry_handler.go
│   │   ├── ai_handler.go
│   │   ├── buyer_radar_handler.go
│   │   └── admin_handler.go
│   ├── middleware/             # HTTP middleware
│   │   ├── auth.go
│   │   ├── rate_limiter.go
│   │   └── common.go
│   ├── models/                 # Data models
│   │   ├── user.go
│   │   ├── company.go
│   │   ├── product.go
│   │   ├── inquiry.go
│   │   ├── ai_compliance.go
│   │   ├── buyer_radar.go
│   │   ├── subscription.go
│   │   ├── admin.go
│   │   ├── audit_log.go
│   │   └── common.go
│   ├── routes/                 # Route definitions
│   ├── services/               # Business logic
│   │   ├── auth_service.go
│   │   ├── product_service.go
│   │   ├── inquiry_service.go
│   │   ├── groq_service.go
│   │   ├── buyer_radar_service.go
│   │   ├── company_service.go
│   │   └── subscription_service.go
│   └── utils/                  # Utility functions
├── migrations/                 # Database migrations
├── docs/                       # API documentation
├── .env.example               # Environment variables template
├── Dockerfile                  # Docker configuration
├── go.mod                      # Go module definition
└── go.sum                      # Go dependencies
```

## Getting Started

### Prerequisites

- Go 1.21+
- PostgreSQL 14+ or Supabase account
- Groq API key
- OAuth2 credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grawizah/backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run migrations** (automatic on first run)

5. **Start the server**
   ```bash
   go run cmd/main.go
   ```

### Docker Deployment

```bash
# Build image
docker build -t grawizah-backend .

# Run container
docker run -p 8080:8080 --env-file .env grawizah-backend
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/oauth/login` - OAuth2 login
- `GET /api/v1/auth/oauth/url/{provider}` - Get OAuth2 URL
- `POST /api/v1/auth/password/change` - Change password
- `POST /api/v1/auth/password/reset` - Request password reset

### Products (Public with optional auth)
- `GET /api/v1/products` - List all products (with filters)
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/company/{company_id}` - Get company products
- `POST /api/v1/products` - Create product (Authenticated)
- `PUT /api/v1/products/{id}` - Update product (Owner)
- `DELETE /api/v1/products/{id}` - Delete product (Owner)
- `POST /api/v1/products/{id}/hs-code` - Get AI HS Code suggestion

### Inquiries (Authenticated)
- `POST /api/v1/inquiries` - Create inquiry
- `GET /api/v1/inquiries` - List user inquiries
- `GET /api/v1/inquiries/{id}` - Get inquiry details
- `POST /api/v1/inquiries/{id}/messages` - Send message
- `GET /api/v1/inquiries/{id}/messages` - Get messages
- `POST /api/v1/inquiries/{id}/close` - Close inquiry

### AI Services (Authenticated)
- `POST /api/v1/ai/hs-code` - Classify HS Code
- `POST /api/v1/ai/sanction-check` - Check sanctions list
- `POST /api/v1/ai/ocr` - Extract document data

### Buyer Intelligence (Premium)
- `GET /api/v1/intelligence/buyers/{country}` - Get buyer radar
- `GET /api/v1/intelligence/insights` - Get market insights
- `GET /api/v1/intelligence/alerts` - Get market alerts
- `POST /api/v1/intelligence/alerts/{id}/read` - Mark alert as read

### Admin (Admin Only)
- `GET /api/v1/admin/pending` - List pending verifications
- `POST /api/v1/admin/verify/{id}` - Verify/reject company

### Health Check
- `GET /health` - Service health status

## User Roles

| Role | Access Level |
|------|--------------|
| Guest | Browse catalog (masked pricing) |
| Verified Trader | Manage products, chat, limited AI |
| Premium Trader | Full buyer intelligence, unlimited AI |
| Buyer | Submit inquiries, validate documents |
| Admin | Verify companies, manage system |

## Database Schema

The database is automatically created and migrated on first run. Key tables:

- `users` - User accounts
- `companies` - Company profiles
- `products` - Product catalog
- `inquiries` - Buyer inquiries
- `messages` - Chat messages
- `ai_compliance_history` - AI usage history
- `buyer_radar` - Buyer intelligence data
- `market_insights` - Market analysis
- `subscriptions` - User subscriptions
- `sanction_list` - Global sanctions database
- `audit_logs` - System audit trail

## Security Features

- **Password Hashing**: bcrypt with cost factor 14
- **JWT Tokens**: 24-hour expiry with HMAC-SHA256
- **Rate Limiting**: Configurable requests per window
- **CORS**: Configured for cross-origin support
- **Security Headers**: HSTS, X-Frame-Options, CSP, etc.
- **Input Validation**: Request body validation on all endpoints
- **Role-Based Access**: Middleware-enforced role checks

## Environment Variables

See `.env.example` for all required environment variables.

## License

Proprietary - Grawizah Intelligence Hub 2026

## Support

For issues and questions, please contact the development team.

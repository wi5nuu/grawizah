---
title: Grawizah
emoji: 🚀
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 8080
app_file: backend/Dockerfile
pinned: false
---

# Grawizah - The Next-Gen B2B Export-Import Intelligence & Marketplace Hub

## 🌍 Project Overview

Grawizah is an innovative B2B digital platform designed as an "Intelligence Gateway" to bridge local suppliers/traders with global buyers. Unlike static marketplaces, Grawizah integrates Artificial Intelligence (AI) to address key international trade barriers: Legal Compliance and Market Intelligence.

## 📁 Project Structure

```
grawizah/
├── backend/          # Go backend API (REST, JWT, Groq AI)
│   ├── cmd/          # Application entry point
│   ├── internal/     # Internal packages (services, handlers, models)
│   │   ├── config/   # Environment configuration
│   │   ├── database/ # PostgreSQL connection & migrations
│   │   ├── handlers/ # 11 HTTP handler files
│   │   ├── middleware/ # Auth, rate limiting, CORS
│   │   ├── models/   # 12 data model files
│   │   ├── routes/   # Route definitions (48 endpoints)
│   │   ├── services/ # 9 business logic services
│   │   └── utils/    # Utility functions
│   ├── docs/         # API documentation
│   ├── Dockerfile    # Multi-stage Docker build
│   └── README.md     # Backend documentation
└── frontend/         # Next.js + Tailwind CSS frontend
    ├── app/          # App Router pages
    │   ├── page.tsx              # Home/Landing
    │   ├── login/page.tsx        # Login page
    │   ├── register/page.tsx     # Registration page
    │   ├── products/page.tsx     # Product catalog
    │   ├── products/[id]/page.tsx # Product detail 360°
    │   └── dashboard/            # Dashboard (5 sub-pages)
    ├── components/   # Reusable UI components
    │   ├── layout/   # Navbar, Footer
    │   └── ui/       # Button, Input, Card, Badge
    ├── lib/          # API integration layer
    └── public/       # Static assets & PWA manifest
```

## 🚀 Features

### Backend (Go) - ✅ 100% Complete
- 48 RESTful API endpoints
- 17 PostgreSQL tables (auto-migrated)
- JWT + OAuth2 authentication (Google, Facebook, GitHub, Instagram)
- AI integration with Groq (Llama 3)
- Rate limiting & security headers
- Docker deployment ready

### Frontend (Next.js) - ✅ 100% Complete
- **Branding**: Deep Royal Purple (#6D28D9), Electric Blue (#3B82F6), Montserrat font
- **Pages**: Home, Login, Register, Products Catalog, Product Detail (360° view), Dashboard
- **Dashboard**: Overview, Products Management, Inquiries, AI Tools, Intelligence
- **Components**: Reusable UI library with Purple/Blue theming
- **API Integration**: Full axios-based API client with interceptors
- **PWA Ready**: Manifest, responsive design, mobile bottom navigation
- **Build Status**: ✅ Compiles successfully (11 pages, 0 errors)

##  Brand Identity
- **Primary Purple**: Deep Royal Purple (#6D28D9) — Luxury & exclusivity
- **Accent Blue**: Electric Blue (#3B82F6) — Technology & trust
- **Base White**: Clean White — Professional & clean
- **Typography**: Montserrat — Modern, geometric, readable

## 🔐 User Roles
| Role | Access Level |
|------|--------------|
| **Guest** | Browse catalog (masked pricing) |
| **Verified Trader** | Manage products, chat, limited AI |
| **Premium Trader** | Full buyer intelligence, unlimited AI |
| **Buyer** | Submit inquiries, validate documents |
| **Admin** | Verify companies, manage system |

## 🛠️ Quick Start

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
go run cmd/main.go
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
cd backend
docker-compose up -d
```

## 📊 API Documentation
Complete API reference: `backend/docs/API_DOCUMENTATION.md`

---

**Grawizah Intelligence Hub - 2026**  
*Secure, Fast, & Intelligent Global Trade*

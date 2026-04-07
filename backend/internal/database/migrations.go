package database

import (
	"database/sql"
	"log"
)

func RunMigrations(db *sql.DB) error {
	log.Println("🔄 Running database migrations...")

	migrations := []string{
		createUsersTable,
		createSuperAdminsTable,
		createCompaniesTable,
		createBuyersTable,
		createProductsTable,
		createProductSpecificationsTable,
		createProductFAQTable,
		createInquiriesTable,
		createMessagesTable,
		createAIComplianceHistoryTable,
		createBuyerRadarTable,
		createMarketInsightsTable,
		createMarketAlertsTable,
		createSubscriptionsTable,
		createAuditLogsTable,
		createSanctionListTable,
		createLoginAttemptsTable,
		createAIUsageTable,
		createPasswordResetTable,
		createCompanyDocumentsTable,
		createSavedProductsTable,
		createIndexes,
	}

	for i, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			log.Printf("❌ Migration %d failed: %v", i+1, err)
			return err
		}
		log.Printf("✅ Migration %d completed", i+1)
	}

	log.Println("✅ All migrations completed successfully")
	return nil
}

const createUsersTable = `
-- Create role ENUM type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('guest', 'trader', 'buyer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    password_hash VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(100),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`

const createCompaniesTable = `
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES super_admins(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tax_id)
);
`

const createBuyersTable = `
CREATE TABLE IF NOT EXISTS buyers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    country_interest VARCHAR(100),
    trade_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buyers_country ON buyers(country_interest);
`

const createProductsTable = `
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    hs_code_manual VARCHAR(20),
    hs_code_ai_suggested VARCHAR(20),
    price_est_min DECIMAL(15, 2),
    price_est_max DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    images_url JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
`

const createProductSpecificationsTable = `
CREATE TABLE IF NOT EXISTS product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    spec_key VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_specs_product_id ON product_specifications(product_id);
`

const createProductFAQTable = `
CREATE TABLE IF NOT EXISTS product_faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_faq_product_id ON product_faq(product_id);
`

const createInquiriesTable = `
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    initial_message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    lead_source VARCHAR(50) DEFAULT 'in_app',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_sender_id ON inquiries(sender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_receiver_id ON inquiries(receiver_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
`

const createMessagesTable = `
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_inquiry_id ON messages(inquiry_id);
`

const createAIComplianceHistoryTable = `
CREATE TABLE IF NOT EXISTS ai_compliance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL,
    input_payload JSONB NOT NULL,
    ai_response JSONB NOT NULL,
    confidence_score INTEGER NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_compliance_product_id ON ai_compliance_history(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_compliance_user_id ON ai_compliance_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_compliance_feature_type ON ai_compliance_history(feature_type);
`

const createBuyerRadarTable = `
CREATE TABLE IF NOT EXISTS buyer_radar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_country VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    buy_score FLOAT NOT NULL,
    trade_history_data JSONB,
    import_frequency VARCHAR(50),
    last_import_date TIMESTAMP WITH TIME ZONE,
    preferred_products TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buyer_radar_country ON buyer_radar(target_country);
CREATE INDEX IF NOT EXISTS idx_buyer_radar_company ON buyer_radar(company_name);
`

const createMarketInsightsTable = `
CREATE TABLE IF NOT EXISTS market_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    trend_data JSONB,
    avg_price DECIMAL(15, 2),
    demand_level VARCHAR(50),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_insights_category ON market_insights(category);
CREATE INDEX IF NOT EXISTS idx_market_insights_country ON market_insights(country);
`

const createMarketAlertsTable = `
CREATE TABLE IF NOT EXISTS market_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_alerts_user_id ON market_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_market_alerts_is_read ON market_alerts(is_read);
`

const createSubscriptionsTable = `
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
`

const createSuperAdminsTable = `
CREATE TABLE IF NOT EXISTS super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_level INTEGER NOT NULL DEFAULT 1,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`

const createAuditLogsTable = `
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
`

const createSanctionListTable = `
CREATE TABLE IF NOT EXISTS sanction_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    alias TEXT[],
    country VARCHAR(100),
    list_source VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sanction_list_name ON sanction_list(name);
CREATE INDEX IF NOT EXISTS idx_sanction_list_country ON sanction_list(country);
CREATE INDEX IF NOT EXISTS idx_sanction_list_source ON sanction_list(list_source);
`

const createLoginAttemptsTable = `
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_locked ON login_attempts(locked_until);
`

const createAIUsageTable = `
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL,
    usage_count INTEGER DEFAULT 1,
    usage_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_feature_type ON ai_usage(feature_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_usage_date ON ai_usage(usage_date);

-- Profile views tracking
CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 1,
    last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_views_user_id ON profile_views(user_id);
`

const createPasswordResetTable = `
-- Add password reset columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token_expiry TIMESTAMP WITH TIME ZONE;

-- Create dedicated password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
`

const createCompanyDocumentsTable = `
CREATE TABLE IF NOT EXISTS company_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL, -- 'nib', 'tax_id', 'business_permit'
    file_name VARCHAR(255),
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'missing', -- 'verified', 'pending', 'missing'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_docs_company_id ON company_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_company_docs_type ON company_documents(doc_type);
`

const createIndexes = `
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_verified ON companies(is_verified);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_products_title ON products(title);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
`
const createSavedProductsTable = `
CREATE TABLE IF NOT EXISTS saved_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_products_user_id ON saved_products(user_id);
`

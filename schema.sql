-- Maui Activities Hub - Database Schema
-- Supabase PostgreSQL Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "http";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_status VARCHAR(50) DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'expired', 'cancelled')),
  pass_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  is_vendor BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_pass_expires_at ON users(pass_expires_at);

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'affiliate' CHECK (plan IN ('premium', 'affiliate')),
  monthly_fee DECIMAL(10, 2) DEFAULT 0,
  per_booking_fee DECIMAL(5, 2) DEFAULT 0,
  commission_rate DECIMAL(5, 2) DEFAULT 15.00,
  stripe_account_id VARCHAR(255),
  bio TEXT,
  logo_url VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  activities_count INT DEFAULT 0,
  total_clicks INT DEFAULT 0,
  total_conversions INT DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_business_name ON vendors(business_name);
CREATE INDEX idx_vendors_verified ON vendors(verified);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  duration_minutes INT,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('easy', 'moderate', 'hard', 'extreme')),
  max_participants INT,
  min_age INT,
  prices JSONB DEFAULT '{}',
  insider_discount DECIMAL(5, 2) DEFAULT 0,
  photos JSONB DEFAULT '[]',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'suspended')),
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_activities_vendor_id ON activities(vendor_id);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_location ON activities(location);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_is_featured ON activities(is_featured);
CREATE INDEX idx_activities_rating ON activities(rating);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  text TEXT,
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_reviews_activity_id ON reviews(activity_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(verified);

-- Bookings Table (for affiliate tracking)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE SET NULL,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE SET NULL,
  booking_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),
  conversion_status VARCHAR(50) DEFAULT 'click' CHECK (conversion_status IN ('click', 'conversion', 'refunded')),
  affiliate_source VARCHAR(100),
  commission_amount DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  external_booking_id VARCHAR(255),
  external_platform VARCHAR(100) CHECK (external_platform IN ('viator', 'getyourguide', 'direct', 'other')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_activity_id ON bookings(activity_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_conversion_status ON bookings(conversion_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_type VARCHAR(50) CHECK (payment_type IN ('pass_renewal', 'vendor_subscription', 'commission')),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_vendor_id ON payments(vendor_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email_type VARCHAR(100),
  recipient_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sendgrid_message_id VARCHAR(255),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  event_type VARCHAR(100),
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_activity_id ON analytics_events(activity_id);
CREATE INDEX idx_analytics_events_vendor_id ON analytics_events(vendor_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for analytics
CREATE OR REPLACE VIEW vendor_performance AS
SELECT 
  v.id,
  v.business_name,
  COUNT(DISTINCT a.id) as total_activities,
  COUNT(DISTINCT CASE WHEN b.conversion_status = 'conversion' THEN b.id END) as total_conversions,
  COUNT(DISTINCT CASE WHEN b.conversion_status = 'click' THEN b.id END) as total_clicks,
  COALESCE(SUM(CASE WHEN b.conversion_status = 'conversion' THEN b.commission_amount ELSE 0 END), 0) as total_earnings,
  ROUND(AVG(a.rating)::NUMERIC, 2) as avg_activity_rating
FROM vendors v
LEFT JOIN activities a ON v.id = a.vendor_id AND a.deleted_at IS NULL
LEFT JOIN bookings b ON a.id = b.activity_id
WHERE v.deleted_at IS NULL
GROUP BY v.id, v.business_name;

-- RLS Policies (enable Row Level Security on tables)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- User can view their own profile
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Public can view published activities
CREATE POLICY activities_select_public ON activities
  FOR SELECT USING (status = 'published');

-- Vendors can view and manage their own activities
CREATE POLICY activities_vendor_manage ON activities
  FOR ALL USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

-- Reviews are publicly readable
CREATE POLICY reviews_select_public ON reviews
  FOR SELECT USING (TRUE);

-- Users can create their own reviews
CREATE POLICY reviews_insert_own ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own bookings
CREATE POLICY bookings_select_own ON bookings
  FOR SELECT USING (user_id = auth.uid());

-- Vendors can view their own payments and bookings
CREATE POLICY bookings_vendor_view ON bookings
  FOR SELECT USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

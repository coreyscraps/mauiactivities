-- Maui Activities Hub - Directory & Aggregation Platform
-- Business Model: Users pay $10 for pass, Vendors pay $99/month to list

-- 1. CATEGORIES (Activity types)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. LOCATIONS (Maui regions)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  region VARCHAR(50),
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. USERS (Customers buying $10 pass)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  pass_status VARCHAR(50) DEFAULT 'inactive', -- inactive, active, expired
  pass_expiry_date TIMESTAMP,
  pass_purchased_at TIMESTAMP,
  pass_renewal_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- 4. VENDORS (Tour operators paying $99/month)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  website VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'inactive', -- inactive, active, paused, cancelled
  subscription_price DECIMAL(10,2) DEFAULT 99.00,
  subscription_renewal_date TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  contact_person VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- 5. ACTIVITIES (Listings with links to real vendor prices)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  location_id UUID REFERENCES locations(id),
  duration_minutes INTEGER,
  group_size_min INTEGER DEFAULT 1,
  group_size_max INTEGER DEFAULT 20,
  difficulty_level VARCHAR(50), -- easy, moderate, hard
  status VARCHAR(50) DEFAULT 'published', -- draft, published, paused, archived
  image_url VARCHAR(255),
  images JSONB, -- Array of image URLs
  -- PRICE TRACKING (Real prices from vendor websites)
  base_price DECIMAL(10,2) NOT NULL, -- Current vendor price
  currency VARCHAR(3) DEFAULT 'USD',
  price_source VARCHAR(100), -- 'vendor_website', 'viator', 'getyourguide', etc.
  original_price DECIMAL(10,2), -- Original price (for discount calculation)
  discount_percent DECIMAL(5,2) DEFAULT 0, -- Calculated discount %
  price_last_updated TIMESTAMP,
  booking_url VARCHAR(500), -- Link to vendor's booking page
  -- POPULARITY & ENGAGEMENT
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0, -- Click-throughs to vendor
  favorite_count INTEGER DEFAULT 0,
  -- RATINGS & REVIEWS
  rating DECIMAL(3,2) DEFAULT 0, -- Average rating
  review_count INTEGER DEFAULT 0,
  -- VENDOR DISCOUNT
  insider_discount DECIMAL(5,2) DEFAULT 0, -- If vendor offers discount to pass holders
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_category_id (category_id),
  INDEX idx_location_id (location_id),
  INDEX idx_base_price (base_price),
  INDEX idx_rating (rating),
  INDEX idx_view_count (view_count),
  INDEX idx_status (status)
);

-- 6. USER FAVORITES (Users saving activities they're interested in)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

-- 7. USER PASS PAYMENTS (Only charge for pass renewals)
CREATE TABLE IF NOT EXISTS pass_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) DEFAULT 10.00,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  receipt_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- 8. VENDOR SUBSCRIPTION PAYMENTS ($99/month billing)
CREATE TABLE IF NOT EXISTS vendor_subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  amount DECIMAL(10,2) DEFAULT 99.00,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_period_start TIMESTAMP,
  billing_period_end TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
  stripe_invoice_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  receipt_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_status (status)
);

-- 9. REVIEWS (User feedback on activities)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_user BOOLEAN DEFAULT FALSE, -- Has active pass
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_activity_id (activity_id),
  INDEX idx_user_id (user_id)
);

-- INSERT DEFAULT CATEGORIES
INSERT INTO categories (name, description, icon) VALUES
  ('Water Activities', 'Snorkeling, diving, surfing, whale watching, boat tours', 'water'),
  ('Land Tours', 'Hiking, volcano tours, scenic drives, national parks', 'mountain'),
  ('Adventure', 'Zip-lining, parasailing, ATV, jet ski, climbing', 'zap'),
  ('Cultural', 'Luaus, local tours, historical sites, temples', 'users'),
  ('Wellness', 'Yoga, spa, meditation, wellness retreats', 'heart'),
  ('Dining', 'Sunset dinners, cooking classes, food tours', 'utensils')
  ON CONFLICT (name) DO NOTHING;

-- INSERT DEFAULT LOCATIONS (Maui regions)
INSERT INTO locations (name, region, latitude, longitude) VALUES
  ('Wailea', 'South Maui', 20.7517, -156.4393),
  ('Kihei', 'South Maui', 20.7881, -156.4453),
  ('Lahaina', 'West Maui', 20.8783, -156.6756),
  ('Kapalua', 'West Maui', 20.9743, -156.6437),
  ('Kaanapali', 'West Maui', 20.9248, -156.7070),
  ('Wailuku', 'Central Maui', 20.8942, -156.5000),
  ('Haleakala National Park', 'Upcountry', 20.7970, -156.1551),
  ('Road to Hana', 'East Maui', 20.8000, -156.1000),
  ('Paia', 'North Shore', 20.9000, -156.3739),
  ('Honolua Bay', 'West Maui', 20.9996, -156.6457)
  ON CONFLICT (name) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "users_select" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "vendors_select" ON vendors FOR SELECT USING (approved = true OR auth.uid() = id);
CREATE POLICY "activities_select" ON activities FOR SELECT USING (status = 'published');
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);
CREATE POLICY "locations_select" ON locations FOR SELECT USING (true);
CREATE POLICY "favorites_select" ON user_favorites FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_activities_vendor ON activities(vendor_id);
CREATE INDEX idx_activities_category ON activities(category_id);
CREATE INDEX idx_activities_location ON activities(location_id);
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_reviews_activity ON reviews(activity_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vendors_email ON vendors(email);
CREATE INDEX idx_vendors_status ON vendors(subscription_status);

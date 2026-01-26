# Price Monitoring Service - Maui Activities Hub

## Overview
Automated service that continuously monitors vendor websites for:
- Price changes
- New activities/listings
- Special deals & discounts
- Availability changes
- Rating updates

## Architecture

### 1. **Cron Job Scheduler**
- Runs on a schedule (daily, 3x daily, or hourly)
- Spawns sub-agent for web scraping
- Manages rate limits to avoid blocking

### 2. **Web Scraper (Sub-Agent)**
- Visits each vendor website
- Extracts prices, deals, activity listings
- Compares with database
- Detects changes

### 3. **Price Comparison Engine**
- Current price vs last recorded price
- Calculate discount % if applicable
- Track price history
- Identify deals

### 4. **Database Update**
- Update `activities` table with new prices
- Record price history in `price_history` table
- Flag deals in `special_deals` table

### 5. **Alert System**
- Notify when prices drop >10%
- Alert on new deals
- Daily deal summary report

---

## Implementation Plan

### Phase 1: Basic Price Scraping (Week 1)
- Build scraper for top 20 vendors
- Extract activity names & prices
- Update database hourly
- Log errors & monitor performance

### Phase 2: Deal Detection (Week 2)
- Identify discount patterns ("Save 20%", "Limited Time")
- Track seasonal promotions
- Store deal metadata
- Surface deals in API

### Phase 3: Smart Monitoring (Week 3)
- Rate-limit by vendor (respect robots.txt)
- Add price history tracking
- Implement price prediction alerts
- Build dashboard to monitor scraper health

### Phase 4: Alerts & Notifications (Week 4)
- Email alerts to users on price drops
- WhatsApp notifications for best deals
- Daily digest of top deals
- Real-time alerts for flash sales

---

## Technical Stack

### Recommended
1. **Puppeteer** or **Playwright** - JavaScript-heavy sites
2. **Cheerio** - Fast HTML parsing
3. **Bull Queue** - Job scheduling
4. **Supabase** - Store price history
5. **SendGrid/Twilio** - Notifications

### Execution
- Run on Vercel Cron (free tier limited) or AWS Lambda
- Or: Run locally on your Mac with `node-cron`

---

## Database Schema for Price Monitoring

### `price_history` table
```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id),
  vendor_id UUID REFERENCES vendors(id),
  old_price DECIMAL(10,2),
  new_price DECIMAL(10,2),
  price_change DECIMAL(10,2),
  price_change_percent DECIMAL(5,2),
  discount_detected VARCHAR(100),
  scraped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `special_deals` table
```sql
CREATE TABLE special_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id),
  vendor_id UUID REFERENCES vendors(id),
  deal_title VARCHAR(255),
  deal_description TEXT,
  discount_percent DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  original_price DECIMAL(10,2),
  deal_price DECIMAL(10,2),
  deal_start_date TIMESTAMP,
  deal_end_date TIMESTAMP,
  deal_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  scraped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `scraper_logs` table
```sql
CREATE TABLE scraper_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  status VARCHAR(50), -- success, failed, timeout, blocked
  items_found INTEGER,
  prices_updated INTEGER,
  deals_found INTEGER,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Estimated Costs

| Method | Cost | Effort |
|--------|------|--------|
| **Local (Mac) + Cron** | $0 | Low |
| **Vercel Cron** | $0 (limited) | Medium |
| **AWS Lambda** | $0.20-$2/mo | Medium |
| **Dedicated Scraper Service** | $20-100/mo | High |

---

## Next Steps

1. **Decide hosting**: Local Mac vs Cloud?
2. **Choose scraper**: Puppeteer vs Cheerio?
3. **Set frequency**: Hourly? 3x daily? Daily?
4. **Pick vendors to start**: Top 20 first?

What's your preference?

# Maui Activities Hub - Deployment Guide

## 🚀 Quick Start (5 Minutes to Live)

### 1. **Deploy to Vercel**

```bash
# Link your GitHub repo to Vercel
# https://vercel.com/new

# Select your repo: coreyscraps/mauiactivities
# Select framework: Next.js
# Deploy
```

### 2. **Set Environment Variables**

In Vercel dashboard, go to **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PRICE_MONITOR_CRON_SECRET=your-super-secret-key-change-this
```

### 3. **Configure Cron Jobs**

Update `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/price-monitor?secret=your-super-secret-key-change-this",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Then redeploy to Vercel.

### 4. **Setup Database**

In Supabase dashboard:

1. Go to **SQL Editor**
2. Run `supabase-schema.sql` to create all tables
3. Run `seed-vendors.sql` to add 100 vendors

---

## 📋 What's Deployed

### **Database** ✅
- ✅ Users table (for $10 pass holders)
- ✅ Vendors table (100 seeded vendors)
- ✅ Activities table (with price tracking)
- ✅ Price history table (track all changes)
- ✅ Special deals table (flagged discounts)
- ✅ Scraper logs table (monitor health)
- ✅ Categories, Locations, Reviews

### **Backend APIs** ✅
- ✅ `/api/activities/search` - Full search with filters
- ✅ `/api/activities/deals-v2` - Real-time deals
- ✅ `/api/activities/compare` - Price comparison
- ✅ `/api/cron/price-monitor` - Automated scraper
- ✅ `/api/categories` - Activity categories
- ✅ `/api/locations` - Maui regions
- ✅ `/api/auth/*` - User authentication
- ✅ `/api/users/*` - User management

### **Frontend** ✅
- ✅ `/activities` - Main marketplace page
- ✅ Activity cards (with prices, ratings, vendors)
- ✅ Search bar + full filtering
- ✅ Sort options (cheapest, best reviews, popular)
- ✅ Hot deals showcase
- ✅ Responsive design (mobile + desktop)

### **Price Monitoring** ✅
- ✅ Automated price scraper (runs every 6 hours)
- ✅ Deal detection (>10% discount)
- ✅ Price history tracking
- ✅ Vendor-specific parsers
- ✅ Rate limiting + error handling

---

## 🌐 Site Structure

```
https://your-domain.com/
├── / (home page)
├── /activities (marketplace with search/filters)
├── /api/
│   ├── activities/search
│   ├── activities/deals-v2
│   ├── activities/compare
│   ├── cron/price-monitor
│   ├── categories
│   └── locations
├── /auth/login
├── /auth/signup
└── /dashboard (user profile, favorites)
```

---

## 💰 Business Setup

### User Pass ($10/person)
- 180-day access to all activities
- Save favorites
- View real vendor prices
- Get deal notifications

**Payment processor:** Stripe (configure in settings)

### Vendor Subscription ($99/month)
- List unlimited activities
- Real-time price updates
- Deal tracking
- Analytics dashboard
- Support

**Recurring billing:** Stripe Subscriptions

---

## 📊 Price Monitoring

### How It Works
1. **Trigger:** Every 6 hours (via Vercel Cron)
2. **Scrape:** 100 vendor websites
3. **Extract:** Prices, deals, discounts
4. **Compare:** Old price vs new price
5. **Store:** Database + price history
6. **Alert:** Flag deals >10% discount
7. **Display:** API shows real-time deals to users

### Monitoring Health

Check scraper performance:

```sql
-- View latest runs
SELECT 
  vendor_id,
  status,
  items_found,
  prices_updated,
  deals_found,
  execution_time_ms,
  created_at
FROM scraper_logs
ORDER BY created_at DESC
LIMIT 100;

-- Success rate (should be >90%)
SELECT 
  status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) as percentage
FROM scraper_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;

-- Recent deals
SELECT 
  deal_title,
  vendors.name,
  discount_percent,
  discount_amount,
  deal_price,
  deal_end_date
FROM special_deals
JOIN vendors ON special_deals.vendor_id = vendors.id
WHERE is_active = true
AND deal_end_date > NOW()
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change `PRICE_MONITOR_CRON_SECRET` to a strong random key
- [ ] Enable RLS (Row Level Security) policies in Supabase
- [ ] Set up CORS properly (allow your domain only)
- [ ] Enable authentication for protected routes
- [ ] Use HTTPS (automatic on Vercel)
- [ ] Add rate limiting to API endpoints
- [ ] Monitor for abuse/scraping
- [ ] Set up backups in Supabase

---

## 📈 Launch Checklist

### Pre-Launch (Week 1)
- [ ] Deploy to Vercel
- [ ] Configure all env variables
- [ ] Test user sign up / $10 pass purchase
- [ ] Test vendor subscription / pricing
- [ ] Verify price scraper runs correctly
- [ ] Monitor scraper logs for errors
- [ ] Test all search/filter combinations
- [ ] Mobile responsiveness test

### Launch (Week 2)
- [ ] Set up Stripe accounts (user + vendor)
- [ ] Configure email notifications
- [ ] Create vendor onboarding email
- [ ] Create user marketing email sequence
- [ ] Monitor server uptime
- [ ] Track conversion rates
- [ ] Gather user feedback

### Post-Launch (Week 3+)
- [ ] Optimize performance (Core Web Vitals)
- [ ] Improve scraper accuracy
- [ ] Add more vendor APIs
- [ ] Implement email alerts
- [ ] Build analytics dashboard
- [ ] Scale infrastructure as needed

---

## 🛠️ Troubleshooting

### Scraper Not Running
```bash
# Check Vercel logs
vercel logs

# Test manually
curl "https://your-domain.com/api/cron/price-monitor?secret=YOUR_SECRET"

# Should return:
{
  "success": true,
  "vendorsProcessed": 100,
  "runId": "run-1234567890"
}
```

### Prices Not Updating
```sql
-- Check if activities exist
SELECT COUNT(*) FROM activities;

-- Check price history
SELECT * FROM price_history ORDER BY scraped_at DESC LIMIT 10;

-- Check scraper logs for errors
SELECT * FROM scraper_logs WHERE status = 'failed' LIMIT 10;
```

### High Execution Times
```sql
-- Find slow scraper runs
SELECT 
  vendor_id,
  execution_time_ms,
  created_at
FROM scraper_logs
WHERE execution_time_ms > 30000
ORDER BY execution_time_ms DESC;

-- Increase timeout in src/lib/price-monitor.ts
```

---

## 📈 Performance Optimization

### Database Indexes
Already included in schema.sql:
- Price range queries: `idx_base_price`
- Rating filters: `idx_rating`
- Popularity sorts: `idx_view_count`
- Vendor lookups: `idx_vendor_id`

### Caching
Consider adding:
```typescript
// Cache search results for 5 minutes
const cacheKey = `search:${JSON.stringify(filters)}`;
```

### Image Optimization
For vendor logos/activity images:
```typescript
<Image
  src={image_url}
  alt={name}
  width={400}
  height={300}
  priority
/>
```

---

## 💬 Support & Updates

### Monthly Tasks
1. Review scraper accuracy
2. Update vendor parsers if sites changed
3. Monitor infrastructure costs
4. Analyze user behavior
5. Plan feature roadmap

### Common Issues
- Vendor website HTML structure changed → Update parser in `src/lib/vendor-scrapers.ts`
- Rate limiting blocked → Increase delay between vendors
- Low deal detection → Adjust discount threshold
- Slow queries → Add indexes

---

## 🚀 Next Features (Phase 2)

- [ ] **Headless browser scraping** (Puppeteer) for JS-heavy sites
- [ ] **Vendor API integration** (Viator, GetYourGuide)
- [ ] **Email alerts** on price drops >20%
- [ ] **Slack integration** for real-time deals
- [ ] **Admin dashboard** to manage vendors/activities
- [ ] **User reviews & photos**
- [ ] **Booking integration** (direct checkout on your platform)
- [ ] **Multi-language support**
- [ ] **Mobile app** (React Native)

---

## 📞 Support

- **Repo:** https://github.com/coreyscraps/mauiactivities
- **Issues:** github.com/coreyscraps/mauiactivities/issues
- **Vercel Docs:** vercel.com/docs
- **Supabase Docs:** supabase.com/docs

---

**You're live! 🎉 Monitor the scraper, gather user feedback, and iterate.**

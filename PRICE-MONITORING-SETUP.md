# Price Monitoring System - Setup & Deployment Guide

## Overview
Your platform continuously monitors 100 Maui activity vendors for price changes, special deals, and discounts. The system runs automatically via cron jobs and stores all data for real-time price comparison.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRICE MONITORING FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Cron Trigger (Every 6 hours / Daily / 3x Daily)         │
│     └─→ GET /api/cron/price-monitor?secret=XXX             │
│                                                               │
│  2. Price Monitor Service (src/lib/price-monitor.ts)         │
│     └─→ Fetch all active vendors from database              │
│     └─→ Scrape each vendor's website                        │
│     └─→ Extract prices, deals, discounts                    │
│                                                               │
│  3. Comparison Engine                                        │
│     └─→ Compare old price vs new price                      │
│     └─→ Calculate discount percentage                       │
│     └─→ Detect special deals (>10% off)                    │
│                                                               │
│  4. Database Updates                                         │
│     └─→ Update activities table (new prices)                │
│     └─→ Log price history in price_history table            │
│     └─→ Flag deals in special_deals table                   │
│     └─→ Record scraper performance in scraper_logs          │
│                                                               │
│  5. API Endpoints (Real-time access)                         │
│     └─→ GET /api/activities/deals-v2 (Shows all deals)     │
│     └─→ GET /api/activities/search (Filters by price)      │
│     └─→ GET /api/activities/compare (Price comparison)     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Database Setup

The new tables are already in `supabase-schema.sql`:
- `price_history` - Track all price changes
- `special_deals` - Store detected deals
- `scraper_logs` - Monitor scraper health

Deploy the schema:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase console:
# 1. Go to SQL Editor
# 2. Run supabase-schema.sql
```

---

## Step 2: Environment Variables

Add these to `.env.local`:

```env
# Required
PRICE_MONITOR_CRON_SECRET=your-super-secret-key-change-in-production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional - for advanced monitoring
PRICE_MONITOR_EMAIL_ALERTS=your-email@example.com
PRICE_MONITOR_SLACK_WEBHOOK=https://hooks.slack.com/...
PRICE_MONITOR_LOG_LEVEL=debug
```

---

## Step 3: Deploy to Production

### Option A: Vercel Cron (Easiest)

Vercel automatically runs cron jobs. Just add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/price-monitor",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Then add query parameter to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/price-monitor?secret=YOUR_CRON_SECRET",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Schedule Patterns:**
- Every 6 hours: `0 */6 * * *`
- Every 3 hours: `0 */3 * * *`
- Every hour: `0 * * * *`
- Daily at 2 AM: `0 2 * * *`
- Daily at 9 AM & 3 PM: `0 9,15 * * *`

### Option B: External Cron Service (Free)

Use [EasyCron.com](https://www.easycron.com/) or [cron-job.org](https://cron-job.org/):

1. Create free account
2. Add new cron job:
   ```
   URL: https://your-domain.com/api/cron/price-monitor?secret=YOUR_CRON_SECRET
   Schedule: 0 */6 * * * (every 6 hours)
   ```

### Option C: Your Mac (Development)

For testing locally:

```bash
# Install node-cron
npm install node-cron

# Create src/jobs/price-monitor.ts
# Run: node -e "require('./dist/jobs/price-monitor.js')"
```

---

## Step 4: Monitor Scraper Health

### View Scraper Logs

```sql
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
LIMIT 50;
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `timeout` | Vendor website slow | Increase timeout in vendor-scrapers.ts |
| `blocked` | Website blocking scraper | Use proxy service or rotate User-Agent |
| `failed` | HTML structure changed | Update vendor-specific parser |
| `rate_limited` | Making too many requests | Increase delay between vendors |

---

## Step 5: Frontend Integration

### Display Deals

```typescript
// In your React component
const [deals, setDeals] = useState([]);

useEffect(() => {
  fetch('/api/activities/deals-v2?limit=20&sort=discount_percent')
    .then(res => res.json())
    .then(data => setDeals(data.deals));
}, []);

return (
  <div>
    {deals.map(deal => (
      <div key={deal.id}>
        <h3>{deal.deal_title}</h3>
        <p>Save {deal.discount_percent}% - ${deal.discount_amount}</p>
        <p>Was ${deal.original_price} → Now ${deal.deal_price}</p>
        <a href={deal.deal_url}>Book Now</a>
      </div>
    ))}
  </div>
);
```

### Sort Options for Users

```
- Biggest Discount %
- Newest Deals
- Ending Soon
- Category Filter
- Price Range Filter
```

---

## Step 6: Alerts & Notifications (Optional)

### Email Alerts on Big Price Drops

```typescript
// In price-monitor.ts, add:
if (priceChangePercent < -20) {
  await sendEmailAlert({
    to: PRICE_MONITOR_EMAIL_ALERTS,
    subject: `Major price drop: ${activity.name}`,
    body: `${vendor.name} dropped prices by ${Math.abs(priceChangePercent)}%!`
  });
}
```

### Slack Integration

```typescript
// Add Slack webhook alerts
if (dealsFound > 5) {
  await fetch(PRICE_MONITOR_SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({
      text: `🎉 ${vendor.name}: Found ${dealsFound} new deals!`
    })
  });
}
```

---

## Step 7: Improving Scraper Accuracy

### Current Limitations
- Basic regex-based price extraction
- Generic parsers for unknown vendors

### Upgrade Path (Phase 2)

1. **Headless Browser Scraping** (Puppeteer/Playwright)
   - Handle JavaScript-heavy sites
   - Wait for dynamic content
   - Better HTML parsing

2. **Vendor API Integration**
   - Direct integration with booking platforms (Viator, GetYourGuide)
   - Real-time price feeds from major vendors
   - Webhook notifications for price changes

3. **Machine Learning**
   - Learn vendor page structures automatically
   - Detect price patterns
   - Predict seasonal price changes

---

## Step 8: Monitor & Maintain

### Daily Checklist

```
☐ Check scraper logs for failures
☐ Verify price updates are running
☐ Monitor for new vendor additions
☐ Review deal detection quality
☐ Check for blocked/rate-limited vendors
```

### Weekly Tasks

```
☐ Review price trends
☐ Check for new vendor websites
☐ Update scrapers if sites changed
☐ Monitor scraper execution times
☐ Check Supabase usage limits
```

### Monthly Tasks

```
☐ Analyze price volatility patterns
☐ Optimize scraper performance
☐ Update vendor categories if needed
☐ Review most popular activities
☐ Check for vendor site blocking us
```

---

## API Endpoints Summary

### Price Monitoring APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cron/price-monitor?secret=X` | GET | Trigger price monitoring run |
| `/api/activities/deals-v2` | GET | Get all current deals |
| `/api/activities/search` | GET | Search with price/rating filters |
| `/api/activities/compare` | GET | Compare prices across vendors |

### Query Parameters

```bash
# Get deals sorted by discount
GET /api/activities/deals-v2?limit=50&sort=discount_percent

# Get deals ending soon
GET /api/activities/deals-v2?sort=ending_soon

# Search with filters
GET /api/activities/search?q=snorkeling&sortBy=price_asc&priceMax=200

# Compare vendors for category
GET /api/activities/compare?categoryId=123&locationId=456
```

---

## Testing

### Test the cron endpoint locally

```bash
# Start your dev server
npm run dev

# In another terminal, test the endpoint
curl "http://localhost:3000/api/cron/price-monitor?secret=dev-secret-change-in-production"

# Should return:
{
  "success": true,
  "vendorsProcessed": 100,
  "runId": "run-1234567890",
  "timestamp": "2024-01-26T12:00:00Z"
}
```

---

## Production Checklist

Before going live:

- [ ] Set strong `PRICE_MONITOR_CRON_SECRET` in production
- [ ] Deploy database schema to production Supabase
- [ ] Test price monitoring with 5-10 vendors
- [ ] Monitor for 48 hours for errors
- [ ] Enable Slack/email alerts
- [ ] Document vendor-specific scrapers
- [ ] Set up monitoring dashboard
- [ ] Brief team on troubleshooting
- [ ] Create runbook for common issues

---

## Cost Estimation

| Component | Cost | Notes |
|-----------|------|-------|
| Scraper runs (6x/day) | Free | Vercel cron |
| Supabase storage | <$1/mo | ~1000 price history records/day |
| Bandwidth | Free | Supabase included |
| External cron service | Free | EasyCron free tier |
| **Total** | **$0-5/mo** | Highly scalable |

---

## Next Steps

1. ✅ Deploy database schema
2. ✅ Set up environment variables
3. ✅ Deploy to Vercel with cron jobs
4. ✅ Test with 10 vendors
5. ✅ Monitor scraper logs daily
6. ⏭️ **Expand to vendor APIs** (Phase 2)
7. ⏭️ **Add email alerts** (Phase 2)
8. ⏭️ **Build admin dashboard** (Phase 3)

---

## Need Help?

See:
- `src/lib/price-monitor.ts` - Main monitoring service
- `src/lib/vendor-scrapers.ts` - Vendor-specific parsers
- `src/pages/api/cron/price-monitor.ts` - Cron endpoint

For each vendor that needs special handling, add a new parser function in `vendor-scrapers.ts`.

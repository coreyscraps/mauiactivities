# Maui Activities Hub - Deployment Instructions

## ✅ Completed Steps

### 1. Environment Configuration
- ✅ `.env.local` created with all required credentials
- Supabase URL: https://gpnaidjjekmdkeysdxhm.supabase.co
- JWT Secret: maui-activities-jwt-secret-min-32-chars-long-key-2024
- All placeholders set for Stripe and SendGrid

### 2. Dependencies Installed
- ✅ `npm install` completed
- All packages ready: Next.js, Supabase, Stripe, SendGrid, etc.

## 🔧 MANUAL SETUP REQUIRED - Database Schema

**IMPORTANT:** The database schema and vendors must be created manually in the Supabase dashboard.

### Step 1: Create Database Schema
1. Go to: **https://app.supabase.com/project/gpnaidjjekmdkeysdxhm/sql/new**
2. Copy the entire content from: `./supabase-schema.sql`
3. Paste into the SQL editor
4. Click **RUN** button
5. Wait for completion (creates ~10 tables with indexes)

### Step 2: Seed 100 Vendors
After schema is created, seed the vendors:

**Option A: Manual SQL (Recommended)**
1. Go to: **https://app.supabase.com/project/gpnaidjjekmdkeysdxhm/sql/new**
2. Copy the entire content from: `./seed-vendors.sql`
3. Paste into the SQL editor
4. Click **RUN** button

**Option B: Automatic (via Node script)**
After schema is created, run:
```bash
node deploy.js
```

### Verification
Check the database was seeded:
1. Go to Supabase Dashboard → Tables
2. Should see tables: `vendors`, `categories`, `locations`, `users`, `activities`, `reviews`, etc.
3. `vendors` table should have ~100 rows
4. `categories` table should have 6 rows

## 🚀 Vercel Deployment

### Pre-deployment Checklist
- [x] .env.local configured
- [x] npm dependencies installed
- [ ] Database schema created in Supabase
- [ ] 100 vendors seeded in Supabase

### Deploy Steps

1. **Authenticate with Vercel**
   ```bash
   npx vercel login
   ```
   Token: `UsxZ8kHRCekxOWqvebQrjBeB`

2. **Build and Deploy**
   ```bash
   npm run build
   npx vercel --prod
   ```

3. **Or Direct Deployment**
   ```bash
   npx vercel deploy --prod --token UsxZ8kHRCekxOWqvebQrjBeB
   ```

### Environment Variables in Vercel
Make sure to set these in Vercel project settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `SENDGRID_API_KEY`
- Other variables from `.env.local`

## 📝 Project Structure

```
maui-backend-repo/
├── .env.local              # ✅ Environment variables (created)
├── package.json            # ✅ Dependencies
├── node_modules/           # ✅ Installed
├── src/
│   ├── pages/
│   │   ├── api/           # API routes
│   │   └── ...
│   └── lib/               # Utility functions
├── supabase-schema.sql    # Database schema (need to run)
├── seed-vendors.sql       # 100 vendors data (need to run)
├── deploy.js              # Node script for vendor seeding
└── DEPLOY-INSTRUCTIONS.md # This file
```

## 🆘 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check that Supabase project is active and not paused

### Vendor Seeding Errors
- Ensure all schema tables exist first
- Check for duplicate emails (vendors have unique email constraint)

### Deployment Errors
- Verify all .env variables are set in Vercel
- Check build output: `npm run build`

## 📞 Next Steps

1. **Create schema** in Supabase SQL editor ← YOU ARE HERE
2. **Seed vendors** using seed-vendors.sql or deploy.js
3. **Deploy to Vercel** using the token provided
4. **Test API endpoints** in deployed app
5. **Configure webhooks** for Stripe and SendGrid

## 🔗 Useful Links

- **Supabase Dashboard:** https://app.supabase.com/project/gpnaidjjekmdkeysdxhm
- **Supabase SQL Editor:** https://app.supabase.com/project/gpnaidjjekmdkeysdxhm/sql/new
- **Vercel Deployment:** Will be available after deploy
- **API Documentation:** See `./API_DOCS.md`

---

**Status:** Ready for manual database setup and deployment
**Created:** 2024
**Project:** Maui Activities Hub

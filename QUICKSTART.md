# Quick Start Guide

Get the Maui Activities Hub backend running in 5 minutes.

## ⚡ TL;DR

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with Supabase keys
# (See .env.example for template)
cp .env.example .env.local
# Edit with your actual keys

# 3. Push database schema
npx supabase db push

# 4. Start dev server
npm run dev

# 5. Test API
curl http://localhost:3000/api/health
```

## 🔑 Getting Your Keys

### 1. Supabase Setup (2 minutes)

```
1. Go to https://supabase.com
2. Create new project
3. Confirm email & setup
4. Project → Settings → API
5. Copy: NEXT_PUBLIC_SUPABASE_URL
6. Copy: NEXT_PUBLIC_SUPABASE_ANON_KEY
7. Copy: SUPABASE_SERVICE_ROLE_KEY
```

### 2. Stripe Setup (1 minute)

```
1. Go to https://stripe.com/test/login
2. Dashboard → API Keys
3. Copy: Publishable Key (pk_test_...)
4. Copy: Secret Key (sk_test_...)
5. Webhook → Add endpoint
   URL: https://yourdomain.com/api/webhooks/stripe
   Events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
6. Copy: Signing Secret (whsec_...)
```

### 3. SendGrid Setup (1 minute)

```
1. Go to https://sendgrid.com
2. Settings → API Keys → Create Key
3. Copy: API Key
4. Verify Sender (single sender)
5. Use that email as SENDGRID_FROM_EMAIL
```

### 4. Generate JWT Secret

```bash
openssl rand -base64 32
# Paste into .env.local as JWT_SECRET
```

## 📝 Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-32-char-random-string
JWT_EXPIRY=7d

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# SendGrid
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=noreply@mauiactivitieshu.com

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
PASS_VALIDITY_DAYS=180
PASS_RENEWAL_COST=10
```

## 🚀 Run Server

```bash
npm run dev
```

Open: http://localhost:3000/api/health

## 🧪 Test Endpoints

### 1. Sign Up User

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123",
    "isVendor": false
  }'
```

Save the `token` from response.

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123"
  }'
```

### 3. Verify Token

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with token from signup/login.

### 4. Register as Vendor

```bash
curl -X POST http://localhost:3000/api/vendors/register \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "My Adventures Hawaii",
    "contactPerson": "John Doe",
    "phone": "+1-808-555-1234",
    "website": "https://example.com",
    "plan": "professional"
  }'
```

### 5. Get Activities

```bash
curl "http://localhost:3000/api/activities?page=1&limit=5"
```

### 6. Create Activity (as Vendor)

```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Haleakalā Sunrise Hike",
    "type": "hiking",
    "location": "Maui",
    "description": "Watch the sunrise from Haleakalā summit",
    "durationMinutes": 480,
    "prices": {
      "direct": 99.99,
      "viator": 119.99
    },
    "insiderDiscount": 15,
    "photos": ["https://example.com/photo.jpg"]
  }'
```

### 7. Get Reviews

```bash
curl "http://localhost:3000/api/reviews?activityId=ACTIVITY_ID&page=1"
```

Replace `ACTIVITY_ID` with actual activity ID from previous request.

### 8. Post Review

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "activityId": "ACTIVITY_ID",
    "rating": 5,
    "title": "Amazing!",
    "text": "Best hike ever!"
  }'
```

### 9. Renew Pass (Create Payment)

```bash
curl -X POST http://localhost:3000/api/users/renew-pass \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

Returns `paymentIntent.clientSecret` - use in Stripe payment form.

## 📚 Full Documentation

- **README.md** - Complete feature overview
- **API_DOCS.md** - All endpoints with examples
- **DEPLOYMENT.md** - Deploy to Vercel/Docker/AWS
- **schema.sql** - Database structure

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
npm install
# Ensure all dependencies installed
```

### Database connection error
```bash
# Check .env.local variables
# Verify Supabase project is active
# Check network access
```

### JWT decode error
```bash
# Ensure JWT_SECRET in .env.local matches
# Check Authorization header format: "Bearer TOKEN"
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
# Run on port 3001 instead
```

## ✅ Checklist

- [x] Node.js 18+ installed
- [x] Dependencies installed (`npm install`)
- [x] `.env.local` created with all keys
- [x] Database schema pushed (`npx supabase db push`)
- [x] Server running (`npm run dev`)
- [x] Health check passes (`curl /api/health`)
- [x] Can sign up users
- [x] Can log in
- [x] Can create activities (as vendor)
- [x] Can post reviews

## 🎯 Next Steps

1. **Deploy to Vercel** (see DEPLOYMENT.md)
2. **Set up SendGrid email templates**
3. **Configure Stripe webhooks**
4. **Create admin panel**
5. **Add rate limiting**
6. **Set up monitoring**

## 📞 Need Help?

- **API Issues**: Check API_DOCS.md
- **Database Issues**: See schema.sql comments
- **Deployment Issues**: Read DEPLOYMENT.md
- **Stripe Issues**: https://stripe.com/docs
- **Supabase Issues**: https://supabase.com/docs

---

**Ready to build?** Start with `npm run dev` 🚀

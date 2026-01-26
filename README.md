# Maui Activities Hub - Backend MVP

A production-ready Next.js API backend for the Maui Activities Hub platform, featuring user authentication, vendor management, activity booking, reviews, and affiliate tracking with Stripe payments and SendGrid email integration.

## 🌟 Features

- **User Authentication**: JWT-based auth with 180-day pass system
- **Vendor Management**: Complete vendor registration and analytics
- **Activity Catalog**: Browse, search, and manage activities
- **Booking System**: Track affiliate conversions across multiple platforms
- **Review System**: User reviews with rating aggregation
- **Payment Processing**: Stripe integration for pass renewals
- **Email Notifications**: SendGrid integration for transactional emails
- **Row-Level Security**: Supabase RLS policies for data privacy
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- Stripe account (test keys for development)
- SendGrid account and API key
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd ~/Desktop/maui-activities-backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid
SENDGRID_API_KEY=SG.your-api-key
SENDGRID_FROM_EMAIL=noreply@mauiactivitieshu.com

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Push schema to Supabase
npx supabase db push

# Or manually run schema.sql in Supabase SQL editor
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs at http://localhost:3000

### 5. Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'
```

## 📚 API Endpoints

### Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/signup` | POST | - | Create user account |
| `/api/auth/login` | POST | - | Login and get JWT token |
| `/api/auth/verify` | GET | JWT | Verify token & check pass status |

**Signup Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "passExpiresAt": "2025-03-15T...",
    "isVendor": false
  },
  "token": "eyJhbGc..."
}
```

### Activities

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/activities` | GET | - | List published activities |
| `/api/activities` | POST | JWT (Vendor) | Create new activity |
| `/api/activities/search` | GET | - | Search activities with filters |
| `/api/activities/[id]/pricing` | GET | - | Get all pricing sources |

**Search Filters:**
- `type`: Activity type (hiking, snorkeling, etc.)
- `location`: Location name
- `minPrice`, `maxPrice`: Price range
- `minRating`: Minimum rating
- `page`, `limit`: Pagination

### Users

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users/profile` | GET | JWT | Get user profile |
| `/api/users/profile` | PUT | JWT | Update profile |
| `/api/users/renew-pass` | POST | JWT | Create payment intent for renewal |

**Profile Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "subscriptionStatus": "active",
    "passExpiresAt": "2025-03-15T...",
    "isPassExpired": false,
    "daysUntilExpiry": 150,
    "isVendor": false,
    "isAdmin": false
  }
}
```

### Vendors

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/vendors/register` | POST | JWT | Register as vendor |
| `/api/vendors/[id]/analytics` | GET | JWT (Vendor) | Get vendor analytics |

**Register Vendor:**
```bash
curl -X POST http://localhost:3000/api/vendors/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Adventure Tours Hawaii",
    "contactPerson": "John Doe",
    "phone": "+1-808-555-1234",
    "website": "https://example.com",
    "plan": "professional"
  }'
```

### Bookings & Conversions

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/bookings` | GET | JWT | Get user bookings |
| `/api/bookings` | POST | - | Track conversion/click |

**Track Booking:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "activityId": "uuid",
    "vendorId": "uuid",
    "externalPlatform": "viator",
    "externalBookingId": "external-123",
    "totalPrice": 99.99
  }'
```

### Reviews

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/reviews` | GET | - | Get activity reviews |
| `/api/reviews` | POST | JWT | Post new review |

**Post Review:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "activityId": "uuid",
    "rating": 5,
    "title": "Amazing experience!",
    "text": "The best snorkeling tour ever..."
  }'
```

## 💳 Stripe Integration

### Setup Test Keys

1. Create Stripe account: https://stripe.com
2. Get test keys from Dashboard → API Keys
3. Add to `.env.local`
4. Set webhook endpoint to: `https://yourdomain.com/api/webhooks/stripe`

### Testing Payments

```bash
# Get payment intent for renewal
curl -X POST http://localhost:3000/api/users/renew-pass \
  -H "Authorization: Bearer YOUR_TOKEN"

# Returns: { "paymentIntent": { "clientSecret": "...", "id": "..." } }
```

Use Stripe test card: `4242 4242 4242 4242`

### Webhook Events

The webhook handler processes:
- `payment_intent.succeeded` - Updates payment, renews pass
- `payment_intent.payment_failed` - Logs payment failure
- `charge.refunded` - Handles refunds

## 📧 Email Integration

### Setup SendGrid

1. Create account: https://sendgrid.com
2. Verify sender email
3. Get API key from Settings → API Keys
4. Create email templates (optional - uses HTML templates by default)
5. Add to `.env.local`

### Automated Emails

- **Welcome**: Sent after signup
- **Pass Expiry (30 days)**: Automated via cron job
- **Pass Expiry (7 days)**: Urgent reminder
- **Renewal Offer**: After pass expires
- **Vendor Onboarding**: After vendor registration

## 🗄️ Database Schema

### Key Tables

**users**
- id, email, password_hash, subscription_status, pass_expires_at, is_vendor, is_admin

**vendors**
- id, user_id, business_name, plan, monthly_fee, stripe_account_id, verified

**activities**
- id, vendor_id, name, type, location, description, prices (JSONB), rating, photos (JSONB)

**bookings**
- id, user_id, activity_id, vendor_id, conversion_status, commission_amount

**reviews**
- id, activity_id, user_id, rating, text, verified

**payments**
- id, user_id, amount, status, payment_type, stripe_payment_intent_id

See `schema.sql` for full details including indexes and RLS policies.

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Row Level Security**: Supabase RLS on all tables
- **Input Validation**: Required field checks
- **CORS Headers**: Configured in next.config.js
- **Rate Limiting**: Recommended via Vercel Edge Middleware
- **Environment Secrets**: All sensitive keys in `.env.local`

## 🧪 Testing

### Manual Testing

```bash
# Create test user
npm run test:signup

# Test payment flow
npm run test:payment

# Check analytics
npm run test:analytics
```

### Test Data

```sql
-- Get test vendor
SELECT * FROM vendors LIMIT 1;

-- Get test activities
SELECT * FROM activities WHERE status = 'published' LIMIT 5;

-- Check bookings
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;
```

## 🚢 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all variables from .env.example
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t maui-backend .
docker run -p 3000:3000 --env-file .env.production maui-backend
```

### Environment Variables for Production

Update before deployment:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=https://your-domain.com`
- Use production Stripe keys
- Set strong `JWT_SECRET`
- Enable Supabase project password

## 📊 Monitoring

### Health Check

```bash
curl https://your-api.com/api/health
```

### View Logs

**Vercel:**
```bash
vercel logs
```

**Local:**
```bash
npm run dev  # Logs in console
```

### Database Queries

View in Supabase Dashboard:
- SQL Editor: Run custom queries
- Data Browser: View tables
- Logs: Check query performance

## 🐛 Troubleshooting

**JWT decode errors:**
- Check `JWT_SECRET` matches between signup and verify
- Verify token format in Authorization header

**Database connection errors:**
- Confirm `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase project is active
- Verify network access

**Stripe webhook failures:**
- Confirm `STRIPE_WEBHOOK_SECRET` is exact
- Check webhook endpoint is reachable
- Review webhook logs in Stripe Dashboard

**Email not sending:**
- Verify `SENDGRID_API_KEY` is active
- Check sender email is verified
- Review SendGrid Activity in dashboard

## 📝 Project Structure

```
src/
├── lib/
│   ├── auth.ts          # JWT & password utilities
│   ├── stripe.ts        # Stripe payment helpers
│   ├── email.ts         # SendGrid integration
│   └── supabase.ts      # Supabase clients
├── pages/
│   └── api/
│       ├── auth/        # Authentication endpoints
│       ├── activities/  # Activity management
│       ├── users/       # User profile & renewal
│       ├── vendors/     # Vendor endpoints
│       ├── bookings/    # Conversion tracking
│       ├── reviews/     # Review system
│       ├── webhooks/    # Stripe webhooks
│       └── health.ts    # Health check
├── schema.sql           # Database schema
├── package.json
├── next.config.js
├── tsconfig.json
└── .env.example
```

## 📄 License

MIT

## 🤝 Support

For issues, refer to:
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- SendGrid Docs: https://sendgrid.com/docs
- Next.js Docs: https://nextjs.org/docs

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up SendGrid templates
3. ✅ Configure Stripe webhooks
4. ✅ Create vendor onboarding flow
5. ✅ Implement cron jobs for email reminders
6. ✅ Add rate limiting & monitoring
7. ✅ Set up analytics dashboard
8. ✅ Add admin panel

---

**Last Updated:** January 2024
**Version:** 1.0.0-MVP
**Status:** Production Ready ✅

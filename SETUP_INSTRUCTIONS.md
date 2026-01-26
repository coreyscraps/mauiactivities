# Complete Setup Instructions

Step-by-step guide to get the entire system running from scratch.

## Phase 1: Prerequisites (5 minutes)

### Install Required Software

```bash
# Check Node.js version (need 18+)
node --version
npm --version

# If not installed:
# macOS:
brew install node

# Windows:
# Download from https://nodejs.org/

# Linux:
sudo apt-get install nodejs npm
```

### Create Accounts

1. **Supabase**: https://supabase.com (free tier available)
2. **Stripe**: https://stripe.com (free testing)
3. **SendGrid**: https://sendgrid.com (free tier available)
4. **GitHub** (optional): For deployment

---

## Phase 2: Project Setup (5 minutes)

### Clone/Navigate to Project

```bash
cd ~/Desktop/maui-activities-backend
# Or: git clone your-repo
```

### Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14
- TypeScript
- Supabase client
- Stripe SDK
- SendGrid SDK
- bcryptjs for password hashing
- jsonwebtoken for JWT
- And more...

---

## Phase 3: Supabase Setup (10 minutes)

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Project name: `maui-activities-hub`
   - Database password: (save this!)
   - Region: Choose closest to Maui (US West Oregon or US East Virginia)
4. Wait for project to initialize (2-3 minutes)

### Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

3. Go to **Settings** → **Database**
4. Copy the connection string for later

### Push Database Schema

```bash
# Option 1: Using Supabase CLI (easiest)
npx supabase link --project-ref your-project-id
npx supabase db push

# Option 2: Manual (copy-paste)
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Click "New Query"
# 3. Copy entire contents of schema.sql
# 4. Paste into query editor
# 5. Click "Run"
```

✅ Supabase setup complete!

---

## Phase 4: Stripe Setup (5 minutes)

### Create Stripe Account

1. Go to https://stripe.com/test/login
2. Sign up or log in
3. Confirm email

### Get Test Keys

1. Go to **Developers** → **API Keys**
2. You'll see two sets:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)
3. Copy both

### Create Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Enter URL: `http://localhost:3000/api/webhooks/stripe` (for testing)
   - Later: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click "Add endpoint"
6. You'll see the **Signing Secret** (starts with `whsec_`)
7. Copy it

### Test Card Numbers

Use these for testing (will succeed):
- `4242 4242 4242 4242` - Success
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - CVC check fails

✅ Stripe setup complete!

---

## Phase 5: SendGrid Setup (5 minutes)

### Create SendGrid Account

1. Go to https://sendgrid.com
2. Sign up
3. Confirm email

### Create API Key

1. Go to **Settings** → **API Keys**
2. Click "Create API Key"
3. Give it a name: `maui-activities-hub`
4. Copy the key (starts with `SG.`)

### Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click "Verify a Single Sender"
3. Fill in your email
4. Click verification link in email
5. Use this email as `SENDGRID_FROM_EMAIL`

### (Optional) Create Email Templates

Templates can be created later, but for testing the system uses inline HTML.

✅ SendGrid setup complete!

---

## Phase 6: Environment Variables (5 minutes)

### Create .env.local

```bash
cp .env.example .env.local
```

### Fill in Values

Edit `.env.local` with your credentials:

```env
# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ===== JWT =====
JWT_SECRET=your-32-character-random-string
JWT_EXPIRY=7d

# ===== STRIPE =====
STRIPE_SECRET_KEY=sk_test_123456...
STRIPE_PUBLISHABLE_KEY=pk_test_123456...
STRIPE_WEBHOOK_SECRET=whsec_test_123456...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_123456...

# ===== SENDGRID =====
SENDGRID_API_KEY=SG.abc123...
SENDGRID_FROM_EMAIL=noreply@example.com

# ===== APP CONFIG =====
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Maui Activities Hub
PASS_VALIDITY_DAYS=180
PASS_RENEWAL_COST=10
```

### Generate JWT_SECRET

```bash
openssl rand -base64 32
# Copy output and paste as JWT_SECRET
```

✅ Environment setup complete!

---

## Phase 7: Start Development Server (2 minutes)

```bash
npm run dev
```

You should see:
```
> next dev
  ▲ Next.js 14.x.x
  - ready started server on 0.0.0.0:3000
  - event compiled client and server successfully
```

Open: http://localhost:3000/api/health

You should see:
```json
{
  "status": "ok",
  "database": { "connected": true },
  "features": { "stripe": true, "sendgrid": true, "supabase": true }
}
```

✅ Server is running!

---

## Phase 8: Test the System (5 minutes)

### Test 1: User Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "passExpiresAt": "2025-07-...",
    "isVendor": false
  },
  "token": "eyJhbGc..."
}
```

💾 Save the `token` value for next test.

### Test 2: Get Profile

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

Replace `PASTE_TOKEN_HERE` with token from signup.

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "testuser@example.com",
    "daysUntilExpiry": 180,
    "isPassExpired": false
  }
}
```

### Test 3: Create Vendor Account

```bash
curl -X POST http://localhost:3000/api/vendors/register \
  -H "Authorization: Bearer PASTE_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Adventure Company",
    "contactPerson": "John Smith",
    "phone": "+1-808-555-1234",
    "website": "https://example.com",
    "plan": "professional"
  }'
```

**Expected Response:**
```json
{
  "message": "Vendor account created successfully",
  "vendor": {
    "id": "...",
    "businessName": "Test Adventure Company",
    "plan": "professional"
  }
}
```

### Test 4: Create Activity (as Vendor)

Generate a **new token** for the vendor account first (login with the same email).

```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Authorization: Bearer VENDOR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Snorkeling Tour",
    "type": "snorkeling",
    "location": "Maui",
    "description": "Beautiful snorkeling at Molokini Crater",
    "durationMinutes": 240,
    "prices": {
      "direct": 89.99,
      "viator": 99.99
    },
    "insiderDiscount": 15
  }'
```

### Test 5: List Activities

```bash
curl http://localhost:3000/api/activities
```

You should see the activity you created (after status is changed to "published").

✅ Basic system working!

---

## Phase 9: Testing Payment Flow (Optional)

This requires Stripe test card and payment form integration, which is typically in the frontend app.

For backend testing only:

```bash
curl -X POST http://localhost:3000/api/users/renew-pass \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "message": "Payment intent created",
  "paymentIntent": {
    "id": "pi_1234567890",
    "clientSecret": "pi_..._secret_...",
    "amount": 1000,
    "currency": "usd"
  }
}
```

This payment intent is ready for Stripe.js integration on frontend.

---

## Phase 10: Troubleshooting

### Database Connection Error

```
Error: Cannot find module 'supabase'
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Run on different port
npm run dev -- -p 3001

# Or kill process on 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Environment Variables Not Loading

**Solution:**
1. Check `.env.local` exists in project root
2. Restart dev server: `npm run dev`
3. Verify all values are set correctly
4. No quotes needed around values

### Stripe Webhook Not Working

```
Error: Invalid signature
```

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` is exact (copy-paste from Stripe)
2. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   stripe trigger payment_intent.succeeded
   ```

### Email Not Sending

**Solution:**
1. Check `SENDGRID_API_KEY` is valid
2. Check `SENDGRID_FROM_EMAIL` is verified in SendGrid
3. Review SendGrid Activity logs for delivery status

---

## Verification Checklist

- [ ] Node.js 18+ installed
- [ ] npm install completed
- [ ] Supabase account created & project setup
- [ ] Supabase credentials in `.env.local`
- [ ] Schema pushed to Supabase
- [ ] Stripe account created & keys added
- [ ] Stripe webhook configured
- [ ] SendGrid account & API key added
- [ ] SendGrid sender email verified
- [ ] `.env.local` fully filled out
- [ ] `npm run dev` starts without errors
- [ ] `/api/health` returns 200 OK
- [ ] User signup works
- [ ] User login works
- [ ] Vendor registration works
- [ ] Activity creation works
- [ ] Activity list works

---

## Next: Deployment

Once testing is complete and you're confident everything works:

1. Read **DEPLOYMENT.md**
2. Choose your hosting (Vercel recommended)
3. Deploy with environment variables
4. Test all endpoints on production
5. Monitor logs for errors

---

## Documentation Map

- **QUICKSTART.md** - 5 minute quick start
- **README.md** - Full feature overview
- **API_DOCS.md** - All endpoints with examples
- **DEPLOYMENT.md** - Deploy to production
- **PROJECT_SUMMARY.md** - What's included
- **SETUP_INSTRUCTIONS.md** - This file

---

## Support

**Having issues?**

1. Check the relevant documentation file above
2. Review error messages carefully
3. Check environment variables are correct
4. Try clearing node_modules and reinstalling
5. Check vendor documentation:
   - Supabase: https://supabase.com/docs
   - Stripe: https://stripe.com/docs
   - SendGrid: https://sendgrid.com/docs

---

## Success!

If you've completed all phases:

✅ Backend API is running locally
✅ Database is connected
✅ Payments are configured
✅ Emails are ready
✅ Ready for production deployment

**Congratulations!** 🎉

Next step: Read **DEPLOYMENT.md** to take your app live.

---

**Time to complete**: ~30-45 minutes
**Difficulty**: Beginner to Intermediate
**Support**: See documentation files

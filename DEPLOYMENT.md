# Deployment Guide - Maui Activities Hub Backend

Complete guide to deploy the Maui Activities Hub backend to production.

## 🚀 Vercel Deployment (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js.

### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
cd ~/Desktop/maui-activities-backend
git init
git add .
git commit -m "Initial commit: Maui Activities Hub MVP"

# Add remote
git remote add origin https://github.com/your-username/maui-activities-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow the prompts:
- Link to GitHub repo (optional but recommended)
- Set project name: `maui-activities-hub-backend`
- Framework: Next.js

### Step 3: Set Environment Variables

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter your Supabase URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter your anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter your service role key

vercel env add JWT_SECRET
# Generate: openssl rand -base64 32

vercel env add JWT_EXPIRY
# Enter: 7d

vercel env add STRIPE_SECRET_KEY
# Enter your Stripe secret key

vercel env add STRIPE_PUBLISHABLE_KEY
# Enter your Stripe publishable key

vercel env add STRIPE_WEBHOOK_SECRET
# Enter your webhook secret

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Enter your Stripe publishable key

vercel env add SENDGRID_API_KEY
# Enter your SendGrid API key

vercel env add SENDGRID_FROM_EMAIL
# Enter: noreply@mauiactivitieshu.com

vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-project.vercel.app

vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Maui Activities Hub

vercel env add PASS_VALIDITY_DAYS
# Enter: 180

vercel env add PASS_RENEWAL_COST
# Enter: 10

vercel env add DEFAULT_AFFILIATE_COMMISSION_RATE
# Enter: 15
```

### Step 4: Deploy

```bash
# Redeploy with new environment variables
vercel --prod
```

Your API is now live at: `https://your-project.vercel.app`

## 🔐 Security Checklist

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook secret configured
- [ ] Supabase RLS policies enabled
- [ ] JWT_SECRET is unique and strong (min 32 chars)
- [ ] SendGrid verified sender email
- [ ] CORS headers configured
- [ ] Database backups enabled in Supabase
- [ ] Monitoring/logging configured

## 🏗️ Docker Deployment

For deployment to cloud services (AWS, GCP, DigitalOcean, etc.)

### Build Docker Image

```bash
# Create Dockerfile (already provided)
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
EOF

# Build image
docker build -t maui-activities-backend:1.0.0 .

# Tag for registry
docker tag maui-activities-backend:1.0.0 your-registry/maui-activities-backend:1.0.0
```

### Deploy to AWS ECS

```bash
# Create ECR repository
aws ecr create-repository --repository-name maui-activities-backend

# Push image
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/maui-activities-backend:1.0.0

# Create ECS task definition (template provided in docker/ecs-task-def.json)
# Deploy using AWS Console or CLI
```

### Deploy to DigitalOcean App Platform

1. Connect GitHub repository
2. Specify Dockerfile
3. Set environment variables
4. Deploy

### Deploy to Heroku

```bash
# Login
heroku login

# Create app
heroku create maui-activities-hub-backend

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
# ... add all other variables

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

## 🌍 Database Migrations

### Initial Setup

```bash
# Push schema to production Supabase project
supabase db push --db-url postgresql://user:pass@db.supabase.co:5432/postgres

# Or use SQL editor
# Copy contents of schema.sql into Supabase SQL editor and execute
```

### Ongoing Migrations

```bash
# Make changes locally
# Edit migrations in supabase/migrations/

# Push to production
supabase db push

# Or for manual control:
supabase db push --dry-run  # Review changes
supabase db push            # Apply changes
```

## 📧 Configure Webhooks

### Stripe Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Create new endpoint:
   - URL: `https://your-api.com/api/webhooks/stripe`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
3. Copy Signing Secret
4. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=...`

### Test Webhook (Local Development)

```bash
# Install stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# or see: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger test event
stripe trigger payment_intent.succeeded
```

## 📊 Monitoring & Logging

### Vercel Analytics

- View in Vercel Dashboard
- Track API performance
- Monitor errors
- View logs

### Supabase Monitoring

- SQL Editor: Run queries
- Database: View activity
- Logs: Check query performance

### Stripe Monitoring

- Dashboard: View transactions
- Events: Check webhook delivery
- Logs: Review API calls

### SendGrid Monitoring

- Activity: View email delivery
- Bounce Management: Handle invalid emails
- Logs: Track email status

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm i -g vercel
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
        run: vercel --prod
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Deployed to Vercel'
            })
```

## 🚨 Rollback Plan

### If Deployment Fails

```bash
# View deployment history
vercel list

# Rollback to previous version
vercel promote <deployment-url>

# Or redeploy previous commit
git revert <commit-hash>
git push origin main
```

## ⚡ Performance Optimization

### Next.js Configuration

Already optimized in `next.config.js`:
- ✅ SWC minification
- ✅ CORS headers
- ✅ Console removal in production

### Database Optimization

- Indexes on frequently queried columns ✅
- Proper foreign key constraints ✅
- RLS policies optimized ✅

### API Rate Limiting

Add Vercel Edge Middleware (optional):

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Implement rate limiting
  const ip = request.ip || 'unknown';
  // ... rate limit logic
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## 📱 Mobile API Compatibility

Ensure headers work with mobile clients:

```bash
# Test CORS
curl -X OPTIONS https://your-api.com/api/activities \
  -H "Origin: https://your-app.com" \
  -v
```

## 🆘 Troubleshooting Deployment

**502 Bad Gateway:**
- Check function memory limits
- Review logs for errors
- Verify environment variables

**Database connection timeout:**
- Check Supabase project is active
- Verify network access rules
- Check connection string

**Webhook failures:**
- Verify endpoint URL is correct
- Check for rate limiting
- Review signing secret

**Email not sending:**
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid activity logs

## 📞 Support Resources

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/docs/support
- **Stripe Support**: https://stripe.com/support
- **SendGrid Support**: https://sendgrid.com/support

---

**Status**: Ready for Production ✅

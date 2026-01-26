# API Documentation - Maui Activities Hub

Complete reference for all API endpoints with examples.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-api.com`

## Authentication

All authenticated endpoints require an Authorization header with JWT token:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

## Response Format

All responses are JSON with consistent structure:

**Success Response (2xx):**
```json
{
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Error Response (4xx, 5xx):**
```json
{
  "error": "Error message",
  "status": 400
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "isVendor": false
  }'
```

**Parameters:**
- `email` (string, required): User email address
- `password` (string, required): Password (min 8 characters)
- `isVendor` (boolean, optional): Whether user is registering as vendor

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "passExpiresAt": "2025-03-15T10:30:00Z",
    "isVendor": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- 400: Email and password required
- 400: Password must be at least 8 characters
- 409: User already exists

---

### POST /api/auth/login

Authenticate user and get JWT token.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Parameters:**
- `email` (string, required): User email
- `password` (string, required): Password

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "subscriptionStatus": "active",
    "passExpiresAt": "2025-03-15T10:30:00Z",
    "isVendor": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- 400: Email and password required
- 401: Invalid email or password
- 401: User account has been deleted

---

### GET /api/auth/verify

Verify JWT token and check pass status.

**Request:**
```bash
curl http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "subscriptionStatus": "active",
    "passExpiresAt": "2025-03-15T10:30:00Z",
    "isVendor": false,
    "isPassExpired": false,
    "daysUntilExpiry": 150
  }
}
```

**Errors:**
- 401: Unauthorized (no/invalid token)
- 404: User not found

---

## Activity Endpoints

### GET /api/activities

List published activities with pagination.

**Request:**
```bash
curl "http://localhost:3000/api/activities?page=1&limit=20&type=hiking&location=Maui"
```

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page
- `type` (string, optional): Activity type filter
- `location` (string, optional): Location filter

**Response (200 OK):**
```json
{
  "activities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vendorId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Haleakalā Summit Hike",
      "type": "hiking",
      "location": "Maui",
      "description": "Experience sunrise at Haleakalā National Park...",
      "durationMinutes": 480,
      "difficultyLevel": "moderate",
      "maxParticipants": 12,
      "minAge": 10,
      "prices": {
        "direct": 149.99,
        "viator": 169.99,
        "getyourguide": 159.99
      },
      "insiderDiscount": 15,
      "rating": 4.8,
      "reviewCount": 42,
      "photos": [
        "https://cdn.example.com/photo1.jpg",
        "https://cdn.example.com/photo2.jpg"
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

### GET /api/activities/search

Advanced search with price and rating filters.

**Request:**
```bash
curl "http://localhost:3000/api/activities/search?type=snorkeling&location=Maui&minPrice=50&maxPrice=300&minRating=4.5&page=1"
```

**Query Parameters:**
- `type` (string, optional): Activity type
- `location` (string, optional): Location
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `minRating` (number, optional): Minimum rating (1-5)
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page

**Response:** Same as GET /api/activities

---

### POST /api/activities

Create a new activity (vendors only).

**Request:**
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Snorkeling at Molokini Crater",
    "type": "snorkeling",
    "location": "Molokini Crater, Maui",
    "description": "Explore the underwater beauty...",
    "durationMinutes": 240,
    "difficultyLevel": "easy",
    "maxParticipants": 20,
    "minAge": 5,
    "prices": {
      "direct": 89.99,
      "viator": 99.99,
      "getyourguide": 94.99
    },
    "insiderDiscount": 20,
    "photos": [
      "https://cdn.example.com/snorkel1.jpg"
    ],
    "tags": ["water", "family-friendly", "beginner"]
  }'
```

**Parameters:**
- `name` (string, required): Activity name
- `type` (string, required): Activity type
- `location` (string, required): Location
- `description` (string, optional): Full description
- `durationMinutes` (number, optional): Duration in minutes
- `difficultyLevel` (string, optional): easy|moderate|hard|extreme
- `maxParticipants` (number, optional): Maximum participants
- `minAge` (number, optional): Minimum age
- `prices` (object, optional): { direct, viator, getyourguide, other }
- `insiderDiscount` (number, optional): Discount percentage
- `photos` (array, optional): Photo URLs
- `tags` (array, optional): Activity tags

**Response (201 Created):**
```json
{
  "message": "Activity created successfully",
  "activity": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "vendorId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Snorkeling at Molokini Crater",
    "type": "snorkeling",
    "status": "draft",
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

**Errors:**
- 401: Unauthorized (not logged in)
- 403: Only vendors can create activities
- 404: Vendor profile not found

---

### GET /api/activities/[id]/pricing

Get all pricing sources for an activity.

**Request:**
```bash
curl http://localhost:3000/api/activities/550e8400-e29b-41d4-a716-446655440000/pricing
```

**Response (200 OK):**
```json
{
  "activityId": "550e8400-e29b-41d4-a716-446655440000",
  "activityName": "Haleakalā Summit Hike",
  "prices": {
    "direct": {
      "price": 149.99,
      "discount": 15,
      "finalPrice": 127.49
    },
    "viator": {
      "price": 169.99,
      "discount": 15,
      "finalPrice": 144.49
    },
    "getyourguide": {
      "price": 159.99,
      "discount": 15,
      "finalPrice": 135.99
    }
  },
  "insiderDiscount": 15
}
```

**Errors:**
- 404: Activity not found

---

## User Endpoints

### GET /api/users/profile

Get current user profile and pass status.

**Request:**
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "subscriptionStatus": "active",
    "passExpiresAt": "2025-03-15T10:30:00Z",
    "isPassExpired": false,
    "daysUntilExpiry": 150,
    "isVendor": false,
    "isAdmin": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T15:30:00Z"
  }
}
```

---

### PUT /api/users/profile

Update user profile.

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com"
  }'
```

**Parameters:**
- `email` (string, optional): New email address
- `subscriptionStatus` (string, optional): active|expired|cancelled

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newemail@example.com",
    "subscriptionStatus": "active",
    "passExpiresAt": "2025-03-15T10:30:00Z",
    "isVendor": false
  }
}
```

---

### POST /api/users/renew-pass

Create Stripe payment intent for pass renewal.

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/renew-pass \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "message": "Payment intent created",
  "paymentIntent": {
    "id": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_abcdefgh",
    "amount": 1000,
    "currency": "usd"
  }
}
```

**Frontend Integration:**
```javascript
// Use Stripe.js to confirm payment
const stripe = Stripe('pk_test_...');
const elements = stripe.elements();

// Confirm payment intent
stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: 'User Name' }
  }
}).then(result => {
  if (result.paymentIntent.status === 'succeeded') {
    // Pass renewed - user's pass_expires_at updated
    console.log('Pass renewed!');
  }
});
```

---

## Vendor Endpoints

### POST /api/vendors/register

Register as a vendor.

**Request:**
```bash
curl -X POST http://localhost:3000/api/vendors/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Adventure Tours Hawaii",
    "contactPerson": "John Doe",
    "phone": "+1-808-555-1234",
    "website": "https://adventuretourshawaii.com",
    "plan": "professional"
  }'
```

**Parameters:**
- `businessName` (string, required): Business name
- `contactPerson` (string, optional): Contact person name
- `phone` (string, optional): Business phone
- `website` (string, optional): Website URL
- `plan` (string, default: starter): starter|professional|enterprise

**Plans:**
- starter: $0/month
- professional: $50/month
- enterprise: $200/month

**Response (201 Created):**
```json
{
  "message": "Vendor account created successfully",
  "vendor": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "businessName": "Adventure Tours Hawaii",
    "email": "user@example.com",
    "plan": "professional",
    "monthlyFee": 50
  }
}
```

**Errors:**
- 400: Business name required
- 409: Already registered as vendor

---

### GET /api/vendors/[id]/analytics

Get vendor analytics and performance metrics.

**Request:**
```bash
curl "http://localhost:3000/api/vendors/550e8400-e29b-41d4-a716-446655440001/analytics" \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN"
```

**Response (200 OK):**
```json
{
  "analytics": {
    "vendorId": "550e8400-e29b-41d4-a716-446655440001",
    "businessName": "Adventure Tours Hawaii",
    "totalActivities": 8,
    "totalClicks": 450,
    "totalConversions": 45,
    "conversionRate": 10.0,
    "totalEarnings": 2250.00,
    "avgActivityRating": 4.7,
    "plan": "professional",
    "monthlyFee": 50,
    "verified": true
  }
}
```

---

## Booking Endpoints

### GET /api/bookings

Get user bookings or vendor conversion tracking.

**Request:**
```bash
curl "http://localhost:3000/api/bookings?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "bookings": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "activityId": "550e8400-e29b-41d4-a716-446655440000",
      "vendorId": "550e8400-e29b-41d4-a716-446655440001",
      "bookingDate": "2024-02-15",
      "status": "completed",
      "conversionStatus": "conversion",
      "affiliateSource": "viator",
      "commissionAmount": 50.00,
      "totalPrice": 149.99,
      "externalPlatform": "viator",
      "createdAt": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### POST /api/bookings

Track a booking/conversion from affiliate platform.

**Request:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "activityId": "550e8400-e29b-41d4-a716-446655440000",
    "vendorId": "550e8400-e29b-41d4-a716-446655440001",
    "bookingDate": "2024-02-15",
    "affiliateSource": "viator",
    "externalBookingId": "viator_123456",
    "externalPlatform": "viator",
    "totalPrice": 149.99
  }'
```

**Parameters:**
- `activityId` (string, required): Activity ID
- `vendorId` (string, required): Vendor ID
- `userId` (string, optional): User ID if known
- `bookingDate` (string, optional): Booking date (YYYY-MM-DD)
- `affiliateSource` (string, optional): Source of booking
- `externalBookingId` (string, optional): External booking reference
- `externalPlatform` (string, optional): viator|getyourguide|direct|other
- `totalPrice` (number, optional): Total price

**Response (201 Created):**
```json
{
  "message": "Booking tracked successfully",
  "booking": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "activityId": "550e8400-e29b-41d4-a716-446655440000",
    "vendorId": "550e8400-e29b-41d4-a716-446655440001",
    "conversionStatus": "click",
    "commissionAmount": 22.50,
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

**Note:** Commissions calculated as 15% of total price by default.

---

## Review Endpoints

### GET /api/reviews

Get reviews for an activity.

**Request:**
```bash
curl "http://localhost:3000/api/reviews?activityId=550e8400-e29b-41d4-a716-446655440000&page=1"
```

**Query Parameters:**
- `activityId` (string, required): Activity ID
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "activityId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "rating": 5,
      "title": "Amazing experience!",
      "text": "Best hike I've ever done. Sunrise was breathtaking...",
      "verified": true,
      "helpfulCount": 12,
      "unhelpfulCount": 1,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

---

### POST /api/reviews

Post a review for an activity (users only).

**Request:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "activityId": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "title": "Absolutely incredible!",
    "text": "This was the best day of our vacation. Highly recommend!"
  }'
```

**Parameters:**
- `activityId` (string, required): Activity ID
- `rating` (number, required): Rating 1-5
- `title` (string, optional): Review title
- `text` (string, optional): Full review text

**Response (201 Created):**
```json
{
  "message": "Review posted successfully",
  "review": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "activityId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "title": "Absolutely incredible!",
    "text": "This was the best day of our vacation. Highly recommend!",
    "verified": false,
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

**Errors:**
- 401: Unauthorized (not logged in)
- 400: Rating required (1-5)
- 409: Already reviewed this activity

**Note:** Activity rating automatically updated after review posted.

---

## System Endpoints

### GET /api/health

Health check endpoint (no auth required).

**Request:**
```bash
curl http://localhost:3000/api/health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T15:30:00Z",
  "environment": "production",
  "database": {
    "connected": true
  },
  "features": {
    "stripe": true,
    "sendgrid": true,
    "supabase": true
  }
}
```

---

## Rate Limiting

No built-in rate limiting, but recommended to add via:
- Vercel Edge Middleware
- Cloudflare
- API Gateway (AWS, Azure)

## CORS

CORS is enabled for all origins by default. Configure in `next.config.js` if needed.

## Webhook

### Stripe Webhook

All payment events sent to `/api/webhooks/stripe`

Signed with `STRIPE_WEBHOOK_SECRET`

---

**Last Updated:** January 2024
**API Version:** 1.0.0

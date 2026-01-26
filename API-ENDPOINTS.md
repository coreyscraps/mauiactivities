# Maui Activities Hub - API Endpoints

## 🔍 **Search & Filter Endpoints**

### GET /api/activities/search
Search activities with filtering and sorting

**Query Parameters:**
- `q` - Search term (activity name, description)
- `category` - Filter by category ID
- `location` - Filter by location ID
- `sortBy` - `price_asc`, `price_desc`, `rating`, `popularity`, `newest`
- `priceMin` - Minimum price
- `priceMax` - Maximum price
- `minRating` - Minimum rating (1-5)
- `page` - Page number
- `limit` - Results per page (default: 20)

**Response:**
```json
{
  "activities": [
    {
      "id": "uuid",
      "name": "Snorkeling at Molokini",
      "vendor": {
        "id": "vendor-id",
        "name": "Trilogy Excursions",
        "rating": 4.8,
        "reviewCount": 456
      },
      "category": "Water Activities",
      "location": "Wailea",
      "price": 129.99,
      "originalPrice": 149.99,
      "discount": 13,
      "rating": 4.8,
      "reviewCount": 456,
      "popularity": 2340,
      "imageUrl": "...",
      "bookingUrl": "..."
    }
  ],
  "totalCount": 245,
  "page": 1,
  "totalPages": 12
}
```

---

### GET /api/activities/:id
Get single activity details with full vendor info

**Response:**
```json
{
  "id": "uuid",
  "name": "Snorkeling at Molokini",
  "description": "...",
  "vendor": {
    "id": "vendor-id",
    "name": "Trilogy Excursions",
    "website": "https://sailtrilogy.com",
    "rating": 4.8,
    "reviewCount": 456,
    "approved": true,
    "featured": true
  },
  "category": "Water Activities",
  "location": "Wailea",
  "price": 129.99,
  "originalPrice": 149.99,
  "discount": 13,
  "duration": 240,
  "groupSize": { "min": 1, "max": 20 },
  "difficulty": "easy",
  "rating": 4.8,
  "reviewCount": 456,
  "popularity": 2340,
  "images": ["..."],
  "reviews": [
    {
      "user": "John D.",
      "rating": 5,
      "title": "Amazing experience!",
      "comment": "...",
      "verifiedUser": true
    }
  ],
  "bookingUrl": "https://sailtrilogy.com/booking"
}
```

---

### GET /api/activities/category/:categoryId
Get all activities in a category, sorted by price/rating

**Query Parameters:**
- `sortBy` - `price_asc`, `price_desc`, `rating`, `popularity`

---

### GET /api/activities/compare
Compare prices across vendors for same activity type

**Query Parameters:**
- `type` - Activity type (e.g., "snorkeling")
- `location` - Optional location filter

**Response:**
```json
{
  "activity": "Snorkeling",
  "location": "Wailea",
  "vendors": [
    {
      "vendor": "Trilogy Excursions",
      "price": 129.99,
      "rating": 4.8,
      "bookingUrl": "..."
    },
    {
      "vendor": "Pride of Maui",
      "price": 149.99,
      "rating": 4.5,
      "bookingUrl": "..."
    }
  ],
  "cheapest": "Trilogy Excursions",
  "bestRated": "Trilogy Excursions",
  "mostPopular": "Trilogy Excursions"
}
```

---

### GET /api/trending
Get trending/popular activities

**Response:**
```json
{
  "trending": [
    {
      "id": "uuid",
      "name": "...",
      "vendor": "...",
      "price": 129.99,
      "rating": 4.8,
      "views": 5000,
      "bookings": 450
    }
  ]
}
```

---

### GET /api/deals
Get cheapest activities by category

**Response:**
```json
{
  "deals": [
    {
      "category": "Water Activities",
      "cheapest": {
        "name": "Snorkeling",
        "vendor": "Trilogy Excursions",
        "price": 129.99,
        "originalPrice": 149.99,
        "savings": 20
      }
    }
  ]
}
```

---

## 📱 **Frontend Filtering UI**

### Filter Panel
- **Category Dropdown** (Water, Land, Air, Wellness, etc.)
- **Location Dropdown** (Wailea, Lahaina, Haleakala, etc.)
- **Price Slider** ($0 - $500+)
- **Minimum Rating Filter** (1-5 stars)

### Sort Options
- **Cheapest First** (Price: Low to High)
- **Most Expensive** (Price: High to Low)
- **Best Reviews** (Rating: High to Low)
- **Most Popular** (Views/Bookings: High to Low)
- **Newest** (Recently Added)

### Activity Card Display
```
[Image]
Activity Name
⭐ 4.8 (456 reviews)
Vendor: Trilogy Excursions
Location: Wailea
Duration: 4 hours
Price: $129.99 (was $149.99)
[View on Vendor Site] button
[Save to Favorites] button
```

---

## 🔧 **Database Fields Needed**

Activities table needs:
- `base_price` - Current vendor price
- `original_price` - Original price (for discount calculation)
- `price_currency` - Currency (USD)
- `price_last_updated` - When price was synced
- `rating` - Average rating (1-5)
- `review_count` - Total reviews
- `view_count` - How many times viewed
- `booking_count` - Total bookings/clicks
- `vendor_id` - Link to vendor
- `booking_url` - Direct link to vendor booking

---

## 🎯 **Price Sync Strategy**

Since you're aggregating real vendor prices:

1. **Manual Entry** - Vendors paste their prices when they sign up
2. **Web Scraping** (Later) - Automated price updates from vendor websites
3. **API Integration** (Future) - Direct integration with booking platforms

For now: **Vendors submit prices + you verify + display**

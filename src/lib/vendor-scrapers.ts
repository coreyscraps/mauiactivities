/**
 * Vendor-Specific Web Scrapers
 * Extract prices, activities, and deals from vendor websites
 */

import fetch from 'node-fetch';

interface Activity {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  url: string;
}

/**
 * Generic price fetcher and parser for vendor websites
 */
export async function fetchAndParsePrices(vendorUrl: string, category: string): Promise<Activity[]> {
  try {
    const response = await fetch(vendorUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Vendor-specific parsing based on URL
    if (vendorUrl.includes('sailtrilogy')) {
      return parseTrilogyExcursions(html);
    } else if (vendorUrl.includes('prideofmaui')) {
      return parsePrideOfMaui(html);
    } else if (vendorUrl.includes('mauidiveshop')) {
      return parseMauiDiveShop(html);
    } else if (vendorUrl.includes('teralani')) {
      return parseTeralani(html);
    } else if (vendorUrl.includes('hikemaui')) {
      return parseHikeMaui(html);
    } else {
      // Fallback generic parser
      return parseGeneric(html, vendorUrl);
    }
  } catch (error) {
    console.error(`Error fetching ${vendorUrl}:`, error);
    return [];
  }
}

/**
 * Parse Trilogy Excursions website
 */
function parseTrilogyExcursions(html: string): Activity[] {
  const activities: Activity[] = [];

  // Look for price patterns like "$129.99" or "$129"
  const priceRegex = /\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g;
  const nameRegex = /<h[1-4][^>]*>([^<]+)<\/h[1-4]>/g;

  // Simple extraction - in production, use Cheerio or similar
  let match;
  const prices = [];
  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(parseFloat(match[1].replace(',', '')));
  }

  // Return first few detected prices with generic names
  for (let i = 0; i < Math.min(prices.length, 5); i++) {
    activities.push({
      name: `Activity ${i + 1}`,
      price: prices[i],
      url: 'https://sailtrilogy.com/booking',
    });
  }

  return activities;
}

/**
 * Parse Pride of Maui website
 */
function parsePrideOfMaui(html: string): Activity[] {
  // Similar to Trilogy
  const activities: Activity[] = [];
  const priceRegex = /\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g;

  let match;
  const prices = [];
  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(parseFloat(match[1].replace(',', '')));
  }

  for (let i = 0; i < Math.min(prices.length, 3); i++) {
    activities.push({
      name: `Maui Tour ${i + 1}`,
      price: prices[i],
      url: 'https://prideofmaui.com/booking',
    });
  }

  return activities;
}

/**
 * Parse Maui Dive Shop website
 */
function parseMauiDiveShop(html: string): Activity[] {
  const activities: Activity[] = [];
  const priceRegex = /\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g;

  let match;
  const prices = [];
  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(parseFloat(match[1].replace(',', '')));
  }

  for (let i = 0; i < Math.min(prices.length, 4); i++) {
    activities.push({
      name: `Diving Experience ${i + 1}`,
      price: prices[i],
      url: 'https://mauidiveshop.com/booking',
    });
  }

  return activities;
}

/**
 * Parse Teralani website
 */
function parseTeralani(html: string): Activity[] {
  const activities: Activity[] = [];
  const priceRegex = /\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g;

  let match;
  const prices = [];
  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(parseFloat(match[1].replace(',', '')));
  }

  for (let i = 0; i < Math.min(prices.length, 3); i++) {
    activities.push({
      name: `Snorkeling Experience ${i + 1}`,
      price: prices[i],
      url: 'https://teralani.net/book',
    });
  }

  return activities;
}

/**
 * Parse Hike Maui website
 */
function parseHikeMaui(html: string): Activity[] {
  const activities: Activity[] = [];
  const priceRegex = /\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g;

  let match;
  const prices = [];
  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(parseFloat(match[1].replace(',', '')));
  }

  for (let i = 0; i < Math.min(prices.length, 4); i++) {
    activities.push({
      name: `Hiking Tour ${i + 1}`,
      price: prices[i],
      url: 'https://hikemaui.com/tours',
    });
  }

  return activities;
}

/**
 * Generic fallback parser for unknown vendors
 */
function parseGeneric(html: string, vendorUrl: string): Activity[] {
  const activities: Activity[] = [];

  // Extract all prices from the page
  const priceRegex = /\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/g;
  let match;
  const prices = [];

  while ((match = priceRegex.exec(html)) !== null) {
    const price = parseFloat(match[1].replace(',', ''));
    // Filter out unrealistic prices
    if (price > 10 && price < 5000) {
      prices.push(price);
    }
  }

  // Get unique prices (remove duplicates)
  const uniquePrices = [...new Set(prices)];

  // Return top 5 prices as separate activities
  for (let i = 0; i < Math.min(uniquePrices.length, 5); i++) {
    activities.push({
      name: `Activity - Price $${uniquePrices[i].toFixed(2)}`,
      price: uniquePrices[i],
      url: vendorUrl,
    });
  }

  return activities;
}

/**
 * Detect special deals/discounts from activity description
 */
export function detectDiscount(description: string): { discount: string; percent: number } | null {
  const patterns = [
    { regex: /save\s+(\d+)%/i, type: 'percent' },
    { regex: /(\d+)%\s+off/i, type: 'percent' },
    { regex: /discount.*?(\d+)%/i, type: 'percent' },
    { regex: /save\s+\$(\d+)/i, type: 'fixed' },
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern.regex);
    if (match) {
      return {
        discount: match[0],
        percent: pattern.type === 'percent' ? parseFloat(match[1]) : 0,
      };
    }
  }

  return null;
}

/**
 * Extract price from text string
 */
export function extractPrice(text: string): number | null {
  const match = text.match(/\$(\d{1,4}(?:,\d{3})*(?:\.\d{2})?)/);
  if (match) {
    return parseFloat(match[1].replace(',', ''));
  }
  return null;
}

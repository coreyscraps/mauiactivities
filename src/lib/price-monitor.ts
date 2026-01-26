/**
 * Price Monitoring Service
 * Continuously monitors vendor websites for price changes, deals, and discounts
 */

import { supabaseAdmin } from './supabase';
import { fetchAndParsePrices } from './vendor-scrapers';

interface PriceCheckResult {
  activityId: string;
  vendorId: string;
  oldPrice: number;
  newPrice: number;
  priceChange: number;
  priceChangePercent: number;
  discountDetected?: string;
  isDecrease: boolean;
}

interface ScrapeResult {
  vendorId: string;
  status: 'success' | 'failed' | 'timeout' | 'blocked';
  itemsFound: number;
  pricesUpdated: number;
  dealsFound: number;
  errorMessage?: string;
  executionTimeMs: number;
  activities: {
    name: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    url: string;
  }[];
}

/**
 * Main price monitoring loop
 * Run this periodically (hourly, 3x daily, or daily)
 */
export async function runPriceMonitoring() {
  console.log('[PRICE MONITOR] Starting price check...', new Date().toISOString());

  try {
    // Get all active vendors
    const { data: vendors, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('id, name, website, category')
      .eq('subscription_status', 'active')
      .eq('approved', true);

    if (vendorError || !vendors) {
      console.error('[PRICE MONITOR] Failed to fetch vendors:', vendorError);
      return { success: false, error: vendorError };
    }

    console.log(`[PRICE MONITOR] Found ${vendors.length} active vendors`);

    const allResults: ScrapeResult[] = [];

    // Process each vendor
    for (const vendor of vendors) {
      const startTime = Date.now();

      try {
        const result = await scrapeVendorPrices(vendor);
        const executionTimeMs = Date.now() - startTime;

        allResults.push({
          ...result,
          executionTimeMs,
        });

        // Log result to database
        await logScrapeResult({
          vendor_id: vendor.id,
          status: result.status,
          items_found: result.itemsFound,
          prices_updated: result.pricesUpdated,
          deals_found: result.dealsFound,
          error_message: result.errorMessage,
          execution_time_ms: executionTimeMs,
        });

        console.log(
          `[PRICE MONITOR] ${vendor.name}: ${result.status} (${result.pricesUpdated} updated, ${result.dealsFound} deals)`
        );
      } catch (vendorError) {
        console.error(`[PRICE MONITOR] Error scraping ${vendor.name}:`, vendorError);

        await logScrapeResult({
          vendor_id: vendor.id,
          status: 'failed',
          items_found: 0,
          prices_updated: 0,
          deals_found: 0,
          error_message: (vendorError as Error).message,
          execution_time_ms: Date.now() - startTime,
        });
      }

      // Rate limiting: wait between vendors to avoid overwhelming servers
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(
      `[PRICE MONITOR] Completed. Updated ${allResults.reduce((sum, r) => sum + r.pricesUpdated, 0)} prices, found ${allResults.reduce((sum, r) => sum + r.dealsFound, 0)} deals`
    );

    return {
      success: true,
      vendorsProcessed: vendors.length,
      results: allResults,
    };
  } catch (error) {
    console.error('[PRICE MONITOR] Fatal error:', error);
    return { success: false, error };
  }
}

/**
 * Scrape a single vendor's website for prices
 */
async function scrapeVendorPrices(vendor: any): Promise<ScrapeResult> {
  const startTime = Date.now();

  try {
    // Fetch and parse vendor website
    const activities = await fetchAndParsePrices(vendor.website, vendor.category);

    if (!activities || activities.length === 0) {
      return {
        vendorId: vendor.id,
        status: 'failed',
        itemsFound: 0,
        pricesUpdated: 0,
        dealsFound: 0,
        errorMessage: 'No activities found on vendor website',
        executionTimeMs: Date.now() - startTime,
        activities: [],
      };
    }

    let pricesUpdated = 0;
    let dealsFound = 0;
    const updatedActivities = [];

    // Compare and update prices
    for (const activity of activities) {
      const priceCheckResult = await checkAndUpdatePrice(vendor.id, activity);

      if (priceCheckResult) {
        pricesUpdated++;
        updatedActivities.push(activity);

        // Check if this is a deal (>10% discount)
        if (priceCheckResult.priceChangePercent < -10) {
          dealsFound++;
          await logDeal({
            vendor_id: vendor.id,
            activity_name: activity.name,
            original_price: activity.originalPrice || activity.price,
            deal_price: activity.price,
            discount_percent: Math.abs(priceCheckResult.priceChangePercent),
            discount_description: activity.discount,
          });
        }
      }
    }

    return {
      vendorId: vendor.id,
      status: 'success',
      itemsFound: activities.length,
      pricesUpdated,
      dealsFound,
      executionTimeMs: Date.now() - startTime,
      activities: activities.map((a) => ({
        name: a.name,
        price: a.price,
        originalPrice: a.originalPrice,
        discount: a.discount,
        url: a.url,
      })),
    };
  } catch (error) {
    return {
      vendorId: vendor.id,
      status: 'failed',
      itemsFound: 0,
      pricesUpdated: 0,
      dealsFound: 0,
      errorMessage: (error as Error).message,
      executionTimeMs: Date.now() - startTime,
      activities: [],
    };
  }
}

/**
 * Check if activity price changed and update database
 */
async function checkAndUpdatePrice(vendorId: string, activity: any): Promise<PriceCheckResult | null> {
  try {
    // Find existing activity by vendor and name
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('activities')
      .select('id, base_price, original_price')
      .eq('vendor_id', vendorId)
      .ilike('name', `%${activity.name.substring(0, 20)}%`)
      .limit(1);

    if (fetchError || !existing || existing.length === 0) {
      // New activity - create it
      const { error: insertError } = await supabaseAdmin.from('activities').insert({
        vendor_id: vendorId,
        name: activity.name,
        base_price: activity.price,
        original_price: activity.originalPrice,
        currency: 'USD',
        booking_url: activity.url,
        price_source: 'vendor_website',
        price_last_updated: new Date(),
        status: 'published',
      });

      if (insertError) {
        console.error('Error inserting new activity:', insertError);
        return null;
      }

      return {
        activityId: '',
        vendorId,
        oldPrice: 0,
        newPrice: activity.price,
        priceChange: activity.price,
        priceChangePercent: 0,
        isDecrease: false,
      };
    }

    const existingActivity = existing[0];
    const oldPrice = existingActivity.base_price || 0;
    const newPrice = activity.price;
    const priceChange = newPrice - oldPrice;
    const priceChangePercent = oldPrice > 0 ? (priceChange / oldPrice) * 100 : 0;

    // Only update if price changed by more than $1
    if (Math.abs(priceChange) < 1) {
      return null;
    }

    // Record price history
    await supabaseAdmin.from('price_history').insert({
      activity_id: existingActivity.id,
      vendor_id: vendorId,
      old_price: oldPrice,
      new_price: newPrice,
      price_change: priceChange,
      price_change_percent: priceChangePercent,
      discount_detected: activity.discount,
      scraped_at: new Date(),
    });

    // Update activity price
    const { error: updateError } = await supabaseAdmin
      .from('activities')
      .update({
        base_price: newPrice,
        original_price: activity.originalPrice,
        price_last_updated: new Date(),
        discount_percent: activity.originalPrice
          ? ((activity.originalPrice - newPrice) / activity.originalPrice) * 100
          : 0,
      })
      .eq('id', existingActivity.id);

    if (updateError) {
      console.error('Error updating activity price:', updateError);
      return null;
    }

    return {
      activityId: existingActivity.id,
      vendorId,
      oldPrice,
      newPrice,
      priceChange,
      priceChangePercent,
      discountDetected: activity.discount,
      isDecrease: priceChange < 0,
    };
  } catch (error) {
    console.error('Error in checkAndUpdatePrice:', error);
    return null;
  }
}

/**
 * Log scraper execution result
 */
async function logScrapeResult(data: any) {
  try {
    await supabaseAdmin.from('scraper_logs').insert({
      vendor_id: data.vendor_id,
      status: data.status,
      items_found: data.items_found,
      prices_updated: data.prices_updated,
      deals_found: data.deals_found,
      error_message: data.error_message,
      execution_time_ms: data.execution_time_ms,
      created_at: new Date(),
    });
  } catch (error) {
    console.error('Error logging scrape result:', error);
  }
}

/**
 * Log special deals detected
 */
async function logDeal(data: any) {
  try {
    await supabaseAdmin.from('special_deals').insert({
      vendor_id: data.vendor_id,
      deal_title: `${data.discount_percent.toFixed(1)}% Off - ${data.activity_name}`,
      deal_description: data.discount_description || `Save ${data.discount_percent.toFixed(1)}%`,
      discount_percent: data.discount_percent,
      discount_amount: data.original_price - data.deal_price,
      original_price: data.original_price,
      deal_price: data.deal_price,
      deal_start_date: new Date(),
      deal_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      is_active: true,
      scraped_at: new Date(),
    });
  } catch (error) {
    console.error('Error logging deal:', error);
  }
}

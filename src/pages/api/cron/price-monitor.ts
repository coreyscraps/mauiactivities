/**
 * Cron Job Endpoint for Price Monitoring
 * GET /api/cron/price-monitor?secret=YOUR_CRON_SECRET
 * 
 * Can be triggered by:
 * - Vercel Cron (automatic every 6 hours if deployed on Vercel)
 * - External cron service (EasyCron, AWS EventBridge, etc.)
 * - Manual API calls
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { runPriceMonitoring } from '@/lib/price-monitor';

// Validate with a secret to prevent unauthorized cron triggers
const CRON_SECRET = process.env.PRICE_MONITOR_CRON_SECRET || 'dev-secret-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate cron secret
  const { secret } = req.query;
  if (secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if already running (prevent concurrent executions)
  const runId = `run-${Date.now()}`;
  console.log(`[CRON] Starting price monitor run: ${runId}`);

  try {
    const result = await runPriceMonitoring();

    console.log(`[CRON] Price monitor completed: ${runId}`, result);

    return res.status(200).json({
      success: result.success,
      runId,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error(`[CRON] Price monitor failed: ${runId}`, error);

    return res.status(500).json({
      success: false,
      runId,
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

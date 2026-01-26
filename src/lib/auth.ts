import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  isVendor: boolean;
  iat: number;
  exp: number;
}

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload as any, JWT_SECRET as any, { expiresIn: JWT_EXPIRY } as any) as string;
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextApiRequest): string | null {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify JWT token from request
 */
export async function verifyAuth(request: NextApiRequest): Promise<JWTPayload | null> {
  const token = extractToken(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

/**
 * Create error response for unauthorized access
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): { status: number; error: string } {
  return { status: 401, error: message };
}

/**
 * Create error response for forbidden access
 */
export function forbiddenResponse(message: string = 'Forbidden'): { status: number; error: string } {
  return { status: 403, error: message };
}

/**
 * Check if user is vendor
 */
export function requireVendor(payload: JWTPayload | null): boolean {
  return payload !== null && payload.isVendor === true;
}

/**
 * Calculate pass expiry date (180 days from now)
 */
export function calculatePassExpiryDate(): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + (parseInt(process.env.PASS_VALIDITY_DAYS || '180')));
  return expiryDate;
}

/**
 * Check if pass is expired
 */
export function isPassExpired(expiryDate: Date | string | null): boolean {
  if (!expiryDate) return true;
  const expiry = new Date(expiryDate);
  return expiry < new Date();
}

/**
 * Get days until pass expiry
 */
export function getDaysUntilExpiry(expiryDate: Date | string | null): number {
  if (!expiryDate) return 0;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

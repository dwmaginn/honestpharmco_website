import { Context, Next } from 'hono';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string; // Custom error message
  keyGenerator?: (c: Context) => string; // Function to generate unique key
}

// In-memory store for rate limiting (in production, use Redis or KV)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries on each request (Cloudflare Workers don't support setInterval)
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime < now) {
      requestCounts.delete(key);
    }
  }
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // 100 requests default
    message = 'Too many requests, please try again later.',
    keyGenerator = (c) => c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
  } = options;

  return async (c: Context, next: Next) => {
    // Clean up expired entries periodically
    if (Math.random() < 0.1) { // 10% chance to clean up
      cleanupExpiredEntries();
    }
    
    const key = keyGenerator(c);
    const now = Date.now();
    
    // Get or create request count for this key
    let requestData = requestCounts.get(key);
    
    if (!requestData || requestData.resetTime < now) {
      // Create new window
      requestData = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
      // Increment count in current window
      requestData.count++;
    }
    
    requestCounts.set(key, requestData);
    
    // Set rate limit headers
    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, max - requestData.count).toString());
    c.header('X-RateLimit-Reset', new Date(requestData.resetTime).toISOString());
    
    // Check if limit exceeded
    if (requestData.count > max) {
      c.header('Retry-After', Math.ceil((requestData.resetTime - now) / 1000).toString());
      return c.json({ error: message }, 429);
    }
    
    return next();
  };
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  // Strict limit for auth endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many authentication attempts. Please try again later.'
  }),
  
  // Moderate limit for API endpoints
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  }),
  
  // Lenient limit for public pages
  pages: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window
  })
};

// Rate limiter using Cloudflare KV for distributed rate limiting
export function createKVRateLimiter(options: RateLimitOptions & { namespace: KVNamespace }) {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'Too many requests, please try again later.',
    keyGenerator = (c) => c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown',
    namespace
  } = options;

  return async (c: Context, next: Next) => {
    const key = `rate_limit:${keyGenerator(c)}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get current count from KV
    const storedData = await namespace.get(key, 'json') as { count: number; windowStart: number } | null;
    
    let count = 1;
    if (storedData && storedData.windowStart > windowStart) {
      count = storedData.count + 1;
    }
    
    // Store updated count
    await namespace.put(key, JSON.stringify({ count, windowStart: now }), {
      expirationTtl: Math.ceil(windowMs / 1000)
    });
    
    // Set headers
    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, max - count).toString());
    
    // Check limit
    if (count > max) {
      return c.json({ error: message }, 429);
    }
    
    return next();
  };
}
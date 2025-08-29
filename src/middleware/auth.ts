import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

export interface UserPayload {
  id: number
  email: string
  isAdmin: boolean
  isApproved: boolean
}

// Get JWT secret from environment variable, with fallback for local development
function getJWTSecret(c: Context): string {
  // In Cloudflare Workers, environment variables are accessed via c.env
  const secret = c.env?.JWT_SECRET || process.env?.JWT_SECRET
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured')
  }
  
  return secret
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const token = getCookie(c, 'auth-token') || c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const jwtSecret = getJWTSecret(c)
    const payload = jwt.verify(token, jwtSecret) as UserPayload
    
    // Store user info in context
    c.set('user', payload)
    
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export function generateToken(user: UserPayload, c: Context): string {
  const jwtSecret = getJWTSecret(c)
  return jwt.sign(user, jwtSecret, { expiresIn: '7d' })
}

export function getCookie(c: Context, name: string): string | undefined {
  const cookie = c.req.header('Cookie')
  if (!cookie) return undefined
  
  const cookies = cookie.split(';').map(c => c.trim())
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === name) return value
  }
  return undefined
}

export function setCookie(c: Context, name: string, value: string, options: any = {}) {
  const opts = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...options
  }
  
  const cookieString = `${name}=${value}; Path=${opts.path}; HttpOnly; Secure; SameSite=${opts.sameSite}; Max-Age=${opts.maxAge}`
  c.header('Set-Cookie', cookieString)
}
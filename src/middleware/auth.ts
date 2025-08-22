import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key-change-in-production'

export interface UserPayload {
  id: number
  email: string
  isAdmin: boolean
  isApproved: boolean
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const token = getCookie(c, 'auth-token') || c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const payload = jwt.verify(token, JWT_SECRET) as UserPayload
    
    // Store user info in context
    c.set('user', payload)
    
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
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
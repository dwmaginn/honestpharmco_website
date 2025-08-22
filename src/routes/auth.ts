import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { generateToken, setCookie } from '../middleware/auth'

const authRoutes = new Hono()

// Register new user
authRoutes.post('/register', async (c) => {
  try {
    const { email, password, companyName, contactName, phone, address, city, state, zip, licenseNumber } = await c.req.json()
    
    // Validate required fields
    if (!email || !password || !contactName) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    const db = c.env.DB
    
    // Check if user exists
    const existingUser = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Insert new user (not approved by default)
    const result = await db.prepare(`
      INSERT INTO users (email, password_hash, company_name, contact_name, phone, address, city, state, zip, license_number, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)
    `).bind(email, passwordHash, companyName, contactName, phone, address, city, state, zip, licenseNumber).run()

    return c.json({ 
      success: true, 
      message: 'Registration successful. Please wait for admin approval.',
      userId: result.meta.last_row_id 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// Login
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    const db = c.env.DB
    
    // Get user
    const user = await db.prepare(`
      SELECT id, email, password_hash, company_name, contact_name, is_approved, is_admin 
      FROM users WHERE email = ?
    `).bind(email).first()

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash as string)
    if (!validPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Check if approved
    if (!user.is_approved && !user.is_admin) {
      return c.json({ error: 'Account pending approval' }, 403)
    }

    // Generate token
    const token = generateToken({
      id: user.id as number,
      email: user.email as string,
      isAdmin: user.is_admin as boolean,
      isApproved: user.is_approved as boolean
    })

    // Set cookie
    setCookie(c, 'auth-token', token)

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        contactName: user.contact_name,
        isAdmin: user.is_admin
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Logout
authRoutes.post('/logout', async (c) => {
  setCookie(c, 'auth-token', '', { maxAge: 0 })
  return c.json({ success: true })
})

// Check auth status
authRoutes.get('/check', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ authenticated: false })
  }

  try {
    // Verify token logic here
    return c.json({ authenticated: true })
  } catch {
    return c.json({ authenticated: false })
  }
})

export { authRoutes }
import { Hono } from 'hono'
import { getCookie } from '../middleware/auth'
import jwt from 'jsonwebtoken'

const cartRoutes = new Hono()
const JWT_SECRET = 'your-secret-key-change-in-production'

// Get cart items
cartRoutes.get('/', async (c) => {
  try {
    const db = c.env.DB
    const token = getCookie(c, 'auth-token')
    const sessionId = getCookie(c, 'session-id') || c.req.header('X-Session-Id')
    
    let userId = null
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET) as any
        userId = user.id
      } catch {
        // Invalid token
      }
    }
    
    if (!userId && !sessionId) {
      return c.json({ items: [] })
    }
    
    let query = `
      SELECT 
        c.*,
        p.name,
        p.sku,
        p.price,
        p.wholesale_price,
        p.image_url,
        p.unit_size
      FROM carts c
      JOIN products p ON c.product_id = p.id
    `
    
    const params: any[] = []
    if (userId) {
      query += ' WHERE c.user_id = ?'
      params.push(userId)
    } else {
      query += ' WHERE c.session_id = ?'
      params.push(sessionId)
    }
    
    const items = await db.prepare(query).bind(...params).all()
    
    const total = items.results.reduce((sum: number, item: any) => {
      return sum + (item.wholesale_price * item.quantity)
    }, 0)
    
    return c.json({
      items: items.results,
      total,
      count: items.results.length
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return c.json({ error: 'Failed to fetch cart' }, 500)
  }
})

// Add item to cart
cartRoutes.post('/add', async (c) => {
  try {
    const { productId, quantity } = await c.req.json()
    
    if (!productId || !quantity || quantity < 1) {
      return c.json({ error: 'Invalid product or quantity' }, 400)
    }
    
    const db = c.env.DB
    const token = getCookie(c, 'auth-token')
    let sessionId = getCookie(c, 'session-id')
    
    // Generate session ID if needed
    if (!sessionId && !token) {
      sessionId = crypto.randomUUID()
      c.header('Set-Cookie', `session-id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`)
    }
    
    let userId = null
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET) as any
        userId = user.id
      } catch {
        // Invalid token
      }
    }
    
    // Check if product exists
    const product = await db.prepare('SELECT id, in_stock FROM products WHERE id = ?').bind(productId).first()
    if (!product || !product.in_stock) {
      return c.json({ error: 'Product not available' }, 400)
    }
    
    // Check if item already in cart
    let existingItem
    if (userId) {
      existingItem = await db.prepare('SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ?')
        .bind(userId, productId).first()
    } else {
      existingItem = await db.prepare('SELECT id, quantity FROM carts WHERE session_id = ? AND product_id = ?')
        .bind(sessionId, productId).first()
    }
    
    if (existingItem) {
      // Update quantity
      await db.prepare('UPDATE carts SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(existingItem.quantity + quantity, existingItem.id).run()
    } else {
      // Add new item
      await db.prepare(`
        INSERT INTO carts (user_id, session_id, product_id, quantity)
        VALUES (?, ?, ?, ?)
      `).bind(userId, sessionId, productId, quantity).run()
    }
    
    return c.json({ success: true, message: 'Item added to cart' })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return c.json({ error: 'Failed to add to cart' }, 500)
  }
})

// Update cart item quantity
cartRoutes.put('/update', async (c) => {
  try {
    const { productId, quantity } = await c.req.json()
    
    if (!productId || quantity < 0) {
      return c.json({ error: 'Invalid input' }, 400)
    }
    
    const db = c.env.DB
    const token = getCookie(c, 'auth-token')
    const sessionId = getCookie(c, 'session-id')
    
    let userId = null
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET) as any
        userId = user.id
      } catch {
        // Invalid token
      }
    }
    
    if (quantity === 0) {
      // Remove item
      if (userId) {
        await db.prepare('DELETE FROM carts WHERE user_id = ? AND product_id = ?')
          .bind(userId, productId).run()
      } else if (sessionId) {
        await db.prepare('DELETE FROM carts WHERE session_id = ? AND product_id = ?')
          .bind(sessionId, productId).run()
      }
    } else {
      // Update quantity
      if (userId) {
        await db.prepare('UPDATE carts SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?')
          .bind(quantity, userId, productId).run()
      } else if (sessionId) {
        await db.prepare('UPDATE carts SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND product_id = ?')
          .bind(quantity, sessionId, productId).run()
      }
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error updating cart:', error)
    return c.json({ error: 'Failed to update cart' }, 500)
  }
})

// Clear cart
cartRoutes.delete('/clear', async (c) => {
  try {
    const db = c.env.DB
    const token = getCookie(c, 'auth-token')
    const sessionId = getCookie(c, 'session-id')
    
    let userId = null
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET) as any
        userId = user.id
      } catch {
        // Invalid token
      }
    }
    
    if (userId) {
      await db.prepare('DELETE FROM carts WHERE user_id = ?').bind(userId).run()
    } else if (sessionId) {
      await db.prepare('DELETE FROM carts WHERE session_id = ?').bind(sessionId).run()
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return c.json({ error: 'Failed to clear cart' }, 500)
  }
})

export { cartRoutes }
import { Hono } from 'hono'
import { getCookie } from '../middleware/auth'
import jwt from 'jsonwebtoken'

const productRoutes = new Hono()
const JWT_SECRET = 'your-secret-key-change-in-production'

// Get all products (public can see products, but not prices without login)
productRoutes.get('/', async (c) => {
  try {
    const db = c.env.DB
    
    // Check if user is authenticated
    const token = getCookie(c, 'auth-token') || c.req.header('Authorization')?.replace('Bearer ', '')
    let isAuthenticated = false
    let user = null
    
    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET)
        isAuthenticated = true
      } catch {
        // Invalid token, continue as unauthenticated
      }
    }

    // Get filter parameters
    const category = c.req.query('category')
    const search = c.req.query('search')
    const featured = c.req.query('featured')
    
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.in_stock = true
    `
    
    const params: any[] = []
    
    if (category) {
      query += ' AND c.slug = ?'
      params.push(category)
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    
    if (featured === 'true') {
      query += ' AND p.featured = true'
    }
    
    query += ' ORDER BY p.featured DESC, p.name ASC'
    
    const products = await db.prepare(query).bind(...params).all()
    
    // Remove prices if not authenticated
    const processedProducts = products.results.map(product => {
      if (!isAuthenticated) {
        // Remove price information for non-authenticated users
        const { price, wholesale_price, ...publicProduct } = product
        return {
          ...publicProduct,
          requiresLogin: true
        }
      }
      return product
    })
    
    return c.json({
      products: processedProducts,
      authenticated: isAuthenticated
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

// Get single product by ID
productRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.DB
    
    // Check authentication
    const token = getCookie(c, 'auth-token') || c.req.header('Authorization')?.replace('Bearer ', '')
    let isAuthenticated = false
    
    if (token) {
      try {
        jwt.verify(token, JWT_SECRET)
        isAuthenticated = true
      } catch {
        // Invalid token
      }
    }
    
    const product = await db.prepare(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).bind(id).first()
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    // Remove prices if not authenticated
    if (!isAuthenticated) {
      const { price, wholesale_price, ...publicProduct } = product
      return c.json({
        ...publicProduct,
        requiresLogin: true
      })
    }
    
    return c.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return c.json({ error: 'Failed to fetch product' }, 500)
  }
})

// Get all categories
productRoutes.get('/categories/all', async (c) => {
  try {
    const db = c.env.DB
    
    const categories = await db.prepare(`
      SELECT * FROM categories ORDER BY display_order ASC, name ASC
    `).all()
    
    return c.json(categories.results)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

export { productRoutes }
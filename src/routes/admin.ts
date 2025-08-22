import { Hono } from 'hono'

const adminRoutes = new Hono()

// Admin middleware
adminRoutes.use('*', async (c, next) => {
  const user = c.get('user')
  if (!user.isAdmin) {
    return c.json({ error: 'Admin access required' }, 403)
  }
  await next()
})

// Get all pending user approvals
adminRoutes.get('/users/pending', async (c) => {
  try {
    const db = c.env.DB
    
    const users = await db.prepare(`
      SELECT id, email, company_name, contact_name, license_number, created_at 
      FROM users 
      WHERE is_approved = false AND is_admin = false
      ORDER BY created_at DESC
    `).all()
    
    return c.json(users.results)
  } catch (error) {
    console.error('Error fetching pending users:', error)
    return c.json({ error: 'Failed to fetch pending users' }, 500)
  }
})

// Approve user
adminRoutes.post('/users/:id/approve', async (c) => {
  try {
    const userId = c.req.param('id')
    const db = c.env.DB
    
    await db.prepare('UPDATE users SET is_approved = true WHERE id = ?').bind(userId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error approving user:', error)
    return c.json({ error: 'Failed to approve user' }, 500)
  }
})

// Get all orders
adminRoutes.get('/orders', async (c) => {
  try {
    const db = c.env.DB
    const status = c.req.query('status')
    
    let query = `
      SELECT 
        o.*,
        u.email,
        u.company_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `
    
    const params: any[] = []
    if (status) {
      query += ' WHERE o.status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY o.created_at DESC'
    
    const orders = await db.prepare(query).bind(...params).all()
    
    return c.json(orders.results)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

// Update order status
adminRoutes.put('/orders/:id/status', async (c) => {
  try {
    const orderId = c.req.param('id')
    const { status } = await c.req.json()
    const db = c.env.DB
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }
    
    await db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, orderId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error updating order status:', error)
    return c.json({ error: 'Failed to update order status' }, 500)
  }
})

// Add/Update product
adminRoutes.post('/products', async (c) => {
  try {
    const productData = await c.req.json()
    const db = c.env.DB
    
    if (productData.id) {
      // Update existing product
      await db.prepare(`
        UPDATE products SET
          category_id = ?, sku = ?, name = ?, strain_type = ?,
          thc_percentage = ?, cbd_percentage = ?, terpenes = ?,
          description = ?, effects = ?, flavors = ?, image_url = ?,
          pdf_page = ?, price = ?, wholesale_price = ?, unit_size = ?,
          units_per_case = ?, in_stock = ?, featured = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        productData.category_id, productData.sku, productData.name, productData.strain_type,
        productData.thc_percentage, productData.cbd_percentage, productData.terpenes,
        productData.description, productData.effects, productData.flavors, productData.image_url,
        productData.pdf_page, productData.price, productData.wholesale_price, productData.unit_size,
        productData.units_per_case, productData.in_stock, productData.featured,
        productData.id
      ).run()
    } else {
      // Insert new product
      await db.prepare(`
        INSERT INTO products (
          category_id, sku, name, strain_type, thc_percentage, cbd_percentage,
          terpenes, description, effects, flavors, image_url, pdf_page,
          price, wholesale_price, unit_size, units_per_case, in_stock, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        productData.category_id, productData.sku, productData.name, productData.strain_type,
        productData.thc_percentage, productData.cbd_percentage, productData.terpenes,
        productData.description, productData.effects, productData.flavors, productData.image_url,
        productData.pdf_page, productData.price, productData.wholesale_price, productData.unit_size,
        productData.units_per_case, productData.in_stock, productData.featured
      ).run()
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error saving product:', error)
    return c.json({ error: 'Failed to save product' }, 500)
  }
})

export { adminRoutes }
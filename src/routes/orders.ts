import { Hono } from 'hono'

const orderRoutes = new Hono()

// Get user's orders
orderRoutes.get('/', async (c) => {
  try {
    const user = c.get('user')
    const db = c.env.DB
    
    const orders = await db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).bind(user.id).all()
    
    return c.json(orders.results)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

// Get single order
orderRoutes.get('/:id', async (c) => {
  try {
    const orderId = c.req.param('id')
    const user = c.get('user')
    const db = c.env.DB
    
    // Get order
    const order = await db.prepare(`
      SELECT * FROM orders 
      WHERE id = ? AND user_id = ?
    `).bind(orderId, user.id).first()
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // Get order items
    const items = await db.prepare(`
      SELECT 
        oi.*,
        p.name,
        p.sku,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).bind(orderId).all()
    
    return c.json({
      ...order,
      items: items.results
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return c.json({ error: 'Failed to fetch order' }, 500)
  }
})

// Create new order
orderRoutes.post('/create', async (c) => {
  try {
    const user = c.get('user')
    const { shippingAddress, billingAddress, notes } = await c.req.json()
    const db = c.env.DB
    
    // Get cart items
    const cartItems = await db.prepare(`
      SELECT 
        c.*,
        p.wholesale_price,
        p.name
      FROM carts c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).bind(user.id).all()
    
    if (cartItems.results.length === 0) {
      return c.json({ error: 'Cart is empty' }, 400)
    }
    
    // Calculate totals
    const subtotal = cartItems.results.reduce((sum: number, item: any) => {
      return sum + (item.wholesale_price * item.quantity)
    }, 0)
    
    const tax = subtotal * 0.08875 // NY State tax rate
    const shipping = 0 // Free shipping or calculate based on location
    const total = subtotal + tax + shipping
    
    // Generate order number
    const orderNumber = `HPC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Create order
    const orderResult = await db.prepare(`
      INSERT INTO orders (
        user_id, order_number, status, subtotal, tax, shipping, total, 
        notes, shipping_address, billing_address
      ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id, orderNumber, subtotal, tax, shipping, total,
      notes, shippingAddress, billingAddress || shippingAddress
    ).run()
    
    const orderId = orderResult.meta.last_row_id
    
    // Add order items
    for (const item of cartItems.results) {
      const itemTotal = item.wholesale_price * item.quantity
      await db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price, total)
        VALUES (?, ?, ?, ?, ?)
      `).bind(orderId, item.product_id, item.quantity, item.wholesale_price, itemTotal).run()
    }
    
    // Clear cart
    await db.prepare('DELETE FROM carts WHERE user_id = ?').bind(user.id).run()
    
    return c.json({
      success: true,
      orderId,
      orderNumber,
      total
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

export { orderRoutes }
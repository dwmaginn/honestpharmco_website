import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { authRoutes } from './routes/auth'
import { productRoutes } from './routes/products'
import { orderRoutes } from './routes/orders'
import { cartRoutes } from './routes/cart'
import { adminRoutes } from './routes/admin'
import { authMiddleware } from './middleware/auth'
import { renderHomePage } from './pages/home'
import { renderLoginPage } from './pages/login'
import { renderCatalogPage } from './pages/catalog'
import { renderCartPage } from './pages/cart'

type Bindings = {
  DB: D1Database
  SESSIONS: KVNamespace
  CART: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/images/*', serveStatic({ root: './public/static' }))
app.use('/css/*', serveStatic({ root: './public/static' }))
app.use('/js/*', serveStatic({ root: './public/static' }))

// API Routes
app.route('/api/auth', authRoutes)
app.route('/api/products', productRoutes)
app.route('/api/cart', cartRoutes)

// Protected API routes
app.use('/api/orders/*', authMiddleware)
app.route('/api/orders', orderRoutes)

app.use('/api/admin/*', authMiddleware)
app.route('/api/admin', adminRoutes)

// Page Routes
app.get('/', async (c) => {
  return c.html(await renderHomePage())
})

app.get('/login', async (c) => {
  return c.html(await renderLoginPage())
})

app.get('/catalog', async (c) => {
  return c.html(await renderCatalogPage())
})

app.get('/cart', async (c) => {
  return c.html(await renderCartPage())
})

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
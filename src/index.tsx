import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { authRoutes } from './routes/auth'
import { productRoutes } from './routes/products'
import { orderRoutes } from './routes/orders'
import { cartRoutes } from './routes/cart'
import { adminRoutes } from './routes/admin'
import { authMiddleware } from './middleware/auth'
import { rateLimiters } from './middleware/rate-limit'
import { renderHomePage } from './pages/home'
import { renderLoginPage } from './pages/login'
import { renderCatalogPage } from './pages/catalog'
import { renderCartPage } from './pages/cart'

type Bindings = {
  DB: D1Database
  SESSIONS: KVNamespace
  CART: KVNamespace
  CORS_ORIGIN?: string
  JWT_SECRET?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Configure CORS with environment-based origin
app.use('/api/*', async (c, next) => {
  // Get allowed origin from environment or default to production domain
  const allowedOrigin = c.env?.CORS_ORIGIN || 'https://honestpharmco.com'
  
  // In development, allow localhost
  const origin = c.req.header('Origin')
  const isLocalDev = origin?.includes('localhost') || origin?.includes('127.0.0.1')
  const isDevelopment = c.env?.NODE_ENV === 'development'
  
  const corsOptions = {
    origin: isDevelopment && isLocalDev ? origin : allowedOrigin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['X-Total-Count'],
    credentials: true,
    maxAge: 86400, // 24 hours
  }
  
  const corsMiddleware = cors(corsOptions)
  return corsMiddleware(c, next)
})

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/images/*', serveStatic({ root: './public/static' }))
app.use('/css/*', serveStatic({ root: './public/static' }))
app.use('/js/*', serveStatic({ root: './public/static' }))

// Apply rate limiting to auth endpoints
app.use('/api/auth/*', rateLimiters.auth)

// Apply general API rate limiting
app.use('/api/*', rateLimiters.api)

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

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  
  // Log to Sentry if configured
  if (c.env?.SENTRY_DSN) {
    // TODO: Integrate Sentry error reporting
  }
  
  // Return appropriate error response
  if (c.req.path.startsWith('/api/')) {
    return c.json({ 
      error: 'Internal Server Error',
      message: c.env?.NODE_ENV === 'development' ? err.message : undefined 
    }, 500)
  } else {
    // Return error page for HTML routes
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Honest Pharm Co.</title>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            background: #1a1a1a; 
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .error-container {
            text-align: center;
            padding: 2rem;
          }
          h1 { color: #FFD700; }
          a { color: #FFD700; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Oops! Something went wrong</h1>
          <p>We're sorry, but an error occurred while processing your request.</p>
          <p><a href="/">Return to Homepage</a></p>
        </div>
      </body>
      </html>
    `, 500)
  }
})

// Not found handler
app.notFound((c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({ error: 'Not Found' }, 404)
  }
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found</title>
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          background: #1a1a1a; 
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .error-container {
          text-align: center;
          padding: 2rem;
        }
        h1 { color: #FFD700; font-size: 4rem; margin: 0; }
        a { color: #FFD700; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <p><a href="/">Return to Homepage</a></p>
      </div>
    </body>
    </html>
  `, 404)
})

export default app
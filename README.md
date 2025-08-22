# Honest Pharm Co. - Premium Cannabis E-Commerce Platform

## Project Overview
- **Name**: Honest Pharm Co.
- **Goal**: Premium B2B cannabis e-commerce platform for licensed NY State cultivator
- **Features**: 
  - Premium black/dark theme design with gold accents
  - Hero video background showcasing cultivation
  - Interactive NY State dispensary location map
  - Product catalog with advanced filtering
  - Shopping cart and wholesale ordering
  - User authentication and accounts
  - Admin dashboard for management

## Live URLs
- **Development**: https://3000-ibva3dna3ol2ryw8m9lzj-6532622b.e2b.dev
- **Production**: Not deployed yet
- **GitHub**: Not configured yet

## Currently Completed Features ✅
- **Premium Website Design**:
  - Black/dark theme with gold gradient accents
  - Premium typography (Bebas Neue, Montserrat, Playfair Display)
  - Glass morphism effects and animations
  - Custom scrollbar and hover effects
  
- **Hero Section**:
  - Full-screen video background with cannabis cultivation footage
  - Gradient overlays for text readability
  - Call-to-action buttons with hover animations
  - Scroll indicator animation

- **Interactive Location Map**:
  - Leaflet.js integration with dark theme
  - NY State dispensary locations marked
  - Cultivation facility location
  - Location cards showing distribution by borough

- **Product Showcase**:
  - Premium product cards with hover effects
  - THC content and pricing display
  - Add to cart functionality
  - Badge system (Premium, Top Shelf, Best Seller)

- **Navigation & Footer**:
  - Sticky navigation with glass effect
  - Comprehensive footer with links and social media
  - Cart count indicator
  - Premium button styles

## Functional Entry Points

### Pages
- `/` - Premium home page with video hero, about section, featured products, and location map
- `/catalog` - Product catalog with filters (strain type, THC content, price range) and search
- `/cart` - Shopping cart page
- `/login` - User authentication page

### API Endpoints
- `/api/health` - Health check endpoint
- `/api/products` - Product listing and management
- `/api/cart` - Cart operations
- `/api/auth/*` - Authentication endpoints
- `/api/orders/*` - Order management (authenticated)
- `/api/admin/*` - Admin operations (authenticated)

## Features Not Yet Implemented 🚧
- User registration and authentication flow
- Wholesale pricing tiers
- Order processing and management
- Payment integration
- Admin dashboard UI
- Product image uploads
- Inventory management
- Email notifications
- Lab test results display
- Customer reviews/ratings

## Recommended Next Steps 📋
1. **Deploy to Cloudflare Pages** - Set up production deployment
2. **Configure GitHub Repository** - Version control and CI/CD
3. **Implement Authentication** - Complete user registration/login
4. **Add Product Images** - Upload actual product photos
5. **Set Up Payment Processing** - Integrate payment gateway
6. **Create Admin Dashboard** - Build management interface
7. **Add Email Notifications** - Order confirmations, etc.
8. **Implement Search/Filter Logic** - Connect frontend filters to backend
9. **Add Analytics** - Track user behavior and sales
10. **Mobile App** - Consider native mobile application

## Data Architecture

### Database Schema (D1 SQLite)
- **users** - User accounts and profiles
- **products** - Cannabis product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Individual order line items

### Storage Services
- **D1 Database**: Primary data storage for products, users, orders
- **KV Storage**: Session management and cart data
- **R2 Storage**: Product images and documents (planned)

### Data Flow
1. User browses catalog → Products fetched from D1
2. Add to cart → Stored in KV namespace
3. Checkout → Order created in D1
4. Admin updates → Changes reflected in D1

## User Guide

### For Customers
1. Browse the premium catalog of cannabis products
2. Use filters to find specific strains or THC levels
3. View detailed product information
4. Add products to cart
5. Create account for wholesale pricing
6. Complete checkout process

### For Administrators
1. Login with admin credentials
2. Access admin dashboard at `/admin`
3. Manage products, categories, and inventory
4. View and process orders
5. Manage user accounts
6. Generate reports

## Technology Stack
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: KV (sessions/cart), R2 (images)
- **Frontend**: Vanilla JS with Tailwind CSS
- **Maps**: Leaflet.js
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Bebas Neue, Montserrat)

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Development Active
- **Environment**: Sandbox development server
- **Build Command**: `npm run build`
- **Dev Command**: `pm2 start ecosystem.config.cjs`
- **Last Updated**: January 2024

## Design Highlights
- **Color Scheme**: Black (#000000), Dark Gray (#1a1a1a), Gold (#FFD700)
- **Typography**: Bebas Neue (headings), Montserrat (body)
- **Effects**: Glass morphism, gradient text, hover animations
- **Video**: Cannabis greenhouse cultivation footage in hero
- **Map**: Interactive NY State dispensary locations

## Development Commands
```bash
# Install dependencies
npm install

# Build project
npm run build

# Start development server (with PM2)
pm2 start ecosystem.config.cjs

# View logs
pm2 logs honestpharmco --nostream

# Database migrations
npm run db:migrate:local

# Deploy to production
npm run deploy
```
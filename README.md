# Honest Pharm Co. - Cannabis E-Commerce Platform

## Project Overview
- **Name**: Honest Pharm Co Website
- **Goal**: Professional e-commerce platform for licensed NY State cannabis cultivator
- **Features**: Product catalog, wholesale ordering, user authentication, cart management, admin panel

## URLs
- **Development**: https://3000-ibva3dna3ol2ryw8m9lzj-6532622b.e2b.dev
- **Production**: Will be deployed to Cloudflare Pages
- **GitHub**: https://github.com/dwmaginn/honestpharmco_website

## Currently Completed Features
- ✅ Professional responsive design with Tailwind CSS
- ✅ User authentication system (login/register)
- ✅ Product catalog with filtering and search
- ✅ Shopping cart functionality
- ✅ Order management system
- ✅ Admin panel for user approval and product management
- ✅ Wholesale pricing (visible only after login)
- ✅ Local D1 database integration
- ✅ Image assets from original website

## Functional Entry Points

### Public Pages
- `/` - Homepage with company information and featured products
- `/catalog` - Product catalog with filters (category, strain type, THC content)
- `/cart` - Shopping cart management
- `/login` - User login and registration

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration  
- `GET /api/products` - Get all products (prices hidden for non-authenticated)
- `GET /api/products/:id` - Get single product details
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart/update` - Update cart item quantity
- `POST /api/orders/create` - Create new order (authenticated only)

### Admin Features
- User approval system for new registrations
- Order status management
- Product inventory management

## Data Architecture
- **Database**: Cloudflare D1 (SQLite)
- **Storage Services**: 
  - D1 Database for products, users, orders
  - KV Namespaces for sessions and cart data
- **Data Models**:
  - Users (authentication, company info, approval status)
  - Products (strains, THC/CBD content, pricing)
  - Categories (product organization)
  - Orders (order management)
  - Cart (persistent cart storage)

## Features Not Yet Implemented
- PDF product information sheet viewer
- Email notifications for order updates
- Advanced analytics dashboard
- Inventory tracking
- Batch order processing
- Payment gateway integration

## Recommended Next Steps
1. **Add PDF Viewer**: Implement PDF.js or similar to display product information sheets
2. **Deploy to Production**: Set up Cloudflare Pages deployment with production database
3. **Email Integration**: Add email notifications using Cloudflare Email Workers
4. **Payment Processing**: Integrate payment gateway for online transactions
5. **Enhanced Admin Panel**: Add more detailed analytics and reporting
6. **Mobile App**: Consider React Native app for mobile users
7. **SEO Optimization**: Add meta tags and structured data for better search visibility

## User Guide

### For Customers
1. Visit the website and browse the product catalog
2. Register for an account with your dispensary information
3. Wait for admin approval (you'll be notified)
4. Once approved, login to see wholesale pricing
5. Add products to cart and place orders
6. Track your order status in "My Orders"

### For Administrators
1. Login with admin credentials
2. Review pending user registrations in admin panel
3. Approve legitimate dispensary accounts
4. Manage product inventory and pricing
5. Process and update order statuses

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Hono Framework on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **Authentication**: JWT with bcrypt password hashing

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI

### Setup
```bash
# Install dependencies
npm install

# Run local development with D1 database
npm run dev:sandbox

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

### Database Management
```bash
# Apply migrations locally
npm run db:migrate:local

# Seed test data
npm run db:seed

# Reset database
npm run db:reset
```

## Deployment Status
- **Platform**: Cloudflare Pages
- **Status**: ✅ Development Active
- **Last Updated**: August 22, 2025

## Security Features
- Password hashing with bcrypt
- JWT authentication tokens
- Secure session management
- Admin approval for new accounts
- HTTPS only deployment

## License
Proprietary - Honest Pharm Co. All rights reserved.
-- Insert categories
INSERT OR IGNORE INTO categories (name, slug, description, display_order) VALUES 
  ('Flower', 'flower', 'Premium cannabis flower strains', 1),
  ('Pre-Rolls', 'pre-rolls', 'Ready-to-smoke pre-rolled joints and blunts', 2),
  ('Edibles', 'edibles', 'Cannabis-infused edible products', 3),
  ('Concentrates', 'concentrates', 'High-potency cannabis extracts', 4),
  ('Vapes', 'vapes', 'Vaporizer cartridges and disposables', 5);

-- Insert sample products based on website content
INSERT OR IGNORE INTO products (category_id, sku, name, strain_type, thc_percentage, cbd_percentage, description, effects, flavors, image_url, price, wholesale_price, unit_size, units_per_case, in_stock, featured) VALUES 
  -- Pre-Rolls
  (2, 'PR-13', 'Blueberry Ice Pop Blunt', 'Hybrid', 25.38, 0.0, 'PR-13 featuring Blueberry Ice Pop is a smooth, flavorful cannabis blunt that combines the perfect balance of relaxation and uplifting effects.', 'Relaxation, Uplifting, Euphoria', 'Berry, Sweet, Citrus', '/static/images/logo.png', 15.00, 10.00, '1.5g', 12, true, true),
  
  -- Flower products
  (1, 'FL-001', 'Midnight Cookies', 'Indica', 24.5, 0.2, 'A potent indica strain perfect for evening relaxation', 'Relaxation, Sleep, Pain Relief', 'Cookie, Sweet, Earthy', '/static/images/midnight-cookies.png', 45.00, 35.00, '3.5g', 8, true, true),
  (1, 'FL-002', 'Jam Master Jay', 'Sativa', 22.3, 0.1, 'Energizing sativa strain ideal for daytime use', 'Energy, Focus, Creativity', 'Fruity, Jam, Citrus', '/static/images/jam-master-jays.png', 45.00, 35.00, '3.5g', 8, true, false),
  (1, 'FL-003', 'Seed Weed', 'Hybrid', 21.8, 0.3, 'Balanced hybrid strain with versatile effects', 'Balance, Happiness, Relaxation', 'Herbal, Pine, Earth', '/static/images/seed-weed.png', 40.00, 30.00, '3.5g', 8, true, false),
  
  -- More Pre-Rolls
  (2, 'PR-001', 'Classic OG Pre-Roll', 'Indica', 23.0, 0.0, 'Premium pre-rolled joint with classic OG strain', 'Relaxation, Stress Relief', 'Pine, Lemon, Earth', '/static/images/logo.png', 12.00, 8.00, '1g', 20, true, false),
  (2, 'PR-002', 'Sour Diesel Pre-Roll', 'Sativa', 22.0, 0.0, 'Energizing Sour Diesel in a convenient pre-roll', 'Energy, Euphoria, Creativity', 'Diesel, Citrus, Pungent', '/static/images/logo.png', 12.00, 8.00, '1g', 20, true, false);

-- Insert admin user
INSERT OR IGNORE INTO users (email, password_hash, contact_name, is_admin, is_approved) VALUES 
  ('admin@honestpharmco.com', '$2a$10$YourHashedPasswordHere', 'Admin User', true, true);

-- Insert sample customer
INSERT OR IGNORE INTO users (email, password_hash, company_name, contact_name, phone, address, city, state, zip, license_number, is_approved) VALUES 
  ('demo@dispensary.com', '$2a$10$YourHashedPasswordHere', 'Demo Dispensary', 'John Doe', '555-0123', '123 Main St', 'New York', 'NY', '10001', 'LIC-12345', true);
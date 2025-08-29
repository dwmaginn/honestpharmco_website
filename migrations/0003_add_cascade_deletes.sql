-- Migration to add cascade delete constraints
-- This ensures referential integrity when deleting parent records

-- Drop existing foreign key constraints (SQLite doesn't support ALTER CONSTRAINT)
-- We need to recreate tables with proper constraints

-- Create new orders table with cascade delete
CREATE TABLE orders_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Copy data from old table
INSERT INTO orders_new SELECT * FROM orders;

-- Drop old table and rename new one
DROP TABLE orders;
ALTER TABLE orders_new RENAME TO orders;

-- Create new order_items table with cascade delete
CREATE TABLE order_items_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Copy data from old table
INSERT INTO order_items_new SELECT * FROM order_items;

-- Drop old table and rename new one
DROP TABLE order_items;
ALTER TABLE order_items_new RENAME TO order_items;

-- Create new carts table with cascade delete
CREATE TABLE carts_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_id TEXT,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Copy data from old table
INSERT INTO carts_new SELECT * FROM carts;

-- Drop old table and rename new one
DROP TABLE carts;
ALTER TABLE carts_new RENAME TO carts;

-- Create new products table with cascade delete for category
CREATE TABLE products_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    strain_type TEXT,
    thc_percentage DECIMAL(5,2),
    cbd_percentage DECIMAL(5,2),
    terpenes TEXT,
    description TEXT,
    effects TEXT,
    flavors TEXT,
    image_url TEXT,
    pdf_page INTEGER,
    price DECIMAL(10,2) NOT NULL,
    wholesale_price DECIMAL(10,2),
    unit_size TEXT,
    units_per_case INTEGER,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Copy data from old table
INSERT INTO products_new SELECT * FROM products;

-- Drop old table and rename new one
DROP TABLE products;
ALTER TABLE products_new RENAME TO products;

-- Recreate indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
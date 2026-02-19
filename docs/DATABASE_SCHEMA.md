# Database Schema Design

## Tables and Relationships

### 1. Users Table
Stores all user types (Customer, Delivery Partner, Customer Care)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL CHECK(role IN ('customer', 'delivery_partner', 'customer_care')),
    address TEXT,
    pin_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Restaurants Table
```sql
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15),
    status VARCHAR(20) DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    owner_name VARCHAR(100),
    owner_email VARCHAR(100) UNIQUE NOT NULL,
    owner_password_hash VARCHAR(255) NOT NULL,
    restaurant_fees DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Dishes Table
```sql
CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    photo_path VARCHAR(255),
    availability BOOLEAN DEFAULT 1,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### 4. Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    delivery_partner_id INTEGER,
    total_amount DECIMAL(10, 2) NOT NULL,
    restaurant_fees DECIMAL(10, 2) DEFAULT 0.00,
    platform_fees DECIMAL(10, 2) DEFAULT 0.00,
    delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(20) CHECK(payment_mode IN ('cash', 'card', 'upi', 'wallet')),
    status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
    delivery_address TEXT NOT NULL,
    delivery_pin_code VARCHAR(10) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (delivery_partner_id) REFERENCES users(id)
);
```

### 5. Order Items Table
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    dish_id INTEGER NOT NULL,
    dish_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    photo_path VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id)
);
```

### 6. Delivery Partners Table
```sql
CREATE TABLE delivery_partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    availability BOOLEAN DEFAULT 1,
    current_location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Complaints Table
```sql
CREATE TABLE complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 8. Offers Table
```sql
CREATE TABLE offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK(discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2),
    restaurant_id INTEGER,
    offer_type VARCHAR(20) CHECK(offer_type IN ('restaurant', 'platform')),
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### 9. Platform Fees Table
```sql
CREATE TABLE platform_fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fee_type VARCHAR(50) NOT NULL,
    fee_value DECIMAL(10, 2) NOT NULL,
    is_percentage BOOLEAN DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Admin Table
```sql
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships

### One-to-Many Relationships
- `restaurants` → `dishes` (One restaurant has many dishes)
- `restaurants` → `orders` (One restaurant receives many orders)
- `users` → `orders` (One user places many orders)
- `orders` → `order_items` (One order contains many items)
- `orders` → `complaints` (One order can have many complaints)
- `delivery_partners` → `orders` (One delivery partner handles many orders)

### Many-to-One Relationships
- `dishes` → `restaurants`
- `orders` → `users`
- `orders` → `restaurants`
- `orders` → `delivery_partners`
- `order_items` → `orders`
- `order_items` → `dishes`
- `complaints` → `orders`
- `complaints` → `users`
- `offers` → `restaurants` (for restaurant-specific offers)

## Indexes for Performance
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_restaurants_pin_code ON restaurants(pin_code);
CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_delivery_partners_pin_code ON delivery_partners(pin_code);
CREATE INDEX idx_delivery_partners_availability ON delivery_partners(availability);
CREATE INDEX idx_complaints_order_id ON complaints(order_id);
CREATE INDEX idx_offers_code ON offers(code);
```

## Key Design Decisions

1. **Unified Users Table**: Customers, delivery partners, and customer care share base user attributes
2. **Separate Delivery Partners Table**: Additional fields specific to delivery operations
3. **Order Items Denormalization**: Store dish name and photo path to preserve order history even if dish is deleted
4. **Flexible Fees Structure**: Both restaurant-level and platform-level fees supported
5. **Offer System**: Supports both restaurant-specific and platform-wide offers
6. **Status Tracking**: Comprehensive status fields for orders, complaints, and availability
7. **Soft Delete Ready**: Status fields allow for soft deletion patterns
8. **Audit Trail**: Created_at and updated_at timestamps on key tables

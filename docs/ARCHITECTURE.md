# System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Customer │  │Restaurant│  │ Delivery │  │  Admin   │        │
│  │    UI    │  │ Owner UI │  │Partner UI│  │    UI    │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │              │             │               │
│       └─────────────┴──────────────┴─────────────┘               │
│                          │                                        │
│                   React Frontend                                 │
│                   (TailwindCSS + shadcn/ui)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    FastAPI/Flask Server                          │
│                   (Python Backend Framework)                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Authentication Middleware                  │     │
│  │                  (JWT Token Validation)                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Admin   │  │Restaurant│  │ Customer │  │ Delivery │        │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │              │             │               │
│  ┌────┴─────────────┴──────────────┴─────────────┴────┐         │
│  │           Order Management Service                  │         │
│  │    (Order Lifecycle, Assignment, Tracking)          │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐         │
│  │         Pricing & Offer Service                     │         │
│  │  (Fee Calculation, Offer Validation, Discounts)     │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐         │
│  │         Complaint Management Service                │         │
│  │     (Complaint Tracking, Resolution Workflow)       │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐         │
│  │              Database Models (ORM)                  │         │
│  │  User, Restaurant, Dish, Order, Complaint, etc.     │         │
│  └────────────────────────┬────────────────────────────┘         │
│                           │                                       │
│  ┌────────────────────────┴────────────────────────────┐         │
│  │            SQLite Database Connection                │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      PERSISTENCE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    SQLite Database File                          │
│                     (food_delivery.db)                           │
│                                                                   │
│  Tables: users, restaurants, dishes, orders, order_items,       │
│          delivery_partners, complaints, offers, platform_fees    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Descriptions

### 1. Client Layer (Frontend)
**Technology**: React + TailwindCSS + shadcn/ui

**Components**:
- **Customer UI**: Browse restaurants, view menus, cart management, checkout, order tracking, complaints
- **Restaurant Owner UI**: Dish management, order management, pricing configuration
- **Delivery Partner UI**: View assigned orders, update delivery status, availability toggle
- **Admin UI**: Restaurant onboarding, platform fee configuration, offer management
- **Customer Care UI**: View and resolve complaints

### 2. API Gateway Layer
**Technology**: FastAPI (recommended) or Flask

**Responsibilities**:
- Route HTTP requests to appropriate services
- JWT-based authentication and authorization
- Request validation
- Error handling and response formatting
- CORS configuration
- Rate limiting (optional)

### 3. Business Logic Layer

#### Services:

**Admin Service**
- Restaurant CRUD operations
- Platform fee management
- Platform-wide offer creation
- System configuration

**Restaurant Service**
- Dish CRUD operations
- Restaurant status management (enable/disable ordering)
- Restaurant-specific offer creation
- Order viewing and management

**Customer Service**
- Restaurant browsing and filtering
- Menu viewing
- Cart management (session-based or DB-based)
- Order placement
- Order history and tracking
- Complaint submission

**Delivery Service**
- Availability management
- View assigned deliveries
- Update delivery status
- Location tracking (optional)

**Order Management Service**
- Order lifecycle management (pending → confirmed → preparing → ready → picked_up → delivered)
- Automatic delivery partner assignment based on pin code and availability
- Order validation
- Payment simulation

**Pricing & Offer Service**
- Calculate restaurant fees
- Calculate platform fees
- Apply and validate offer codes
- Calculate final order amount
- Handle discount logic

**Complaint Management Service**
- Complaint creation and tracking
- Status updates (open → in_progress → resolved → closed)
- Resolution notes management

### 4. Data Access Layer
**Technology**: SQLAlchemy (ORM) or raw SQL queries

**Responsibilities**:
- Database connection management
- CRUD operations on all tables
- Query optimization
- Transaction management
- Data validation

### 5. Persistence Layer
**Technology**: SQLite

**Database**: `food_delivery.db`

**Tables**: 10 tables as defined in DATABASE_SCHEMA.md

## Data Flow Examples

### Example 1: Customer Places Order

```
1. Customer adds items to cart (Frontend)
   ↓
2. POST /customer/cart (API Gateway)
   ↓
3. Customer Service validates items and stores in session/DB
   ↓
4. Customer proceeds to checkout (Frontend)
   ↓
5. POST /customer/orders (API Gateway)
   ↓
6. Order Management Service:
   - Validates order items
   - Calls Pricing Service to calculate fees
   - Creates order record
   - Assigns nearest available delivery partner
   - Updates order status to 'confirmed'
   ↓
7. Response with order_id and final_amount
   ↓
8. Frontend shows order confirmation and tracking
```

### Example 2: Restaurant Owner Updates Dish

```
1. Restaurant owner edits dish details (Frontend)
   ↓
2. PUT /restaurant/dishes/{id} (API Gateway)
   ↓
3. Authentication Middleware validates JWT token
   ↓
4. Restaurant Service:
   - Validates ownership
   - Updates dish in database
   ↓
5. Response with updated dish details
   ↓
6. Frontend updates UI
```

### Example 3: Delivery Partner Assignment

```
1. Order created with status 'confirmed'
   ↓
2. Order Management Service:
   - Queries delivery_partners table
   - Filters by pin_code matching order delivery location
   - Filters by availability = true
   - Selects nearest/first available partner
   - Updates order.delivery_partner_id
   - Sends notification (simulated)
   ↓
3. Delivery partner sees new order in dashboard
```

## Security Considerations

1. **Authentication**: JWT tokens for all authenticated endpoints
2. **Authorization**: Role-based access control (RBAC)
3. **Password Storage**: Bcrypt hashing for all passwords
4. **Input Validation**: Validate all user inputs on backend
5. **SQL Injection Prevention**: Use parameterized queries or ORM
6. **CORS**: Configure appropriate CORS policies

## Scalability Considerations (Future)

1. **Database**: Migrate from SQLite to PostgreSQL/MySQL for production
2. **Caching**: Add Redis for session management and frequently accessed data
3. **Message Queue**: Add RabbitMQ/Celery for async tasks (notifications, emails)
4. **Microservices**: Split services into independent microservices
5. **Load Balancing**: Add load balancer for multiple API instances
6. **CDN**: Use CDN for static assets (dish images)

## Technology Choices Justification

### Backend: FastAPI
- **Pros**: Fast, modern, automatic API documentation, async support, type hints
- **Alternative**: Flask (simpler, more lightweight)

### Database: SQLite
- **Pros**: Zero configuration, file-based, perfect for hackathon/demo
- **Cons**: Not suitable for production with concurrent writes

### Frontend: React + TailwindCSS + shadcn/ui
- **Pros**: Component-based, fast development, modern UI, reusable components
- **TailwindCSS**: Utility-first CSS, rapid styling
- **shadcn/ui**: Pre-built accessible components

### ORM: SQLAlchemy
- **Pros**: Pythonic, prevents SQL injection, easy migrations
- **Alternative**: Raw SQL (faster for simple queries)

## File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── database.py             # Database connection
│   ├── auth.py                 # JWT authentication
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── restaurant.py
│   │   ├── dish.py
│   │   ├── order.py
│   │   └── ...
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── restaurant.py
│   │   ├── customer.py
│   │   ├── delivery.py
│   │   └── support.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── order_service.py
│   │   ├── pricing_service.py
│   │   └── complaint_service.py
│   └── schemas/
│       ├── __init__.py
│       └── ...                 # Pydantic models
├── requirements.txt
└── run.py

frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── RestaurantCard.jsx
│   │   ├── DishCard.jsx
│   │   ├── Cart.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── CustomerDashboard.jsx
│   │   ├── RestaurantDashboard.jsx
│   │   ├── DeliveryDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   ├── services/
│   │   └── api.js              # API client
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

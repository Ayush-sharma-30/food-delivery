# Food Delivery Platform - Backend

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Seed Database with Sample Data
```bash
python seed_data.py
```

### 4. Run the Server
```bash
python run.py
```

The API will be available at: http://localhost:8000

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Test Credentials

### Admin
- Email: `admin@fooddelivery.com`
- Password: `admin123`

### Restaurant Owners
- Pizza Palace: `pizza@restaurant.com` / `pizza123`
- Burger Hub: `burger@restaurant.com` / `burger123`
- Sushi Station: `sushi@restaurant.com` / `sushi123`
- Curry Corner: `curry@restaurant.com` / `curry123`

### Customers
- Alice: `alice@customer.com` / `customer123`
- Bob: `bob@customer.com` / `customer123`

### Delivery Partners
- Rahul: `rahul@delivery.com` / `delivery123`
- Amit: `amit@delivery.com` / `delivery123`
- Priya: `priya@delivery.com` / `delivery123`
- Vijay: `vijay@delivery.com` / `delivery123`

### Customer Care
- Support: `support@fooddelivery.com` / `support123`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register customer/customer care
- `POST /api/v1/auth/register/delivery-partner` - Register delivery partner
- `POST /api/v1/auth/login` - Login (all roles)

### Admin
- `POST /api/v1/admin/restaurants` - Add restaurant
- `GET /api/v1/admin/restaurants` - List restaurants
- `PUT /api/v1/admin/restaurants/{id}` - Update restaurant
- `POST /api/v1/admin/platform-fees` - Create platform fee
- `GET /api/v1/admin/platform-fees` - List platform fees
- `POST /api/v1/admin/offers` - Create platform offer
- `GET /api/v1/admin/offers` - List platform offers

### Restaurant Owner
- `POST /api/v1/restaurant/dishes` - Add dish
- `GET /api/v1/restaurant/dishes` - List dishes
- `PUT /api/v1/restaurant/dishes/{id}` - Update dish
- `DELETE /api/v1/restaurant/dishes/{id}` - Delete dish
- `PUT /api/v1/restaurant/status` - Update restaurant status
- `GET /api/v1/restaurant/orders` - View orders
- `POST /api/v1/restaurant/offers` - Create restaurant offer

### Customer
- `GET /api/v1/customer/restaurants` - Browse restaurants
- `GET /api/v1/customer/restaurants/{id}/menu` - View menu
- `POST /api/v1/customer/cart` - Add to cart
- `GET /api/v1/customer/cart` - View cart
- `DELETE /api/v1/customer/cart/{dish_id}` - Remove from cart
- `POST /api/v1/customer/offers/validate` - Validate offer
- `POST /api/v1/customer/orders` - Place order
- `GET /api/v1/customer/orders` - Order history
- `GET /api/v1/customer/orders/{id}` - Track order
- `POST /api/v1/customer/complaints` - Raise complaint
- `GET /api/v1/customer/complaints` - View complaints

### Delivery Partner
- `PUT /api/v1/delivery/availability` - Toggle availability
- `GET /api/v1/delivery/orders` - View assigned orders
- `PUT /api/v1/delivery/orders/{id}/status` - Update delivery status

### Customer Care
- `GET /api/v1/support/complaints` - View all complaints
- `PUT /api/v1/support/complaints/{id}` - Update complaint
- `GET /api/v1/support/orders/{id}` - View order details

## Database

SQLite database file: `food_delivery.db`

### Tables
1. users
2. restaurants
3. dishes
4. orders
5. order_items
6. delivery_partners
7. complaints
8. offers
9. platform_fees
10. admins

## Features Implemented

✅ Multi-role authentication (JWT)
✅ Restaurant management
✅ Menu/dish management
✅ Cart functionality (in-memory)
✅ Order placement with pricing calculation
✅ Automatic delivery partner assignment
✅ Order tracking
✅ Complaint management
✅ Offer/discount system
✅ Platform and restaurant fees

## Testing the API

### Example: Customer Order Flow

1. **Register/Login as Customer**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@customer.com", "password": "customer123", "role": "customer"}'
```

2. **Browse Restaurants**
```bash
curl -X GET http://localhost:8000/api/v1/customer/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **View Menu**
```bash
curl -X GET http://localhost:8000/api/v1/customer/restaurants/1/menu \
  -H "Authorization: Bearer YOUR_TOKEN"
```

4. **Add to Cart**
```bash
curl -X POST http://localhost:8000/api/v1/customer/cart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dish_id": 1, "quantity": 2}'
```

5. **Place Order**
```bash
curl -X POST http://localhost:8000/api/v1/customer/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": 1,
    "items": [{"dish_id": 1, "quantity": 2}],
    "delivery_address": "123 Test Street",
    "delivery_pin_code": "110001",
    "payment_mode": "cash"
  }'
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── database.py          # Database connection
│   ├── auth.py              # Authentication utilities
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── restaurant.py
│   │   ├── dish.py
│   │   ├── order.py
│   │   ├── delivery_partner.py
│   │   ├── complaint.py
│   │   ├── offer.py
│   │   ├── platform_fee.py
│   │   └── admin.py
│   └── routes/              # API endpoints
│       ├── auth.py
│       ├── admin.py
│       ├── restaurant_routes.py
│       ├── customer.py
│       ├── delivery.py
│       └── support.py
├── requirements.txt
├── run.py
├── seed_data.py
└── README.md
```

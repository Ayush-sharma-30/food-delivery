# API Endpoints Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication Endpoints

### POST /auth/register
Register a new user (customer/delivery partner/customer care)
```json
Request:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "customer|delivery_partner|customer_care",
  "address": "string",
  "pin_code": "string"
}

Response: 201 Created
{
  "id": "integer",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

### POST /auth/login
Login for all user types
```json
Request:
{
  "email": "string",
  "password": "string",
  "role": "customer|restaurant|delivery_partner|admin|customer_care"
}

Response: 200 OK
{
  "token": "string",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

---

## Admin Role Endpoints

### POST /admin/restaurants
Add a new restaurant
```json
Request:
{
  "name": "string",
  "pin_code": "string",
  "address": "string",
  "phone": "string",
  "owner_name": "string",
  "owner_email": "string",
  "owner_password": "string",
  "restaurant_fees": "decimal"
}

Response: 201 Created
{
  "id": "integer",
  "name": "string",
  "status": "active"
}
```

### GET /admin/restaurants
Get all restaurants
```json
Response: 200 OK
{
  "restaurants": [
    {
      "id": "integer",
      "name": "string",
      "pin_code": "string",
      "status": "string",
      "restaurant_fees": "decimal"
    }
  ]
}
```

### PUT /admin/restaurants/{id}
Update restaurant details
```json
Request:
{
  "status": "active|inactive",
  "restaurant_fees": "decimal"
}

Response: 200 OK
```

### POST /admin/platform-fees
Configure platform-level fees
```json
Request:
{
  "fee_type": "string",
  "fee_value": "decimal",
  "is_percentage": "boolean",
  "description": "string"
}

Response: 201 Created
```

### GET /admin/platform-fees
Get all platform fees
```json
Response: 200 OK
{
  "fees": [
    {
      "id": "integer",
      "fee_type": "string",
      "fee_value": "decimal",
      "is_percentage": "boolean"
    }
  ]
}
```

### POST /admin/offers
Create platform-level offers
```json
Request:
{
  "code": "string",
  "description": "string",
  "discount_type": "percentage|fixed",
  "discount_value": "decimal",
  "min_order_value": "decimal",
  "max_discount": "decimal",
  "valid_from": "timestamp",
  "valid_until": "timestamp"
}

Response: 201 Created
```

### GET /admin/offers
Get all platform offers
```json
Response: 200 OK
{
  "offers": [...]
}
```

---

## Restaurant Owner Role Endpoints

### POST /restaurant/dishes
Add a new dish
```json
Request:
{
  "name": "string",
  "description": "string",
  "price": "decimal",
  "photo_path": "string",
  "category": "string",
  "availability": "boolean"
}

Response: 201 Created
{
  "id": "integer",
  "name": "string",
  "price": "decimal"
}
```

### GET /restaurant/dishes
Get all dishes for the restaurant
```json
Response: 200 OK
{
  "dishes": [
    {
      "id": "integer",
      "name": "string",
      "price": "decimal",
      "availability": "boolean",
      "photo_path": "string"
    }
  ]
}
```

### PUT /restaurant/dishes/{id}
Update dish details
```json
Request:
{
  "name": "string",
  "description": "string",
  "price": "decimal",
  "photo_path": "string",
  "availability": "boolean"
}

Response: 200 OK
```

### DELETE /restaurant/dishes/{id}
Remove a dish
```json
Response: 204 No Content
```

### PUT /restaurant/status
Enable/disable restaurant ordering
```json
Request:
{
  "status": "active|inactive"
}

Response: 200 OK
```

### POST /restaurant/offers
Create restaurant-specific offers
```json
Request:
{
  "code": "string",
  "description": "string",
  "discount_type": "percentage|fixed",
  "discount_value": "decimal",
  "min_order_value": "decimal",
  "valid_until": "timestamp"
}

Response: 201 Created
```

### GET /restaurant/orders
Get orders for the restaurant
```json
Query Params: ?status=pending|confirmed|preparing|ready

Response: 200 OK
{
  "orders": [
    {
      "id": "integer",
      "user_name": "string",
      "items": [...],
      "total_amount": "decimal",
      "status": "string",
      "order_date": "timestamp"
    }
  ]
}
```

---

## Customer Role Endpoints

### GET /customer/restaurants
Browse restaurants
```json
Query Params: ?pin_code=string

Response: 200 OK
{
  "restaurants": [
    {
      "id": "integer",
      "name": "string",
      "address": "string",
      "status": "string"
    }
  ]
}
```

### GET /customer/restaurants/{id}/menu
Get restaurant menu with images
```json
Response: 200 OK
{
  "restaurant": {
    "id": "integer",
    "name": "string"
  },
  "dishes": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "decimal",
      "photo_path": "string",
      "availability": "boolean",
      "category": "string"
    }
  ]
}
```

### POST /customer/cart
Add/update cart items
```json
Request:
{
  "dish_id": "integer",
  "quantity": "integer"
}

Response: 200 OK
```

### GET /customer/cart
Get current cart
```json
Response: 200 OK
{
  "items": [
    {
      "dish_id": "integer",
      "dish_name": "string",
      "quantity": "integer",
      "price": "decimal",
      "photo_path": "string"
    }
  ],
  "subtotal": "decimal"
}
```

### DELETE /customer/cart/{dish_id}
Remove item from cart
```json
Response: 204 No Content
```

### POST /customer/offers/validate
Apply and validate offer code
```json
Request:
{
  "offer_code": "string",
  "order_amount": "decimal",
  "restaurant_id": "integer"
}

Response: 200 OK
{
  "valid": "boolean",
  "discount_amount": "decimal",
  "final_amount": "decimal"
}
```

### POST /customer/orders
Place an order
```json
Request:
{
  "restaurant_id": "integer",
  "items": [
    {
      "dish_id": "integer",
      "quantity": "integer"
    }
  ],
  "delivery_address": "string",
  "delivery_pin_code": "string",
  "payment_mode": "cash|card|upi|wallet",
  "offer_code": "string"
}

Response: 201 Created
{
  "order_id": "integer",
  "final_amount": "decimal",
  "status": "pending",
  "estimated_delivery": "timestamp"
}
```

### GET /customer/orders
Get order history
```json
Response: 200 OK
{
  "orders": [
    {
      "id": "integer",
      "restaurant_name": "string",
      "items": [...],
      "final_amount": "decimal",
      "status": "string",
      "order_date": "timestamp"
    }
  ]
}
```

### GET /customer/orders/{id}
Get order details and tracking
```json
Response: 200 OK
{
  "id": "integer",
  "restaurant": {...},
  "items": [...],
  "status": "string",
  "delivery_partner": {...},
  "final_amount": "decimal",
  "order_date": "timestamp"
}
```

### POST /customer/complaints
Raise a complaint
```json
Request:
{
  "order_id": "integer",
  "description": "string"
}

Response: 201 Created
{
  "complaint_id": "integer",
  "status": "open"
}
```

### GET /customer/complaints
View complaint history
```json
Response: 200 OK
{
  "complaints": [
    {
      "id": "integer",
      "order_id": "integer",
      "description": "string",
      "status": "string",
      "resolution_notes": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

## Delivery Partner Role Endpoints

### PUT /delivery/availability
Toggle availability (start/stop accepting orders)
```json
Request:
{
  "availability": "boolean"
}

Response: 200 OK
```

### GET /delivery/orders
View assigned deliveries
```json
Query Params: ?status=ready|picked_up

Response: 200 OK
{
  "orders": [
    {
      "id": "integer",
      "restaurant": {...},
      "customer": {...},
      "delivery_address": "string",
      "status": "string",
      "items": [...]
    }
  ]
}
```

### PUT /delivery/orders/{id}/status
Update delivery status
```json
Request:
{
  "status": "picked_up|delivered"
}

Response: 200 OK
```

---

## Customer Care Role Endpoints

### GET /support/complaints
View all complaints
```json
Query Params: ?status=open|in_progress|resolved

Response: 200 OK
{
  "complaints": [
    {
      "id": "integer",
      "order_id": "integer",
      "user_name": "string",
      "description": "string",
      "status": "string",
      "created_at": "timestamp"
    }
  ]
}
```

### PUT /support/complaints/{id}
Update complaint status and add resolution notes
```json
Request:
{
  "status": "in_progress|resolved|closed",
  "resolution_notes": "string"
}

Response: 200 OK
```

### GET /support/orders/{id}
View order details for support
```json
Response: 200 OK
{
  "order": {...},
  "customer": {...},
  "restaurant": {...},
  "delivery_partner": {...}
}
```

---

## Common Response Codes

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:
```
Authorization: Bearer <token>
```

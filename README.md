# Food Delivery Platform

A full-stack, multi-role food delivery platform with 5 portals — Customer, Restaurant, Delivery Partner, Admin, and Customer Support.

**Tech Stack:** FastAPI + SQLAlchemy + SQLite (backend) | React 19 + TailwindCSS + Vite (frontend)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Run Locally)](#quick-start-run-locally)
3. [Demo Login Credentials](#demo-login-credentials)
4. [Application Flows](#application-flows)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Architecture Overview](#architecture-overview)

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Python** | 3.9+ | `python3 --version` |
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |

---

## Quick Start (Run Locally)

### Step 1 — Clone / Unzip the project

```bash
cd food-delivery-platform   # or wherever you unzipped
```

### Step 2 — Start the Backend

```bash
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Seed the database with demo data (restaurants, dishes, users, offers)
python seed_data.py

# Start the backend server
python run.py
```

The backend will be running at **http://localhost:8000**.
Swagger API docs are at **http://localhost:8000/docs**.

### Step 3 — Start the Frontend

Open a **new terminal** window:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be running at **http://localhost:5173** (or 5174 if 5173 is occupied).

### Step 4 — Open the App

Open your browser and go to **http://localhost:5173**. You'll see the login page.

> **That's it!** The app is ready to use with pre-seeded demo data.

---

## Demo Login Credentials

### Customer
| Email | Password |
|-------|----------|
| `alice@customer.com` | `customer123` |
| `bob@customer.com` | `customer123` |

### Restaurant Owner
| Restaurant | Email | Password |
|------------|-------|----------|
| Pizza Palace | `pizza@restaurant.com` | `pizza123` |
| Burger Hub | `burger@restaurant.com` | `burger123` |
| Sushi Station | `sushi@restaurant.com` | `sushi123` |
| Curry Corner | `curry@restaurant.com` | `curry123` |

### Delivery Partner
| Name | Email | Password | PIN Code |
|------|-------|----------|----------|
| Rahul Kumar | `rahul@delivery.com` | `delivery123` | 110001 |
| Amit Singh | `amit@delivery.com` | `delivery123` | 110001 |
| Priya Patel | `priya@delivery.com` | `delivery123` | 110002 |
| Vijay Sharma | `vijay@delivery.com` | `delivery123` | 110002 |

### Admin
| Email | Password |
|-------|----------|
| `admin@fooddelivery.com` | `admin123` |

### Customer Support
| Email | Password |
|-------|----------|
| `support@fooddelivery.com` | `support123` |

---

## Application Flows

### Flow 1: Complete Order Lifecycle (End-to-End)

This is the main flow across all 5 roles:

```
Customer places order
       │
       ▼
 ┌─────────────┐    Order status: "pending" or "confirmed"
 │  CUSTOMER    │    (confirmed if a delivery partner is
 │  Portal      │     available in that PIN code)
 └──────┬──────┘
        │
        ▼
 ┌─────────────┐    Restaurant sees the order
 │ RESTAURANT   │    pending  ──▶  Accept Order  ──▶  confirmed
 │  Portal      │    confirmed ──▶ Start Preparing ──▶ preparing
 │              │    preparing ──▶ Mark Ready ──▶ ready
 └──────┬──────┘
        │
        ▼
 ┌─────────────┐    Delivery partner sees "ready" orders
 │  DELIVERY    │    ready ──▶ Mark Picked Up ──▶ picked_up
 │  Portal      │    picked_up ──▶ Mark Delivered ──▶ delivered
 └──────┬──────┘
        │
        ▼
 ┌─────────────┐
 │  CUSTOMER    │    Customer can track order status in real time
 │  sees order  │    and raise a complaint if needed
 │  delivered   │
 └─────────────┘
```

### Flow 2: Customer Portal

1. **Login** → Select "Customer" role → Enter email/password
2. **Enter PIN Code** → See restaurants available in that area
3. **Browse Menu** → Click a restaurant → See dishes grouped by category
4. **Add to Cart** → Use `+` / `-` buttons to set quantity → Click "Add to Cart"
5. **View Cart** → Adjust quantities, remove items, apply offer codes
6. **Place Order** → Enter delivery address, PIN code, payment mode → Submit
7. **Track Order** → See real-time status updates (confirmed → preparing → ready → picked up → delivered)
8. **Order History** → View all past orders with details
9. **Raise Complaint** → Submit a complaint for any order

### Flow 3: Restaurant Portal

1. **Login** → Select "Restaurant" role → Enter owner email/password
2. **Orders Tab** (default view):
   - See all incoming orders with filter tabs (All / New / Confirmed / Preparing / Ready / Delivered)
   - **New (pending) orders** → Click "Accept Order" or Cancel
   - **Confirmed orders** → Click "Start Preparing"
   - **Preparing orders** → Click "Mark Ready for Pickup"
   - Once marked "ready", the delivery partner takes over
3. **Menu Tab**:
   - View all dishes with prices, categories, availability
   - Add new dishes (name, description, price, category)
   - Delete dishes

### Flow 4: Delivery Partner Portal

1. **Login** → Select "Delivery Partner" role → Enter email/password
2. **Toggle Online/Offline** → Control your availability for order assignments
3. **View Assigned Orders** with filter tabs (Active / Ready / Picked Up / Delivered)
4. **Ready orders** → Click "Mark Picked Up" (go to restaurant, pick up food)
5. **Picked up orders** → Click "Mark Delivered" (deliver to customer)
6. Each order card shows restaurant address, delivery address, and item details

### Flow 5: Admin Portal

1. **Login** → Select "Admin" role → Enter email/password
2. **Restaurants Tab**:
   - View all restaurants with status, owner info, fees
   - Add new restaurants (name, address, PIN, owner details, fees %)
   - Activate / Deactivate restaurants
3. **Offers Tab**:
   - View all platform-wide offers
   - Create new offers (code, discount type, value, min order)
4. **Platform Fees Tab**:
   - View configured platform fees (percentage or flat)

### Flow 6: Customer Support Portal

1. **Login** → Select "Customer Support" role → Enter email/password
2. **View Complaints** with filter tabs (All / Open / In Progress / Resolved)
3. **Expand a complaint** → See order details, customer info
4. **Update status** → Mark as "in_progress" or "resolved" with resolution notes

### Flow 7: Registration (New Users)

From the login page, click **"Create Account"**:

- **Customer** → Name, email, password, phone, PIN code, address
- **Delivery Partner** → Name, email, password, phone, PIN code, vehicle type
- **Customer Support** → Name, email, password, phone

> **Note:** Restaurant accounts are created by the Admin from the Admin Dashboard. Restaurant owners cannot self-register.

---

## Project Structure

```
food-delivery-platform/
├── README.md                  ← You are here
│
├── backend/
│   ├── run.py                 ← Entry point: starts the FastAPI server
│   ├── seed_data.py           ← Seeds database with demo data
│   ├── requirements.txt       ← Python dependencies
│   ├── food_delivery.db       ← SQLite database (auto-created)
│   └── app/
│       ├── main.py            ← FastAPI app, CORS config, route mounting
│       ├── database.py        ← SQLAlchemy engine & session
│       ├── auth.py            ← JWT token creation, password hashing, role guards
│       ├── models/            ← SQLAlchemy ORM models
│       │   ├── user.py        ← Customer & CustomerCare users
│       │   ├── restaurant.py  ← Restaurant model
│       │   ├── dish.py        ← Dish/menu item model
│       │   ├── order.py       ← Order & OrderItem models
│       │   ├── delivery_partner.py
│       │   ├── admin.py
│       │   ├── complaint.py
│       │   ├── offer.py
│       │   └── platform_fee.py
│       └── routes/            ← API route handlers
│           ├── auth.py        ← Login, Register (customer, delivery, care)
│           ├── customer.py    ← Restaurants, menu, cart, orders, complaints
│           ├── restaurant_routes.py ← Dishes CRUD, order status, offers
│           ├── delivery.py    ← Availability, assigned orders, status updates
│           ├── admin.py       ← Restaurant mgmt, offers, platform fees
│           └── support.py     ← Complaint management
│
├── frontend/
│   ├── package.json           ← Node dependencies
│   ├── vite.config.js         ← Vite dev server config
│   ├── tailwind.config.js     ← TailwindCSS config
│   └── src/
│       ├── main.jsx           ← React entry point
│       ├── App.jsx            ← Router & protected routes
│       ├── context/
│       │   └── AuthContext.jsx ← Auth state, login/register/logout
│       ├── utils/
│       │   └── api.js         ← Axios API client (all endpoints)
│       └── components/
│           ├── Login.jsx      ← Multi-role login page
│           ├── Register.jsx   ← Multi-role registration page
│           ├── customer/
│           │   ├── Restaurants.jsx  ← Restaurant listing by PIN
│           │   ├── Menu.jsx         ← Restaurant menu with cart controls
│           │   ├── Cart.jsx         ← Cart, offers, checkout
│           │   └── Orders.jsx       ← Order history & tracking
│           ├── restaurant/
│           │   └── Dashboard.jsx    ← Orders + Menu management
│           ├── delivery/
│           │   └── Orders.jsx       ← Delivery order management
│           ├── admin/
│           │   └── Dashboard.jsx    ← Restaurants, offers, fees
│           └── support/
│               └── Complaints.jsx   ← Complaint management
│
└── docs/
    └── API_ENDPOINTS.md       ← Detailed API endpoint reference
```

---

## API Documentation

The backend auto-generates interactive API docs:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/login` | All | Login with email, password, role |
| `POST` | `/api/v1/auth/register` | Public | Register customer or customer_care |
| `POST` | `/api/v1/auth/register/delivery-partner` | Public | Register delivery partner |
| `GET` | `/api/v1/customer/restaurants?pin_code=` | Customer | List restaurants by area |
| `GET` | `/api/v1/customer/restaurants/{id}/menu` | Customer | Get restaurant menu |
| `POST` | `/api/v1/customer/cart` | Customer | Add item to cart |
| `GET` | `/api/v1/customer/cart` | Customer | View cart |
| `POST` | `/api/v1/customer/orders` | Customer | Place order |
| `GET` | `/api/v1/customer/orders` | Customer | Order history |
| `GET` | `/api/v1/customer/orders/{id}` | Customer | Track specific order |
| `POST` | `/api/v1/customer/complaints` | Customer | Raise complaint |
| `GET` | `/api/v1/restaurant/orders` | Restaurant | View incoming orders |
| `PUT` | `/api/v1/restaurant/orders/{id}/status` | Restaurant | Update order status |
| `POST` | `/api/v1/restaurant/dishes` | Restaurant | Add dish |
| `GET` | `/api/v1/delivery/orders` | Delivery | View assigned orders |
| `PUT` | `/api/v1/delivery/orders/{id}/status` | Delivery | Update delivery status |
| `PUT` | `/api/v1/delivery/availability` | Delivery | Toggle online/offline |
| `GET` | `/api/v1/admin/restaurants` | Admin | List all restaurants |
| `POST` | `/api/v1/admin/restaurants` | Admin | Add restaurant |
| `POST` | `/api/v1/admin/offers` | Admin | Create platform offer |
| `GET` | `/api/v1/support/complaints` | Support | View all complaints |
| `PUT` | `/api/v1/support/complaints/{id}` | Support | Update complaint status |

---

## Architecture Overview

```
┌────────────────┐         ┌──────────────────┐
│                │  HTTP    │                  │
│   React SPA    │────────▶│   FastAPI Server  │
│   (Port 5173)  │◀────────│   (Port 8000)    │
│                │  JSON    │                  │
│  - Vite        │         │  - SQLAlchemy ORM │
│  - TailwindCSS │         │  - JWT Auth       │
│  - React Router│         │  - SQLite DB      │
│  - Axios       │         │  - Pydantic       │
└────────────────┘         └──────────────────┘
```

**Authentication:** JWT tokens stored in `localStorage`. Every API call includes `Authorization: Bearer <token>` header.

**Role-Based Access:** Backend enforces role checks via `require_role()` dependency. Frontend uses `<ProtectedRoute>` wrapper.

**Order State Machine:**
```
pending → confirmed → preparing → ready → picked_up → delivered
   │          │           │
   └──────────┴───────────┴──→ cancelled
```

- `pending` → `confirmed`: automatic (if delivery partner available) or manual (restaurant accepts)
- `confirmed` → `preparing`: restaurant starts cooking
- `preparing` → `ready`: restaurant marks food ready
- `ready` → `picked_up`: delivery partner picks up
- `picked_up` → `delivered`: delivery partner delivers
- `pending/confirmed/preparing` → `cancelled`: restaurant cancels

---

## Resetting the Database

To start fresh with clean demo data:

```bash
cd backend
rm food_delivery.db
python seed_data.py
```

---

## Building for Production

```bash
# Frontend
cd frontend
npm run build          # Creates dist/ folder

# Backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError` | Activate venv: `source venv/bin/activate` |
| Port 8000 in use | Kill existing: `lsof -ti:8000 \| xargs kill` |
| Port 5173 in use | Vite auto-picks next port (5174, etc.) |
| CORS errors | Ensure backend is running on port 8000 |
| Login fails | Check role dropdown matches the account type |
| Empty restaurant list | Enter PIN code `110001` or `110002` (seeded areas) |
| No delivery orders | Orders only appear for delivery partners in matching PIN code |

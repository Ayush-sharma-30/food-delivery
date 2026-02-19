# Sprint Plan and Task Allocation

## Timeline: 9 Hours (9:00 AM - 6:00 PM)

---

## SPRINT 1: SYSTEM DESIGN (1 hour) ✅ COMPLETED
**Time**: 9:00 AM - 10:00 AM

### Deliverables (ALL COMPLETED):
- ✅ High-level system architecture diagram
- ✅ Database schema design with relationships
- ✅ API endpoint list grouped by roles
- ✅ UI screens planning
- ✅ Sprint-wise task allocation

### Files Created:
- ✅ `docs/ARCHITECTURE.md` - System architecture and component design
- ✅ `docs/DATABASE_SCHEMA.md` - Complete database schema with 10 tables
- ✅ `docs/API_ENDPOINTS.md` - All REST API endpoints by role
- ✅ `docs/UI_SCREENS.md` - 28 UI screens with specifications
- ✅ `docs/SPRINT_PLAN.md` - This file

---

## SPRINT 2: BACKEND DEVELOPMENT (4 hours)
**Time**: 10:00 AM - 2:00 PM

### Phase 2A: Project Setup (30 minutes)
**Time**: 10:00 AM - 10:30 AM

**Tasks**:
1. Create backend folder structure
2. Set up virtual environment
3. Install dependencies (FastAPI, SQLAlchemy, PyJWT, bcrypt, uvicorn)
4. Create `requirements.txt`
5. Initialize database connection
6. Create all database tables from schema

**Files to Create**:
- `backend/requirements.txt`
- `backend/app/__init__.py`
- `backend/app/database.py`
- `backend/app/main.py`
- `database/food_delivery.db` (SQLite file)
- `database/schema.sql`

---

### Phase 2B: Models and Authentication (45 minutes)
**Time**: 10:30 AM - 11:15 AM

**Tasks**:
1. Create SQLAlchemy models for all tables
2. Implement JWT authentication utilities
3. Create password hashing utilities
4. Implement auth routes (register, login)

**Files to Create**:
- `backend/app/models/user.py`
- `backend/app/models/restaurant.py`
- `backend/app/models/dish.py`
- `backend/app/models/order.py`
- `backend/app/models/delivery_partner.py`
- `backend/app/models/complaint.py`
- `backend/app/models/offer.py`
- `backend/app/models/fee.py`
- `backend/app/auth.py`
- `backend/app/routes/auth.py`

---

### Phase 2C: Admin & Restaurant Routes (45 minutes)
**Time**: 11:15 AM - 12:00 PM

**Tasks**:
1. Implement Admin routes:
   - Restaurant CRUD
   - Platform fee management
   - Platform offer management
2. Implement Restaurant Owner routes:
   - Dish CRUD
   - Restaurant status toggle
   - Restaurant offer management
   - View orders

**Files to Create**:
- `backend/app/routes/admin.py`
- `backend/app/routes/restaurant.py`

---

### Phase 2D: Customer Routes (45 minutes)
**Time**: 12:00 PM - 12:45 PM

**Tasks**:
1. Implement Customer routes:
   - Browse restaurants
   - View menu
   - Cart management (session-based)
   - Apply offers
   - Place order
   - View order history
   - Track order
   - Raise complaint

**Files to Create**:
- `backend/app/routes/customer.py`
- `backend/app/services/cart_service.py`

---

### Phase 2E: Delivery & Support Routes (30 minutes)
**Time**: 12:45 PM - 1:15 PM

**Tasks**:
1. Implement Delivery Partner routes:
   - Toggle availability
   - View assigned orders
   - Update delivery status
2. Implement Customer Care routes:
   - View complaints
   - Update complaint status

**Files to Create**:
- `backend/app/routes/delivery.py`
- `backend/app/routes/support.py`

---

### Phase 2F: Business Logic Services (45 minutes)
**Time**: 1:15 PM - 2:00 PM

**Tasks**:
1. Implement Order Management Service:
   - Order creation logic
   - Delivery partner assignment (by pin code)
   - Order status updates
2. Implement Pricing Service:
   - Calculate restaurant fees
   - Calculate platform fees
   - Apply discounts
   - Calculate final amount
3. Test all endpoints with sample data

**Files to Create**:
- `backend/app/services/order_service.py`
- `backend/app/services/pricing_service.py`
- `backend/app/services/assignment_service.py`

---

## SPRINT 3: FRONTEND UI & INTEGRATION (1 hour)
**Time**: 2:00 PM - 3:00 PM

### Phase 3A: Frontend Setup (15 minutes)
**Time**: 2:00 PM - 2:15 PM

**Tasks**:
1. Create React app with Vite
2. Install dependencies (React Router, Axios, TailwindCSS, shadcn/ui)
3. Configure TailwindCSS
4. Set up routing structure
5. Create API service client

**Files to Create**:
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/tailwind.config.js`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/services/api.js`

---

### Phase 3B: Authentication & Context (10 minutes)
**Time**: 2:15 PM - 2:25 PM

**Tasks**:
1. Create AuthContext for global auth state
2. Create Login component
3. Create Register component
4. Implement token storage and retrieval

**Files to Create**:
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`

---

### Phase 3C: Customer UI (20 minutes)
**Time**: 2:25 PM - 2:45 PM

**Tasks**:
1. Create Restaurant Browse page
2. Create Restaurant Menu page with dish cards
3. Create Cart page with offer application
4. Create Checkout page
5. Create Order Tracking page

**Files to Create**:
- `frontend/src/pages/customer/RestaurantBrowse.jsx`
- `frontend/src/pages/customer/RestaurantMenu.jsx`
- `frontend/src/pages/customer/Cart.jsx`
- `frontend/src/pages/customer/Checkout.jsx`
- `frontend/src/pages/customer/OrderTracking.jsx`
- `frontend/src/components/RestaurantCard.jsx`
- `frontend/src/components/DishCard.jsx`

---

### Phase 3D: Restaurant Owner UI (10 minutes)
**Time**: 2:45 PM - 2:55 PM

**Tasks**:
1. Create Restaurant Dashboard
2. Create Dish Management page
3. Create Order Management page

**Files to Create**:
- `frontend/src/pages/restaurant/Dashboard.jsx`
- `frontend/src/pages/restaurant/DishManagement.jsx`
- `frontend/src/pages/restaurant/OrderManagement.jsx`

---

### Phase 3E: Other Role UIs (Optional) (5 minutes)
**Time**: 2:55 PM - 3:00 PM

**Tasks**:
1. Create basic Delivery Partner dashboard
2. Create basic Admin dashboard
3. Create basic Support dashboard

**Files to Create**:
- `frontend/src/pages/delivery/Dashboard.jsx`
- `frontend/src/pages/admin/Dashboard.jsx`
- `frontend/src/pages/support/Dashboard.jsx`

---

## BUFFER TIME & TESTING (3 hours)
**Time**: 3:00 PM - 6:00 PM

### Phase 4A: Integration Testing (1 hour)
**Time**: 3:00 PM - 4:00 PM

**Tasks**:
1. Test complete customer flow:
   - Register → Login → Browse → Add to Cart → Checkout → Place Order → Track
2. Test restaurant owner flow:
   - Login → Add Dish → View Orders
3. Test delivery partner flow:
   - Login → Toggle Availability → View Orders → Update Status
4. Test admin flow:
   - Login → Add Restaurant → Configure Fees

---

### Phase 4B: Bug Fixes & Refinements (1 hour)
**Time**: 4:00 PM - 5:00 PM

**Tasks**:
1. Fix any bugs found during testing
2. Improve error handling
3. Add loading states
4. Improve UI/UX
5. Add sample data to database

---

### Phase 4C: Demo Preparation (1 hour)
**Time**: 5:00 PM - 6:00 PM

**Tasks**:
1. Create demo script
2. Seed database with realistic data:
   - 5-10 restaurants
   - 20-30 dishes with images
   - 3-5 delivery partners
   - Sample orders in different states
3. Test demo flow multiple times
4. Prepare presentation talking points
5. Document any known limitations

**Demo Flow**:
```
1. Show system architecture (docs/ARCHITECTURE.md)
2. Show database schema (docs/DATABASE_SCHEMA.md)
3. Live demo:
   - Customer: Browse → Order → Track
   - Restaurant: Manage dishes → View orders
   - Delivery: Accept → Update status
   - Admin: Add restaurant → Configure fees
4. Show API endpoints (Swagger/Postman)
5. Explain trade-offs and implementation choices
```

---

## Key Success Metrics

### Must-Have (Critical):
- ✅ All database tables created with proper relationships
- ✅ All API endpoints implemented and tested
- ✅ End-to-end customer ordering flow works
- ✅ Role-based authentication and authorization
- ✅ Order lifecycle (pending → delivered) works
- ✅ Delivery partner assignment works
- ✅ UI connected to backend APIs

### Should-Have (Important):
- ✅ Offer/discount system works
- ✅ Fee calculation (restaurant + platform) works
- ✅ Complaint system works
- ✅ Order tracking shows real-time status
- ✅ Restaurant can manage dishes
- ✅ Clean, organized code structure

### Nice-to-Have (Optional):
- Notification simulation
- Reorder from past orders
- Estimated delivery time calculation
- Ratings and reviews
- Order cancellation workflow
- Multi-restaurant cart restrictions

---

## Risk Mitigation

### High-Risk Areas:
1. **Delivery Partner Assignment Logic**: Keep it simple (pin code match + availability)
2. **Pricing Calculation**: Test thoroughly with multiple scenarios
3. **Frontend-Backend Integration**: Use consistent data formats
4. **Time Management**: Stick to time boxes, cut features if needed

### Fallback Plans:
1. If frontend takes too long → Focus on Postman/Swagger demo
2. If complex features fail → Remove optional features
3. If integration issues → Demo backend and frontend separately

---

## Team Coordination (If Team Size > 1)

### Recommended Split:
- **Person 1**: Backend (Models, Auth, Admin/Restaurant routes)
- **Person 2**: Backend (Customer/Delivery/Support routes, Services)
- **Person 3**: Frontend (Customer UI, Restaurant UI)
- **Person 4**: Frontend (Other UIs, Integration, Testing)

### Communication:
- Sync every hour
- Share API contracts early
- Use Git branches
- Test integrations frequently

---

## Tools & Resources

### Development:
- **Backend**: VS Code, Postman/Insomnia, DB Browser for SQLite
- **Frontend**: VS Code, React DevTools, Browser DevTools
- **Version Control**: Git

### Documentation:
- FastAPI auto-generates Swagger docs at `/docs`
- Keep README.md updated

### Testing:
- Manual testing with Postman
- Browser testing for UI
- End-to-end flow testing

---

## Post-Hackathon Improvements (If Time Allows)

1. Add input validation on frontend
2. Add loading spinners and error messages
3. Improve UI design and responsiveness
4. Add image upload functionality (currently using paths)
5. Add search and filter features
6. Add pagination for lists
7. Add email/SMS notifications (simulated)
8. Add order cancellation feature
9. Add ratings and reviews
10. Deploy to cloud (Heroku, Vercel)

---

## Evaluation Checklist

### Problem Understanding:
- ✅ Clear explanation of food delivery system business value
- ✅ Correct mapping of roles and workflows

### Data & System Design:
- ✅ Sensible database schema with proper relationships
- ✅ Thoughtful handling of fees, offers, and restaurant availability
- ✅ Proper separation of responsibilities by role

### Backend Engineering:
- ✅ Clean, organized framework code structure
- ✅ Correct CRUD operations and validations
- ✅ Reliable SQLite persistence

### UI & Integration:
- ✅ Functional UI connected with backend endpoints
- ✅ Smooth end-to-end ordering experience
- ✅ Proper error handling and user-friendly flows

### Communication & Presentation:
- ✅ Clear storyline: problem → design → backend → UI → demo
- ✅ Ability to explain trade-offs and implementation choices
- ✅ Live working demo of the platform

---

## Current Status: SPRINT 1 COMPLETED ✅

**Next Steps**:
1. Move to Sprint 2: Backend Development
2. Start with Phase 2A: Project Setup
3. Follow the timeline strictly
4. Test frequently

**Estimated Completion Time**: 6:00 PM (on schedule)

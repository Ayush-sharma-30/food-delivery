# UI Screens and User Flows

## Screen Inventory

### Authentication Screens
1. **Login Page** - Universal login for all roles
2. **Register Page** - Customer/Delivery Partner/Customer Care registration

### Customer Screens
3. **Home/Restaurant Browse** - List of restaurants with filters
4. **Restaurant Menu** - Dishes with images, prices, add to cart
5. **Cart Page** - Review items, apply offers, calculate total
6. **Checkout Page** - Delivery address, payment mode selection
7. **Order Confirmation** - Order details, tracking link
8. **Order Tracking** - Real-time order status
9. **Order History** - Past orders with reorder option
10. **Complaint Form** - Submit complaint for an order
11. **Complaint History** - View complaint status

### Restaurant Owner Screens
12. **Restaurant Dashboard** - Overview, stats
13. **Dish Management** - List, add, edit, delete dishes
14. **Add/Edit Dish Form** - Dish details with image upload
15. **Order Management** - Incoming orders, update status
16. **Offers Management** - Create restaurant-specific offers
17. **Restaurant Settings** - Enable/disable ordering, fees

### Delivery Partner Screens
18. **Delivery Dashboard** - Availability toggle, assigned orders
19. **Order Details** - Pickup and delivery addresses, items
20. **Delivery Status Update** - Mark as picked up/delivered

### Admin Screens
21. **Admin Dashboard** - System overview
22. **Restaurant Management** - Add, view, edit restaurants
23. **Add Restaurant Form** - Restaurant onboarding
24. **Platform Fee Configuration** - Set platform fees
25. **Platform Offers** - Create platform-wide offers

### Customer Care Screens
26. **Support Dashboard** - List of complaints
27. **Complaint Details** - View complaint, add resolution notes
28. **Order Lookup** - Search and view order details

---

## Detailed Screen Specifications

### 1. Login Page
**Route**: `/login`

**Components**:
- Email input
- Password input
- Role selector (Customer, Restaurant, Delivery Partner, Admin, Customer Care)
- Login button
- Link to Register page

**Actions**:
- POST `/auth/login`
- Store JWT token
- Redirect based on role

---

### 2. Register Page
**Route**: `/register`

**Components**:
- Name input
- Email input
- Password input
- Phone input
- Role selector (Customer, Delivery Partner, Customer Care)
- Address input (for Customer)
- Pin code input
- Register button
- Link to Login page

**Actions**:
- POST `/auth/register`
- Auto-login after registration

---

### 3. Home/Restaurant Browse (Customer)
**Route**: `/customer/home`

**Components**:
- Search bar
- Pin code filter
- Restaurant cards with:
  - Restaurant name
  - Address
  - Status badge (Open/Closed)
  - View Menu button

**Actions**:
- GET `/customer/restaurants?pin_code={pin_code}`
- Click restaurant → Navigate to Menu page

---

### 4. Restaurant Menu (Customer)
**Route**: `/customer/restaurant/{id}/menu`

**Components**:
- Restaurant header (name, address)
- Category filters
- Dish cards with:
  - Dish image
  - Name
  - Description
  - Price
  - Availability indicator
  - Add to Cart button (with quantity selector)
- Floating Cart button (shows item count)

**Actions**:
- GET `/customer/restaurants/{id}/menu`
- POST `/customer/cart` (add item)
- Click Cart button → Navigate to Cart page

---

### 5. Cart Page (Customer)
**Route**: `/customer/cart`

**Components**:
- Cart items list with:
  - Dish image, name, price
  - Quantity selector
  - Remove button
- Subtotal
- Offer code input with Apply button
- Discount amount (if offer applied)
- Restaurant fees
- Platform fees
- Delivery charges
- Final total
- Proceed to Checkout button

**Actions**:
- GET `/customer/cart`
- POST `/customer/offers/validate` (apply offer)
- DELETE `/customer/cart/{dish_id}` (remove item)
- Click Checkout → Navigate to Checkout page

---

### 6. Checkout Page (Customer)
**Route**: `/customer/checkout`

**Components**:
- Delivery address input
- Pin code input
- Payment mode selector (Cash, Card, UPI, Wallet)
- Order summary
- Place Order button

**Actions**:
- POST `/customer/orders`
- Navigate to Order Confirmation page

---

### 7. Order Confirmation (Customer)
**Route**: `/customer/order/{id}/confirmation`

**Components**:
- Success message
- Order ID
- Order details (items, total)
- Estimated delivery time
- Track Order button
- Continue Shopping button

**Actions**:
- Navigate to Order Tracking or Home

---

### 8. Order Tracking (Customer)
**Route**: `/customer/order/{id}/track`

**Components**:
- Order status timeline:
  - Pending
  - Confirmed
  - Preparing
  - Ready for Pickup
  - Picked Up
  - Delivered
- Restaurant details
- Delivery partner details (if assigned)
- Order items
- Raise Complaint button

**Actions**:
- GET `/customer/orders/{id}` (poll for updates)
- Navigate to Complaint Form

---

### 9. Order History (Customer)
**Route**: `/customer/orders`

**Components**:
- List of past orders with:
  - Order ID
  - Restaurant name
  - Order date
  - Status
  - Total amount
  - View Details button
  - Reorder button

**Actions**:
- GET `/customer/orders`
- Click View Details → Navigate to Order Tracking
- Click Reorder → Add items to cart

---

### 10. Complaint Form (Customer)
**Route**: `/customer/complaint/new`

**Components**:
- Order selector (dropdown of recent orders)
- Complaint description textarea
- Submit button

**Actions**:
- POST `/customer/complaints`
- Navigate to Complaint History

---

### 11. Complaint History (Customer)
**Route**: `/customer/complaints`

**Components**:
- List of complaints with:
  - Complaint ID
  - Order ID
  - Description
  - Status badge
  - Resolution notes (if resolved)
  - Created date

**Actions**:
- GET `/customer/complaints`

---

### 12. Restaurant Dashboard (Restaurant Owner)
**Route**: `/restaurant/dashboard`

**Components**:
- Stats cards:
  - Total orders today
  - Pending orders
  - Revenue today
- Quick actions:
  - Manage Dishes
  - View Orders
  - Manage Offers
- Restaurant status toggle (Enable/Disable ordering)

**Actions**:
- PUT `/restaurant/status`

---

### 13. Dish Management (Restaurant Owner)
**Route**: `/restaurant/dishes`

**Components**:
- Add New Dish button
- Dish table/grid with:
  - Dish image thumbnail
  - Name
  - Price
  - Availability toggle
  - Edit button
  - Delete button

**Actions**:
- GET `/restaurant/dishes`
- Navigate to Add/Edit Dish Form
- DELETE `/restaurant/dishes/{id}`
- Toggle availability

---

### 14. Add/Edit Dish Form (Restaurant Owner)
**Route**: `/restaurant/dishes/new` or `/restaurant/dishes/{id}/edit`

**Components**:
- Dish name input
- Description textarea
- Price input
- Category input
- Image upload (store path in code folder)
- Availability checkbox
- Save button

**Actions**:
- POST `/restaurant/dishes` (create)
- PUT `/restaurant/dishes/{id}` (update)

---

### 15. Order Management (Restaurant Owner)
**Route**: `/restaurant/orders`

**Components**:
- Status filter tabs (Pending, Confirmed, Preparing, Ready)
- Order cards with:
  - Order ID
  - Customer name
  - Items list
  - Total amount
  - Order time
  - Status update buttons

**Actions**:
- GET `/restaurant/orders?status={status}`
- Update order status (backend handles this)

---

### 16. Offers Management (Restaurant Owner)
**Route**: `/restaurant/offers`

**Components**:
- Create Offer button
- Offers list with:
  - Offer code
  - Description
  - Discount value
  - Valid until
  - Active/Inactive toggle

**Actions**:
- POST `/restaurant/offers`
- GET `/restaurant/offers`

---

### 17. Restaurant Settings (Restaurant Owner)
**Route**: `/restaurant/settings`

**Components**:
- Restaurant status toggle
- Restaurant fees input
- Save button

**Actions**:
- PUT `/restaurant/status`
- Update restaurant fees

---

### 18. Delivery Dashboard (Delivery Partner)
**Route**: `/delivery/dashboard`

**Components**:
- Availability toggle (large, prominent)
- Assigned orders list with:
  - Order ID
  - Restaurant name and address
  - Customer delivery address
  - Status
  - View Details button

**Actions**:
- PUT `/delivery/availability`
- GET `/delivery/orders`

---

### 19. Order Details (Delivery Partner)
**Route**: `/delivery/order/{id}`

**Components**:
- Pickup details (restaurant name, address)
- Delivery details (customer address, pin code)
- Items list
- Customer phone
- Status update buttons:
  - Mark as Picked Up
  - Mark as Delivered

**Actions**:
- PUT `/delivery/orders/{id}/status`

---

### 20. Admin Dashboard (Admin)
**Route**: `/admin/dashboard`

**Components**:
- Stats cards:
  - Total restaurants
  - Total orders
  - Active delivery partners
- Quick actions:
  - Add Restaurant
  - Configure Fees
  - Manage Offers

---

### 21. Restaurant Management (Admin)
**Route**: `/admin/restaurants`

**Components**:
- Add Restaurant button
- Restaurant table with:
  - Name
  - Pin code
  - Status
  - Restaurant fees
  - Edit button

**Actions**:
- GET `/admin/restaurants`
- Navigate to Add Restaurant Form

---

### 22. Add Restaurant Form (Admin)
**Route**: `/admin/restaurants/new`

**Components**:
- Restaurant name input
- Address input
- Pin code input
- Phone input
- Owner name input
- Owner email input
- Owner password input
- Restaurant fees input
- Submit button

**Actions**:
- POST `/admin/restaurants`

---

### 23. Platform Fee Configuration (Admin)
**Route**: `/admin/fees`

**Components**:
- Fee list with:
  - Fee type
  - Fee value
  - Is percentage checkbox
  - Edit button
- Add Fee button

**Actions**:
- GET `/admin/platform-fees`
- POST `/admin/platform-fees`

---

### 24. Platform Offers (Admin)
**Route**: `/admin/offers`

**Components**:
- Create Offer button
- Offers list with:
  - Code
  - Description
  - Discount value
  - Valid until
  - Active toggle

**Actions**:
- POST `/admin/offers`
- GET `/admin/offers`

---

### 25. Support Dashboard (Customer Care)
**Route**: `/support/dashboard`

**Components**:
- Status filter tabs (Open, In Progress, Resolved)
- Complaints list with:
  - Complaint ID
  - Order ID
  - Customer name
  - Description
  - Status
  - View Details button

**Actions**:
- GET `/support/complaints?status={status}`

---

### 26. Complaint Details (Customer Care)
**Route**: `/support/complaint/{id}`

**Components**:
- Complaint details (ID, order ID, customer, description)
- Order details link
- Status selector
- Resolution notes textarea
- Update button

**Actions**:
- PUT `/support/complaints/{id}`
- GET `/support/orders/{order_id}` (view order)

---

## User Flow Diagrams

### Customer Order Flow
```
Login → Browse Restaurants → View Menu → Add to Cart → 
Apply Offer → Checkout → Place Order → Track Order → 
(Optional) Raise Complaint
```

### Restaurant Owner Flow
```
Login → Dashboard → Manage Dishes (Add/Edit/Delete) → 
View Orders → Update Order Status → Manage Offers
```

### Delivery Partner Flow
```
Login → Toggle Availability ON → View Assigned Orders → 
View Order Details → Mark as Picked Up → Mark as Delivered
```

### Admin Flow
```
Login → Add Restaurant → Configure Platform Fees → 
Create Platform Offers
```

### Customer Care Flow
```
Login → View Complaints → Select Complaint → 
View Order Details → Update Status → Add Resolution Notes
```

---

## UI Design Guidelines

### Color Scheme
- **Primary**: Blue (#3B82F6) - Actions, links
- **Success**: Green (#10B981) - Confirmed, delivered
- **Warning**: Yellow (#F59E0B) - Pending, preparing
- **Danger**: Red (#EF4444) - Cancelled, errors
- **Neutral**: Gray (#6B7280) - Text, borders

### Typography
- **Headings**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Small**: 12px for labels

### Components (shadcn/ui)
- Button
- Card
- Input
- Select
- Dialog/Modal
- Badge
- Table
- Tabs
- Toggle

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Stack components vertically on mobile

### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Color contrast ratios (WCAG AA)
- Focus indicators

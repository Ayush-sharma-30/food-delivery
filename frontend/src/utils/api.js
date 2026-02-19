import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password, role) => 
    api.post('/auth/login', { email, password, role }),
  
  registerCustomer: (data) => 
    api.post('/auth/register', { ...data, role: 'customer' }),
  
  registerDeliveryPartner: (data) => 
    api.post('/auth/register/delivery-partner', data),

  registerCustomerCare: (data) => 
    api.post('/auth/register', { ...data, role: 'customer_care' }),
};

export const customerAPI = {
  getRestaurants: (pinCode) => 
    api.get('/customer/restaurants', { params: { pin_code: pinCode } }),
  
  getMenu: (restaurantId) => 
    api.get(`/customer/restaurants/${restaurantId}/menu`),
  
  addToCart: (dishId, quantity) => 
    api.post('/customer/cart', { dish_id: dishId, quantity }),
  
  getCart: () => 
    api.get('/customer/cart'),
  
  removeFromCart: (dishId) => 
    api.delete(`/customer/cart/${dishId}`),
  
  validateOffer: (offerCode, orderAmount, restaurantId) => 
    api.post('/customer/offers/validate', { 
      offer_code: offerCode, 
      order_amount: orderAmount, 
      restaurant_id: restaurantId 
    }),
  
  placeOrder: (orderData) => 
    api.post('/customer/orders', orderData),
  
  getOrders: () => 
    api.get('/customer/orders'),
  
  trackOrder: (orderId) => 
    api.get(`/customer/orders/${orderId}`),
  
  raiseComplaint: (orderId, description) => 
    api.post('/customer/complaints', { order_id: orderId, description }),
  
  getComplaints: () => 
    api.get('/customer/complaints'),
};

export const restaurantAPI = {
  addDish: (dishData) => 
    api.post('/restaurant/dishes', dishData),
  
  getDishes: () => 
    api.get('/restaurant/dishes'),
  
  updateDish: (dishId, dishData) => 
    api.put(`/restaurant/dishes/${dishId}`, dishData),
  
  deleteDish: (dishId) => 
    api.delete(`/restaurant/dishes/${dishId}`),
  
  updateStatus: (status) => 
    api.put('/restaurant/status', { status }),
  
  getOrders: (status) => 
    api.get('/restaurant/orders', { params: { status } }),
  
  createOffer: (offerData) => 
    api.post('/restaurant/offers', offerData),

  updateOrderStatus: (orderId, status) =>
    api.put(`/restaurant/orders/${orderId}/status`, { status }),
};

export const deliveryAPI = {
  toggleAvailability: (availability) => 
    api.put('/delivery/availability', { availability }),
  
  getOrders: (status) => 
    api.get('/delivery/orders', { params: { status } }),
  
  updateOrderStatus: (orderId, status) => 
    api.put(`/delivery/orders/${orderId}/status`, { status }),
};

export const adminAPI = {
  addRestaurant: (restaurantData) => 
    api.post('/admin/restaurants', restaurantData),
  
  getRestaurants: () => 
    api.get('/admin/restaurants'),
  
  updateRestaurant: (restaurantId, updateData) => 
    api.put(`/admin/restaurants/${restaurantId}`, updateData),
  
  createPlatformFee: (feeData) => 
    api.post('/admin/platform-fees', feeData),
  
  getPlatformFees: () => 
    api.get('/admin/platform-fees'),
  
  createOffer: (offerData) => 
    api.post('/admin/offers', offerData),
  
  getOffers: () => 
    api.get('/admin/offers'),
};

export const supportAPI = {
  getComplaints: (status) => 
    api.get('/support/complaints', { params: { status } }),
  
  updateComplaint: (complaintId, updateData) => 
    api.put(`/support/complaints/${complaintId}`, updateData),
  
  getOrderDetails: (orderId) => 
    api.get(`/support/orders/${orderId}`),
};

export default api;

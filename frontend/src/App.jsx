import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Restaurants from './components/customer/Restaurants';
import Menu from './components/customer/Menu';
import Cart from './components/customer/Cart';
import Orders from './components/customer/Orders';
import RestaurantDashboard from './components/restaurant/Dashboard';
import DeliveryOrders from './components/delivery/Orders';
import AdminDashboard from './components/admin/Dashboard';
import SupportComplaints from './components/support/Complaints';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route
            path="/customer/restaurants"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Restaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/restaurant/:restaurantId"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Menu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/cart"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders/:orderId"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Orders />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute allowedRoles={['restaurant']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/delivery/orders"
            element={
              <ProtectedRoute allowedRoles={['delivery_partner']}>
                <DeliveryOrders />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/support/complaints"
            element={
              <ProtectedRoute allowedRoles={['customer_care']}>
                <SupportComplaints />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerAPI } from '../../utils/api';
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setSelectedOrder(null);
      fetchOrders();
    }
  }, [orderId]);

  const fetchOrders = async () => {
    try {
      const response = await customerAPI.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await customerAPI.trackOrder(id);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'preparing':
        return <Package className="w-6 h-6 text-yellow-500" />;
      case 'ready':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'picked_up':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-orange-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl font-semibold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{selectedOrder.id}</h1>
                <p className="text-gray-500 font-medium">{selectedOrder.restaurant?.name}</p>
              </div>
              <span className={`px-5 py-2 rounded-full font-bold text-sm ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Status Progress */}
            <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-xl p-4">
              {['confirmed','preparing','ready','picked_up','delivered'].map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    ['confirmed','preparing','ready','picked_up','delivered'].indexOf(selectedOrder.status) >= i
                      ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>{i+1}</div>
                  <span className="text-xs text-gray-500 capitalize">{s.replace('_',' ')}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Delivery Address</h3>
                <p className="text-gray-600">{selectedOrder.delivery_address}</p>
              </div>
              {selectedOrder.delivery_partner && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Delivery Partner</h3>
                  <p className="text-gray-600">{selectedOrder.delivery_partner.name}</p>
                  <p className="text-gray-500 text-sm">{selectedOrder.delivery_partner.phone}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{item.dish_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{selectedOrder.final_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/customer/restaurants')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start ordering to see your order history</p>
            <button
              onClick={() => navigate('/customer/restaurants')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/customer/orders/${order.id}`)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                      <p className="text-gray-500">{order.restaurant_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-600">₹{order.final_amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 pt-3 border-t border-gray-100">
                  {order.items.length} items • {new Date(order.order_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

import { useState, useEffect } from 'react';
import { deliveryAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Package, MapPin, LogOut, CheckCircle, Check, Truck, ToggleLeft, ToggleRight } from 'lucide-react';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('');
  const [available, setAvailable] = useState(true);
  const { logout, user } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await deliveryAPI.getOrders(filter || undefined);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await deliveryAPI.updateOrderStatus(orderId, status);
      fetchOrders();
      showToast(`Order marked as ${status.replace('_', ' ')}`);
    } catch (error) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const newVal = !available;
      await deliveryAPI.toggleAvailability(newVal);
      setAvailable(newVal);
      showToast(newVal ? 'You are now available' : 'You are now offline');
    } catch (error) {
      showToast('Failed to update availability', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-orange-100 text-orange-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl font-semibold text-white flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <Check className="w-5 h-5" />
          {toast.message}
        </div>
      )}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleToggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
              {available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {available ? 'Online' : 'Offline'}
            </button>
            <span className="text-gray-700 font-medium hidden sm:inline">Hi, {user?.name}</span>
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Assigned Orders</h2>
          <div className="flex gap-2">
            {[{v:'', l:'Active'}, {v:'ready', l:'Ready'}, {v:'picked_up', l:'Picked Up'}, {v:'delivered', l:'Delivered'}].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f.v ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders {filter ? `with status "${filter.replace('_',' ')}"` : 'assigned'}</h3>
            <p className="text-gray-500">Orders will appear here when assigned to you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-orange-50 rounded-xl p-3">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-orange-600" /> Restaurant
                    </h4>
                    <p className="text-gray-700 text-sm">{order.restaurant?.name}</p>
                    <p className="text-gray-500 text-xs">{order.restaurant?.address}</p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600" /> Delivery Address
                    </h4>
                    <p className="text-gray-700 text-sm">{order.customer_address}</p>
                    <p className="text-gray-500 text-xs">PIN: {order.customer_pin_code}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Items</h4>
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-gray-700 text-sm">{item.dish_name} × {item.quantity}</p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'ready' && (
                    <button onClick={() => handleUpdateStatus(order.id, 'picked_up')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold transition-all">
                      <Package className="w-5 h-5" /> Mark Picked Up
                    </button>
                  )}
                  {order.status === 'picked_up' && (
                    <button onClick={() => handleUpdateStatus(order.id, 'delivered')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold transition-all">
                      <CheckCircle className="w-5 h-5" /> Mark Delivered
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <span className="flex-1 py-3 text-center text-green-600 font-bold text-sm">Delivered ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;

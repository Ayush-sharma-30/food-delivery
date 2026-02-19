import { useState, useEffect } from 'react';
import { restaurantAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, LogOut, Package, Check, Store, UtensilsCrossed, ClipboardList, XCircle } from 'lucide-react';

const RestaurantDashboard = () => {
  const [tab, setTab] = useState('orders');
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('');
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '', category: '' });
  const [toast, setToast] = useState(null);
  const { logout, user } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetchDishes();
    fetchOrders();
  }, []);

  useEffect(() => { fetchOrders(); }, [orderFilter]);

  const fetchDishes = async () => {
    try {
      const response = await restaurantAPI.getDishes();
      setDishes(response.data.dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await restaurantAPI.getOrders(orderFilter || undefined);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.addDish({ ...newDish, price: parseFloat(newDish.price), availability: true });
      setNewDish({ name: '', description: '', price: '', category: '' });
      setShowAddDish(false);
      fetchDishes();
      showToast('Dish added successfully!');
    } catch (error) {
      showToast('Failed to add dish', 'error');
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await restaurantAPI.deleteDish(dishId);
      fetchDishes();
      showToast('Dish deleted');
    } catch (error) {
      showToast('Failed to delete dish', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await restaurantAPI.updateOrderStatus(orderId, status);
      fetchOrders();
      showToast(`Order marked as ${status}`);
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to update order', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inputClass = "w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm";

  const activeOrders = orders.filter(o => ['pending','confirmed','preparing','ready'].includes(o.status));

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl font-semibold text-white flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <Check className="w-5 h-5" /> {toast.message}
        </div>
      )}

      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:inline">Hi, {user?.name}</span>
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              tab === 'orders' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            <ClipboardList className="w-5 h-5" /> Orders
            {activeOrders.length > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                tab === 'orders' ? 'bg-white/30 text-white' : 'bg-red-500 text-white'
              }`}>{activeOrders.length}</span>
            )}
          </button>
          <button onClick={() => setTab('menu')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              tab === 'menu' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            <UtensilsCrossed className="w-5 h-5" /> Menu
            <span className={`ml-1 text-xs ${tab === 'menu' ? 'text-white/70' : 'text-gray-400'}`}>({dishes.length})</span>
          </button>
        </div>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Incoming Orders</h2>
              <div className="flex gap-2">
                {[
                  { v: '', l: 'All' },
                  { v: 'pending', l: 'New' },
                  { v: 'confirmed', l: 'Confirmed' },
                  { v: 'preparing', l: 'Preparing' },
                  { v: 'ready', l: 'Ready' },
                  { v: 'delivered', l: 'Delivered' },
                ].map(f => (
                  <button key={f.v} onClick={() => setOrderFilter(f.v)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      orderFilter === f.v ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}>{f.l}</button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders {orderFilter ? `with status "${orderFilter}"` : 'yet'}</h3>
                <p className="text-gray-500">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all ${
                    order.status === 'pending' ? 'border-orange-300 ring-2 ring-orange-100' :
                    order.status === 'preparing' ? 'border-yellow-300' : 'border-gray-100'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                        <p className="text-gray-400 text-xs mt-1">{order.delivery_address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1">
                          <span className="text-gray-700">{item.dish_name} × {item.quantity}</span>
                          <span className="text-gray-900 font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 text-sm font-medium">Total</span>
                      <span className="text-xl font-bold text-green-600">₹{order.total_amount}</span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                            className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all text-sm">
                            Accept Order
                          </button>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all text-sm">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                            className="flex-1 py-2.5 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-all text-sm">
                            Start Preparing
                          </button>
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all text-sm">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                          className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all text-sm">
                          Mark Ready for Pickup
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <span className="flex-1 py-2.5 text-center text-orange-600 font-bold text-sm bg-orange-50 rounded-xl">
                          Waiting for delivery pickup...
                        </span>
                      )}
                      {order.status === 'picked_up' && (
                        <span className="flex-1 py-2.5 text-center text-blue-600 font-bold text-sm bg-blue-50 rounded-xl">
                          Out for delivery
                        </span>
                      )}
                      {order.status === 'delivered' && (
                        <span className="flex-1 py-2.5 text-center text-green-600 font-bold text-sm bg-green-50 rounded-xl">
                          Delivered
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="flex-1 py-2.5 text-center text-red-600 font-bold text-sm bg-red-50 rounded-xl">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MENU TAB */}
        {tab === 'menu' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
              <button onClick={() => setShowAddDish(!showAddDish)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold transition-all">
                <Plus className="w-5 h-5" /> Add Dish
              </button>
            </div>

            {showAddDish && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Dish</h3>
                <form onSubmit={handleAddDish} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Dish Name" value={newDish.name}
                    onChange={(e) => setNewDish({...newDish, name: e.target.value})} required className={inputClass} />
                  <input type="text" placeholder="Category" value={newDish.category}
                    onChange={(e) => setNewDish({...newDish, category: e.target.value})} className={inputClass} />
                  <input type="text" placeholder="Description" value={newDish.description}
                    onChange={(e) => setNewDish({...newDish, description: e.target.value})} className={`${inputClass} md:col-span-1`} />
                  <input type="number" placeholder="Price (₹)" value={newDish.price}
                    onChange={(e) => setNewDish({...newDish, price: e.target.value})} required className={inputClass} />
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold transition-all">Add Dish</button>
                    <button type="button" onClick={() => setShowAddDish(false)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-semibold">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {dishes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <UtensilsCrossed className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No dishes yet</h3>
                <p className="text-gray-500">Add your first dish to start receiving orders</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dishes.map((dish) => (
                  <div key={dish.id} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{dish.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{dish.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-green-600 font-bold text-lg">₹{dish.price}</span>
                          {dish.category && <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-lg">{dish.category}</span>}
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            dish.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>{dish.availability ? 'Available' : 'Unavailable'}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteDish(dish.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../../utils/api';
import { Store, MapPin, ShoppingCart, LogOut, Search, Star, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [pinCode, setPinCode] = useState('110001');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.getRestaurants(pinCode);
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">FoodExpress</h1>
                <p className="text-xs text-gray-500">Discover & Order</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-gray-700">Hi, {user?.name}</span>
              </div>
              <button
                onClick={() => navigate('/customer/cart')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Cart</span>
              </button>
              <button
                onClick={() => navigate('/customer/orders')}
                className="px-4 py-2 border-2 border-orange-200 rounded-xl hover:bg-orange-50 font-semibold text-gray-700 transition-all duration-200"
              >
                <span className="hidden sm:inline">My Orders</span>
                <Clock className="w-5 h-5 sm:hidden" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <h2 className="text-4xl font-bold text-gray-900">Discover Restaurants</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              🔍 Search by Location
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Enter PIN code (e.g., 110001)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                />
              </div>
              <button
                onClick={fetchRestaurants}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 font-semibold text-lg">Finding best restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <Store className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try searching in a different area</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">
                <span className="font-bold text-orange-600">{restaurants.length}</span> restaurants available
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/customer/restaurant/${restaurant.id}`)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:scale-105"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${restaurant.id % 2 === 0 ? '1517248135467-4c7edcad34c4' : '1552566626-98f62bbb8708'}?w=600&h=400&fit=crop`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'; }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        restaurant.status === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {restaurant.status === 'active' ? '🟢 Open Now' : '🔴 Closed'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-orange-500" />
                      <p className="text-sm leading-relaxed">{restaurant.address}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">4.5</span>
                      <span className="text-gray-500 text-sm">(200+ ratings)</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">30-40 mins</span>
                      <span className="text-orange-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        View Menu
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;

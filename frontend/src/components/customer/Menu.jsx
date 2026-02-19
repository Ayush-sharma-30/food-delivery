import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI } from '../../utils/api';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Flame, Check } from 'lucide-react';

const foodImages = {
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  'margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
  'pepperoni': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'chicken burger': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
  'veggie burger': 'https://images.unsplash.com/photo-1520072959219-c595e6cdc07e?w=400&h=300&fit=crop',
  'fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
  'garlic bread': 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop',
  'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
  'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
  'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
  'naan': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  'ice cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  'drink': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
  'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
  'wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
};

const getDishImage = (dishName) => {
  const name = dishName.toLowerCase();
  for (const [key, url] of Object.entries(foodImages)) {
    if (name.includes(key)) return url;
  }
  return foodImages['default'];
};

const Menu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [toast, setToast] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      const response = await customerAPI.getMenu(restaurantId);
      setRestaurant(response.data.restaurant);
      setDishes(response.data.dishes);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
    setLoading(false);
  };

  const fetchCart = async () => {
    try {
      const response = await customerAPI.getCart();
      const items = {};
      let count = 0;
      (response.data.items || []).forEach(item => {
        items[item.dish_id] = item.quantity;
        count += item.quantity;
      });
      setCartItems(items);
      setCartCount(count);
    } catch (error) {
      // Cart might be empty
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleAddToCart = async (dishId) => {
    try {
      await customerAPI.addToCart(dishId, 1);
      setCartItems(prev => ({ ...prev, [dishId]: (prev[dishId] || 0) + 1 }));
      setCartCount(prev => prev + 1);
      showToast('Added to cart');
    } catch (error) {
      showToast('Failed to add', 'error');
    }
  };

  const handleRemoveFromCart = async (dishId) => {
    const currentQty = cartItems[dishId] || 0;
    if (currentQty <= 0) return;
    try {
      if (currentQty === 1) {
        await customerAPI.removeFromCart(dishId);
        setCartItems(prev => { const n = {...prev}; delete n[dishId]; return n; });
      } else {
        await customerAPI.addToCart(dishId, -1);
        setCartItems(prev => ({ ...prev, [dishId]: prev[dishId] - 1 }));
      }
      setCartCount(prev => prev - 1);
      showToast('Removed from cart');
    } catch (error) {
      showToast('Failed to remove', 'error');
    }
  };

  const groupedDishes = dishes.reduce((acc, dish) => {
    const category = dish.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(dish);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl font-semibold text-white flex items-center gap-2 animate-bounce ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <Check className="w-5 h-5" />
          {toast.message}
        </div>
      )}

      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/customer/restaurants')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
          <button
            onClick={() => navigate('/customer/cart')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 font-bold relative"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-3">{restaurant?.name}</h1>
            <p className="text-white/90 text-lg mb-4">{restaurant?.address}</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="font-bold">4.5</span>
                <span className="text-white/80">(200+ ratings)</span>
              </div>
              <div className="text-white/80">30-40 mins</div>
            </div>
          </div>
        </div>

        {Object.entries(groupedDishes).map(([category, categoryDishes]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                {categoryDishes.length} items
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryDishes.map((dish) => {
                const qty = cartItems[dish.id] || 0;
                return (
                  <div
                    key={dish.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={getDishImage(dish.name)}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = foodImages['default']; }}
                      />
                      {!dish.availability && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full">Out of Stock</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 flex items-center gap-1 shadow">
                          <Flame className="w-3 h-3 text-red-500" />
                          Bestseller
                        </span>
                      </div>
                      {qty > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                            {qty} in cart
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{dish.name}</h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{dish.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">4.3</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-2xl font-bold text-orange-600">₹{dish.price}</div>
                        {qty === 0 ? (
                          <button
                            onClick={() => handleAddToCart(dish.id)}
                            disabled={!dish.availability}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-bold shadow-lg transition-all duration-200"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl overflow-hidden shadow-lg">
                            <button
                              onClick={() => handleRemoveFromCart(dish.id)}
                              className="px-3 py-2.5 text-white hover:bg-white/20 transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2.5 text-white font-bold text-lg min-w-[40px] text-center">{qty}</span>
                            <button
                              onClick={() => handleAddToCart(dish.id)}
                              className="px-3 py-2.5 text-white hover:bg-white/20 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

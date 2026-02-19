import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../../utils/api';
import { ArrowLeft, Trash2, ShoppingBag, Tag, Sparkles, CreditCard, Plus, Minus, Check, AlertCircle } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [offerCode, setOfferCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [offerMsg, setOfferMsg] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPinCode, setDeliveryPinCode] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [toast, setToast] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const response = await customerAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setLoading(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemoveItem = async (dishId) => {
    try {
      await customerAPI.removeFromCart(dishId);
      showToast('Item removed');
      fetchCart();
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  const handleUpdateQty = async (dishId, delta) => {
    try {
      await customerAPI.addToCart(dishId, delta);
      fetchCart();
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const handleValidateOffer = async () => {
    if (!cart.items.length || !offerCode) return;
    try {
      const restaurantId = cart.items[0].restaurant_id;
      const response = await customerAPI.validateOffer(offerCode, cart.subtotal, restaurantId);
      if (response.data.valid) {
        setDiscount(response.data.discount_amount);
        setOfferMsg({ type: 'success', text: `You saved ₹${response.data.discount_amount}!` });
      } else {
        setOfferMsg({ type: 'error', text: response.data.message || 'Invalid code' });
        setDiscount(0);
      }
    } catch (error) {
      setOfferMsg({ type: 'error', text: 'Invalid offer code' });
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    setFormError('');
    if (!deliveryAddress || !deliveryPinCode) {
      setFormError('Please enter delivery address and PIN code');
      return;
    }
    if (!cart.items.length) {
      setFormError('Cart is empty');
      return;
    }

    setPlacing(true);
    try {
      const restaurantId = cart.items[0].restaurant_id;
      const items = cart.items.map(item => ({ dish_id: item.dish_id, quantity: item.quantity }));
      const orderData = {
        restaurant_id: restaurantId, items,
        delivery_address: deliveryAddress,
        delivery_pin_code: deliveryPinCode,
        payment_mode: paymentMode,
        offer_code: offerCode || undefined
      };
      const response = await customerAPI.placeOrder(orderData);
      showToast('Order placed successfully!');
      setTimeout(() => navigate(`/customer/orders/${response.data.order_id}`), 500);
    } catch (error) {
      setFormError(error.response?.data?.detail || 'Failed to place order');
    }
    setPlacing(false);
  };

  const deliveryCharges = 40;
  const platformFees = cart.subtotal * 0.05;
  const total = cart.subtotal + deliveryCharges + platformFees - discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 font-semibold text-lg">Loading cart...</p>
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

      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-10 h-10 text-orange-600" />
          <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
          {cart.items.length > 0 && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
              {cart.items.length} items
            </span>
          )}
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <ShoppingBag className="w-32 h-32 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Add some delicious items to get started!</p>
            <button
              onClick={() => navigate('/customer/restaurants')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.dish_id} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
                  <img
                    src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop`}
                    alt={item.dish_name}
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.dish_name}</h3>
                    <p className="text-orange-600 font-bold text-lg">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden">
                    <button onClick={() => item.quantity <= 1 ? handleRemoveItem(item.dish_id) : handleUpdateQty(item.dish_id, -1)}
                      className="px-3 py-2 hover:bg-gray-200 transition-all">
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="px-4 py-2 font-bold text-lg min-w-[40px] text-center">{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(item.dish_id, 1)}
                      className="px-3 py-2 hover:bg-gray-200 transition-all">
                      <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-2xl font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.dish_id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-24 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-bold">₹{cart.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className="font-bold">₹{deliveryCharges}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Platform Fee</span><span className="font-bold">₹{platformFees.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600"><span className="font-semibold">Discount</span><span className="font-bold">-₹{discount.toFixed(2)}</span></div>
                  )}
                </div>

                <div className="flex justify-between text-2xl font-bold mb-6 pb-6 border-b border-gray-200">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total.toFixed(2)}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Offer Code
                    </label>
                    <div className="flex gap-2">
                      <input type="text" value={offerCode} onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                        placeholder="WELCOME50"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-semibold text-sm" />
                      <button onClick={handleValidateOffer}
                        className="px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold text-sm transition-all">
                        Apply
                      </button>
                    </div>
                    {offerMsg && (
                      <p className={`mt-2 text-sm font-semibold ${offerMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {offerMsg.text}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address *</label>
                    <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your complete address" rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code *</label>
                    <input type="text" value={deliveryPinCode} onChange={(e) => setDeliveryPinCode(e.target.value)}
                      placeholder="110001"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment
                    </label>
                    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-semibold text-sm">
                      <option value="cash">Cash on Delivery</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {formError}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {placing ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Placing...</>
                  ) : (
                    <>Place Order &bull; ₹{total.toFixed(2)}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

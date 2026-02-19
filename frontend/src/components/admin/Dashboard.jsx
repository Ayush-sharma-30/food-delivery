import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Store, Plus, LogOut, Check, Shield, Tag, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [tab, setTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [offers, setOffers] = useState([]);
  const [fees, setFees] = useState([]);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '', pin_code: '', address: '', phone: '',
    owner_name: '', owner_email: '', owner_password: '', restaurant_fees: '2.5'
  });
  const [newOffer, setNewOffer] = useState({
    code: '', description: '', discount_type: 'percentage', discount_value: '', min_order_value: '0'
  });
  const [toast, setToast] = useState(null);
  const { logout, user } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetchRestaurants();
    fetchOffers();
    fetchFees();
  }, []);

  const fetchRestaurants = async () => {
    try { const r = await adminAPI.getRestaurants(); setRestaurants(r.data.restaurants); } catch (e) { console.error(e); }
  };
  const fetchOffers = async () => {
    try { const r = await adminAPI.getOffers(); setOffers(r.data.offers); } catch (e) { console.error(e); }
  };
  const fetchFees = async () => {
    try { const r = await adminAPI.getPlatformFees(); setFees(r.data.fees); } catch (e) { console.error(e); }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addRestaurant({ ...newRestaurant, restaurant_fees: parseFloat(newRestaurant.restaurant_fees) });
      setNewRestaurant({ name: '', pin_code: '', address: '', phone: '', owner_name: '', owner_email: '', owner_password: '', restaurant_fees: '2.5' });
      setShowAddRestaurant(false);
      fetchRestaurants();
      showToast('Restaurant added successfully!');
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to add restaurant', 'error');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await adminAPI.updateRestaurant(id, { status: newStatus });
      fetchRestaurants();
      showToast(`Restaurant ${newStatus}`);
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createOffer({
        ...newOffer,
        discount_value: parseFloat(newOffer.discount_value),
        min_order_value: parseFloat(newOffer.min_order_value)
      });
      setNewOffer({ code: '', description: '', discount_type: 'percentage', discount_value: '', min_order_value: '0' });
      setShowAddOffer(false);
      fetchOffers();
      showToast('Offer created!');
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to create offer', 'error');
    }
  };

  const inputClass = "px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm";

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl font-semibold text-white flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <Check className="w-5 h-5" /> {toast.message}
        </div>
      )}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'restaurants', label: 'Restaurants', icon: Store },
            { key: 'offers', label: 'Offers', icon: Tag },
            { key: 'fees', label: 'Platform Fees', icon: DollarSign },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                tab === t.key ? 'bg-purple-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
              {t.key === 'restaurants' && <span className="ml-1 text-xs">({restaurants.length})</span>}
            </button>
          ))}
        </div>

        {/* Restaurants Tab */}
        {tab === 'restaurants' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Restaurants</h2>
              <button onClick={() => setShowAddRestaurant(!showAddRestaurant)}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-semibold transition-all">
                <Plus className="w-5 h-5" /> Add Restaurant
              </button>
            </div>

            {showAddRestaurant && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Restaurant</h3>
                <form onSubmit={handleAddRestaurant} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Restaurant Name" value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})} required className={inputClass} />
                  <input type="text" placeholder="PIN Code" value={newRestaurant.pin_code}
                    onChange={(e) => setNewRestaurant({...newRestaurant, pin_code: e.target.value})} required className={inputClass} />
                  <input type="text" placeholder="Address" value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})} required className={inputClass} />
                  <input type="text" placeholder="Phone" value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})} required className={inputClass} />
                  <input type="text" placeholder="Owner Name" value={newRestaurant.owner_name}
                    onChange={(e) => setNewRestaurant({...newRestaurant, owner_name: e.target.value})} required className={inputClass} />
                  <input type="email" placeholder="Owner Email" value={newRestaurant.owner_email}
                    onChange={(e) => setNewRestaurant({...newRestaurant, owner_email: e.target.value})} required className={inputClass} />
                  <input type="password" placeholder="Owner Password" value={newRestaurant.owner_password}
                    onChange={(e) => setNewRestaurant({...newRestaurant, owner_password: e.target.value})} required className={inputClass} />
                  <input type="number" step="0.1" placeholder="Restaurant Fees (%)" value={newRestaurant.restaurant_fees}
                    onChange={(e) => setNewRestaurant({...newRestaurant, restaurant_fees: e.target.value})} required className={inputClass} />
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-bold transition-all">Add Restaurant</button>
                    <button type="button" onClick={() => setShowAddRestaurant(false)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-semibold">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Store className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        r.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>{r.status}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm mb-4">
                    <p className="text-gray-500"><strong>Address:</strong> {r.address}</p>
                    <p className="text-gray-500"><strong>PIN:</strong> {r.pin_code}</p>
                    <p className="text-gray-500"><strong>Owner:</strong> {r.owner_name}</p>
                    <p className="text-gray-500"><strong>Fees:</strong> {r.restaurant_fees}%</p>
                  </div>
                  <button onClick={() => handleToggleStatus(r.id, r.status)}
                    className={`w-full py-2 rounded-xl font-semibold text-sm transition-all ${
                      r.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}>
                    {r.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Offers Tab */}
        {tab === 'offers' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Platform Offers</h2>
              <button onClick={() => setShowAddOffer(!showAddOffer)}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-semibold transition-all">
                <Plus className="w-5 h-5" /> Create Offer
              </button>
            </div>

            {showAddOffer && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Create Platform Offer</h3>
                <form onSubmit={handleAddOffer} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Offer Code (e.g. SAVE20)" value={newOffer.code}
                    onChange={(e) => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})} required className={inputClass} />
                  <input type="text" placeholder="Description" value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} required className={inputClass} />
                  <select value={newOffer.discount_type} onChange={(e) => setNewOffer({...newOffer, discount_type: e.target.value})} className={inputClass}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                  <input type="number" placeholder="Discount Value" value={newOffer.discount_value}
                    onChange={(e) => setNewOffer({...newOffer, discount_value: e.target.value})} required className={inputClass} />
                  <input type="number" placeholder="Min Order Value" value={newOffer.min_order_value}
                    onChange={(e) => setNewOffer({...newOffer, min_order_value: e.target.value})} className={inputClass} />
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-bold transition-all">Create Offer</button>
                    <button type="button" onClick={() => setShowAddOffer(false)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-semibold">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {offers.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <Tag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-500">Create platform-wide offers for customers</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map(o => (
                  <div key={o.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold text-lg">{o.code}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {o.discount_type === 'percentage' ? `${o.discount_value}%` : `₹${o.discount_value}`}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{o.description}</p>
                    <p className="text-gray-400 text-xs">Min order: ₹{o.min_order_value}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Platform Fees Tab */}
        {tab === 'fees' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Fees</h2>
            {fees.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <DollarSign className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No fees configured</h3>
                <p className="text-gray-500">Platform fees will be shown here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fees.map(f => (
                  <div key={f.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900 text-lg">{f.fee_type}</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {f.is_percentage ? `${f.fee_value}%` : `₹${f.fee_value}`}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{f.description || 'No description'}</p>
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

export default AdminDashboard;

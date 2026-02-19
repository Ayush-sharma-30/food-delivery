import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, UserPlus, ArrowLeft, User, Truck, Headphones } from 'lucide-react';

const roleConfig = {
  customer: { label: 'Customer', icon: User, color: 'from-orange-500 to-red-500', route: '/customer/restaurants' },
  delivery_partner: { label: 'Delivery Partner', icon: Truck, color: 'from-blue-500 to-indigo-500', route: '/delivery/orders' },
  customer_care: { label: 'Customer Support', icon: Headphones, color: 'from-teal-500 to-cyan-500', route: '/support/complaints' },
};

const Register = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', pin_code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = role === 'delivery_partner'
      ? { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, pin_code: formData.pin_code }
      : { ...formData };

    const result = await register(payload, role);
    
    if (result.success) {
      navigate(roleConfig[role].route);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">FoodExpress</h1>
                <p className="text-white/70 text-sm">Delivery Platform</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Join Our<br />Growing<br />Platform
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Sign up as a customer, delivery partner, or customer support agent.
            </p>
          </div>
          <div className="relative z-10 mt-8">
            <p className="text-white/70 text-sm">
              Restaurant owners & admins are onboarded by the platform admin via the Admin Dashboard.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-10 flex flex-col justify-center overflow-y-auto max-h-screen">
          <button onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-4 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>

          <div className="mb-5">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium">{error}</div>
          )}

          {/* Role Tabs */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">I want to join as</label>
            <div className="flex gap-2">
              {Object.entries(roleConfig).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button key={key} type="button" onClick={() => setRole(key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      role === key ? `bg-gradient-to-r ${cfg.color} text-white shadow-lg` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    <Icon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required className={inputClass} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required className={inputClass} placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                required className={inputClass} placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                required minLength="6" className={inputClass} placeholder="Min 6 characters" />
            </div>

            {(role === 'customer' || role === 'delivery_partner') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">PIN Code</label>
                <input type="text" value={formData.pin_code} onChange={(e) => setFormData({...formData, pin_code: e.target.value})}
                  required className={inputClass} placeholder="110001" />
              </div>
            )}

            {role === 'customer' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="2" className={inputClass} placeholder="Your delivery address" />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating Account...</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create {roleConfig[role].label} Account</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className="text-orange-600 hover:text-orange-700 font-bold">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

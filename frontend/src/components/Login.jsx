import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, LogIn, Sparkles, Store, Truck, Shield, Headphones, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'customer', label: 'Customer', icon: User, color: 'from-orange-500 to-red-500' },
    { value: 'restaurant', label: 'Restaurant', icon: Store, color: 'from-green-500 to-emerald-500' },
    { value: 'delivery_partner', label: 'Delivery', icon: Truck, color: 'from-blue-500 to-indigo-500' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'from-purple-500 to-violet-500' },
    { value: 'customer_care', label: 'Support', icon: Headphones, color: 'from-teal-500 to-cyan-500' },
  ];

  const demoCredentials = {
    customer: { email: 'alice@customer.com', password: 'customer123' },
    restaurant: { email: 'pizza@restaurant.com', password: 'pizza123' },
    delivery_partner: { email: 'rahul@delivery.com', password: 'delivery123' },
    admin: { email: 'admin@fooddelivery.com', password: 'admin123' },
    customer_care: { email: 'support@fooddelivery.com', password: 'support123' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, role);
    
    if (result.success) {
      const routes = {
        customer: '/customer/restaurants',
        restaurant: '/restaurant/dashboard',
        delivery_partner: '/delivery/orders',
        admin: '/admin/dashboard',
        customer_care: '/support/complaints',
      };
      navigate(routes[role] || '/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  const fillDemo = () => {
    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Panel - Branding */}
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
              Manage Your<br />Food Business<br />Seamlessly
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              One platform for customers, restaurants, delivery partners, and administrators.
            </p>
          </div>
          
          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <p className="font-semibold text-sm">Quick Demo - Click to autofill credentials</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold text-sm border border-white/30"
            >
              Fill {roles.find(r => r.value === role)?.label} Demo Credentials
            </button>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Role Selection as Tabs */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sign in as</label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setRole(r.value); setError(''); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      role === r.value
                        ? `bg-gradient-to-r ${r.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-orange-600 hover:text-orange-700 font-bold"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

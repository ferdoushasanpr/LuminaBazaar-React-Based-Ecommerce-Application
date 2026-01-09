
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LayoutDashboard, Home, User, Settings, Package, PlusCircle, List, ChevronRight, Menu, X, Filter, Trash2, Search, ArrowRight, CreditCard, MapPin } from 'lucide-react';
import { isAuthenticated, getAuthData, removeToken, productApi } from './api';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/Cart';
import DashboardPage from './pages/Dashboard';
import CategoryPage from './pages/Category';
import ProductListPage from './pages/ProductList';
import CreateProductPage from './pages/CreateProduct';
import UpdateProductPage from './pages/UpdateProduct';
import ShippingPage from './pages/Shipping';
import CheckoutPage from './pages/Checkout';
import OrderStatusPage from './pages/OrderStatus';

const Navbar = ({ cartCount }: { cartCount: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = getAuthData();
  const location = useLocation();

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
          LuminaBazaar
        </Link>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600'}`}>Home</Link>
          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-600'}`}>Dashboard</Link>
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/logout" className="flex items-center space-x-1 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-md active:scale-95">
                <LogOut size={16} />
                <span>Logout</span>
              </Link>
            </>
          ) : (
            <Link to="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 space-y-4 shadow-xl">
          <Link onClick={() => setIsOpen(false)} to="/" className="block text-gray-700 font-medium">Home</Link>
          {isAuthenticated() ? (
            <>
              <Link onClick={() => setIsOpen(false)} to="/dashboard" className="block text-gray-700 font-medium">Dashboard</Link>
              <Link onClick={() => setIsOpen(false)} to="/cart" className="block text-gray-700 font-medium">Cart ({cartCount})</Link>
              <Link onClick={() => setIsOpen(false)} to="/logout" className="block text-red-500 font-medium">Logout</Link>
            </>
          ) : (
            <Link onClick={() => setIsOpen(false)} to="/login" className="block text-indigo-600 font-bold">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">LuminaBazaar</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Premium marketplace for carefully curated electronics and home essentials. Experience the light of shopping.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><Link to="/" className="hover:text-indigo-600">New Arrivals</Link></li>
          <li><Link to="/" className="hover:text-indigo-600">Electronics</Link></li>
          <li><Link to="/" className="hover:text-indigo-600">Home Decor</Link></li>
          <li><Link to="/" className="hover:text-indigo-600">Offers</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-gray-500">
          <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
          <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
          <li><a href="#" className="hover:text-indigo-600">Support</a></li>
          <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
        <p className="text-xs text-gray-400 mb-4">Subscribe for latest updates & offers.</p>
        <div className="flex bg-gray-50 p-1.5 rounded-full ring-1 ring-gray-200">
          <input type="email" placeholder="Email address" className="bg-transparent text-sm px-4 outline-none w-full" />
          <button className="bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 border-t border-gray-100 mt-12 pt-8 text-center text-xs text-gray-400">
      &copy; {new Date().getFullYear()} LuminaBazaar. Built with precision for modern shoppers.
    </div>
  </footer>
);

const Logout = () => {
  useEffect(() => {
    removeToken();
    window.location.href = '/#/';
  }, []);
  return null;
};

/* Fix: Making children optional to satisfy TS when component is used as a wrapper in JSX props like 'element' */
const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  // Simple trigger for global updates
  const refreshCart = () => {
    // Logic to update cart count based on API would go here
    // For this build, we'll keep it static or rely on local persistence
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/shippingaddress" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/complete" element={<PrivateRoute><OrderStatusPage /></PrivateRoute>} />
            <Route path="/order" element={<PrivateRoute><OrderStatusPage /></PrivateRoute>} />
            <Route path="/category" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
            <Route path="/productlist" element={<PrivateRoute><ProductListPage /></PrivateRoute>} />
            <Route path="/createproduct" element={<PrivateRoute><CreateProductPage /></PrivateRoute>} />
            <Route path="/updateproduct/:id" element={<PrivateRoute><UpdateProductPage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderStatusPage isAdmin /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

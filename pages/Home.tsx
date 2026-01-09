
import React, { useState, useEffect } from 'react';
import { productApi, categoryApi } from '../api';
import { Product, Category } from '../types';
import { Filter, ChevronDown, ShoppingBag, Zap, Award, ShieldCheck, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: [] as string[], price: [0, 100000] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([productApi.list(), categoryApi.list()]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterToggle = (cid: string) => {
    const current = [...filters.category];
    const index = current.indexOf(cid);
    if (index === -1) current.push(cid);
    else current.splice(index, 1);
    
    const newFilters = { ...filters, category: current };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = async (f: any) => {
    setLoading(true);
    try {
      const res = await productApi.filter(f);
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 mb-16 h-[500px]">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-indigo-900 to-transparent z-10"></div>
        <img 
          src="https://picsum.photos/1200/600?grayscale" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero Banner"
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-12 md:w-2/3">
          <span className="inline-block px-4 py-1.5 bg-indigo-600/30 backdrop-blur-md text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Lumina Exclusive
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Illuminate Your <br/> <span className="text-indigo-400">Digital Life.</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            Discover the latest electronics and home technology with LuminaBazaar. Premium quality, best prices.
          </p>
          <div className="flex space-x-4">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl active:scale-95">
              Shop Now
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-indigo-600" /> Filters
            </h3>
            <button className="text-xs font-medium text-indigo-600 hover:underline" onClick={loadData}>Reset</button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Categories</h4>
            <div className="space-y-2">
              {categories.map(c => (
                <label key={c._id} className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${filters.category.includes(c._id) ? 'bg-indigo-600 border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-gray-300 bg-white group-hover:border-indigo-400'}`}>
                    {filters.category.includes(c._id) && <Award size={12} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    onChange={() => handleFilterToggle(c._id)}
                    checked={filters.category.includes(c._id)}
                  />
                  <span className={`text-sm font-medium transition-colors ${filters.category.includes(c._id) ? 'text-gray-900' : 'text-gray-500 group-hover:text-indigo-600'}`}>
                    {c.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
             <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Price Range</h4>
             <div className="space-y-4">
                <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>$0</span>
                  <span>$2500+</span>
                </div>
             </div>
          </div>
          
          {/* Trust Badges */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
              <ShieldCheck className="text-indigo-600" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-900">Secure Payment</p>
                <p className="text-[10px] text-gray-500">Verified transaction</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
              <Zap className="text-emerald-600" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-900">Instant Delivery</p>
                <p className="text-[10px] text-gray-500">Digital products ready</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                  type="text" 
                  placeholder="Search Lumina..." 
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none w-64" 
                 />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Fix: Use React.FC to handle key props correctly in TypeScript excess property checks */
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-indigo-100 relative overflow-hidden">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
        <img 
          src={productApi.getPhotoUrl(product._id)} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.quantity > 0 ? (
          <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold text-gray-900 uppercase">In Stock</span>
        ) : (
          <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase shadow-lg">Sold Out</span>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        </div>
        <p className="text-gray-500 text-xs line-clamp-1 h-4">{product.desc}</p>
        
        <div className="pt-4 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 font-medium">Price</p>
            <p className="text-xl font-bold text-gray-900 tracking-tight">${product.price.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center transition-transform duration-300 transform group-hover:scale-110 group-active:scale-95 shadow-lg shadow-indigo-100">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;

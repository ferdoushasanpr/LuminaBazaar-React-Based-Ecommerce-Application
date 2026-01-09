
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, cartApi, getAuthData, isAuthenticated } from '../api';
import { Product } from '../types';
import { ChevronLeft, ShoppingCart, Shield, Truck, RotateCcw, Star, Plus, Minus, Heart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const auth = getAuthData();

  useEffect(() => {
    if (id) {
      productApi.getById(id).then(res => {
        setProduct(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  const addToCart = async () => {
    if (!isAuthenticated()) return navigate('/login');
    if (!product) return;

    setAdding(true);
    try {
      await cartApi.add({
        product: product._id,
        price: product.price,
        user: auth?.decoded.id
      });
      // Animation trigger would happen here
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  if (loading || !product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 mb-8 group transition-colors">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100/50 p-12 ring-1 ring-gray-100">
            <img 
              src={productApi.getPhotoUrl(product._id)} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white rounded-2xl border border-gray-100 p-3 cursor-pointer hover:border-indigo-400 transition-all opacity-60 hover:opacity-100">
                <img src={`https://picsum.photos/200/200?random=${i}`} className="w-full h-full object-contain" alt="thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">{product.category.name}</span>
               <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} className="text-gray-200" fill="currentColor" />
                  <span className="text-gray-400 text-xs font-bold ml-1">(4.0)</span>
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-indigo-600 tracking-tight">${product.price.toLocaleString()}</p>
            <p className="text-gray-500 leading-relaxed text-lg">{product.desc}</p>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-100 p-1 rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-indigo-600 shadow-sm"><Minus size={16} /></button>
                <span className="px-6 text-lg font-bold text-gray-900">{qty}</span>
                <button onClick={() => setQty(Math.min(product.quantity, qty + 1))} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-indigo-600 shadow-sm"><Plus size={16} /></button>
              </div>
              <p className="text-sm font-medium text-gray-400">{product.quantity} units available</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={addToCart}
                disabled={adding || product.quantity === 0}
                className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none"
              >
                {adding ? <Loader2 className="animate-spin" size={24} /> : <ShoppingCart size={24} />}
                {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="w-16 h-16 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 group">
                <Heart size={28} className="group-hover:fill-current" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-600"><Truck size={20} /></div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Free Shipping</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-600"><RotateCcw size={20} /></div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">30 Day Returns</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-600"><Shield size={20} /></div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure Warranty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default ProductDetails;

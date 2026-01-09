
import React, { useState, useEffect } from 'react';
import { cartApi, productApi } from '../api';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await cartApi.get();
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > 5) return;
    try {
      await cartApi.update(item._id, { ...item, quantity: newQty });
      loadCart();
    } catch (e) { console.error(e); }
  };

  const removeItem = async (id: string) => {
    try {
      await cartApi.remove(id);
      loadCart();
    } catch (e) { console.error(e); }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Updating Cart...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        <ShoppingBag className="text-indigo-600" /> Your Shopping Bag
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-200">
           <p className="text-gray-400 font-medium mb-6">Your bag is empty. Start adding some magic!</p>
           <Link to="/" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-100 inline-block transition-all">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex items-center gap-6 group transition-all hover:shadow-md">
                <div className="w-24 h-24 bg-gray-50 rounded-2xl p-2 shrink-0">
                  <img src={productApi.getPhotoUrl(item.product._id)} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow">
                   <h3 className="font-bold text-gray-900 text-lg mb-1">{item.product.name}</h3>
                   <p className="text-sm font-semibold text-indigo-600">${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center bg-gray-50 p-1 rounded-full ring-1 ring-gray-100">
                   <button onClick={() => updateQuantity(item, -1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-indigo-600 transition-colors"><Minus size={14} /></button>
                   <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item, 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-indigo-600 transition-colors"><Plus size={14} /></button>
                </div>
                <div className="text-right min-w-[100px]">
                   <p className="text-lg font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                   <button onClick={() => removeItem(item._id)} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 justify-end mt-1">
                      <Trash2 size={12} /> Remove
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-50">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Order Summary</h2>
              <div className="space-y-4">
                 <div className="flex justify-between text-gray-500 font-medium">
                   <span>Subtotal</span>
                   <span>${subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 font-medium">
                   <span>Shipping</span>
                   <span className="text-emerald-500 font-bold">FREE</span>
                 </div>
                 <div className="pt-6 border-t border-gray-100 flex justify-between">
                   <span className="text-lg font-bold text-gray-900">Total</span>
                   <span className="text-2xl font-black text-gray-900">${subtotal.toLocaleString()}</span>
                 </div>
              </div>
              <Link to="/shippingaddress" className="w-full mt-10 py-5 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
            </div>
            <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center gap-4">
               <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                  <Shield size={20} />
               </div>
               <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest leading-tight">Secure checkout powered by Stripe</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Shield = ({ size, className }: { size?: number, className?: string }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

export default CartPage;

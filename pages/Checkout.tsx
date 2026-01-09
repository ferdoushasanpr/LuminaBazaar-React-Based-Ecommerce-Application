
import React, { useState, useEffect } from 'react';
import { cartApi, profileApi, paymentApi, getAuthData, productApi } from '../api';
import { CartItem } from '../types';
import { CreditCard, ShoppingBag, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';

const CheckoutPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuthData();

  useEffect(() => {
    Promise.all([cartApi.get(), profileApi.get()]).then(([cRes, pRes]) => {
      setItems(cRes.data);
      setProfile(pRes.data);
      setLoading(false);
    });
  }, []);

  const handlePayment = async () => {
    try {
      const res = await paymentApi.createSession({ orderItems: items });
      if (res.data.url) window.location.href = res.data.url;
    } catch (e) {
      console.error(e);
    }
  };

  const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Preparing checkout...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
       <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
         <div className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
           <span className="text-sm font-bold text-emerald-500">Address</span>
         </div>
         <div className="h-[2px] w-12 bg-emerald-100 shrink-0"></div>
         <div className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-indigo-100">2</div>
           <span className="text-sm font-bold text-gray-900">Payment</span>
         </div>
         <div className="h-[2px] w-12 bg-gray-100 shrink-0"></div>
         <div className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">3</div>
           <span className="text-sm font-semibold text-gray-400">Confirm</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-indigo-600" size={20} /> Shipping Destination
             </h2>
             <div className="p-6 bg-gray-50 rounded-2xl text-gray-600 border border-gray-100 space-y-2">
               <p className="font-bold text-gray-900">{auth?.decoded.name}</p>
               <p>{profile.address1}, {profile.address2}</p>
               <p>{profile.city}, {profile.postcode}</p>
               <p className="font-medium">{profile.country}</p>
               <div className="pt-2 flex items-center gap-2 text-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase">Phone:</span>
                  <span className="text-gray-900 font-semibold">{profile.phone}</span>
               </div>
             </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <ShoppingBag className="text-indigo-600" size={20} /> Review Items
              </h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl p-1.5 ring-1 ring-gray-100">
                        <img src={productApi.getPhotoUrl(item.product._id)} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.product.name}</p>
                        <p className="text-xs font-medium text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Total</h2>
              <div className="space-y-4 mb-8">
                 <div className="flex justify-between text-gray-500 font-medium">
                   <span>Items Total</span>
                   <span>${total.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 font-medium">
                   <span>Shipping</span>
                   <span className="text-emerald-500 font-bold">FREE</span>
                 </div>
                 <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                   <span className="text-lg font-bold text-gray-900">Final Price</span>
                   <span className="text-3xl font-black text-indigo-600">${total.toLocaleString()}</span>
                 </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
              >
                Pay with <CreditCard size={20} />
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-emerald-500 bg-emerald-50 py-3 rounded-2xl">
                 <ShieldCheck size={18} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Safe & Encrypted</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

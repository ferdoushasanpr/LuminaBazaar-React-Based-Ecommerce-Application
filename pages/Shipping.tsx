
import React, { useState, useEffect } from 'react';
import { profileApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Home, Globe, Mail, ChevronRight, Loader2 } from 'lucide-react';

const ShippingPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    profileApi.get().then(res => {
      if (res.data) setFormData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.update(formData);
      navigate('/checkout');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Fetching your profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
         <div className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-indigo-100">1</div>
           <span className="text-sm font-bold text-gray-900">Address</span>
         </div>
         <div className="h-[2px] w-12 bg-gray-100 shrink-0"></div>
         <div className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">2</div>
           <span className="text-sm font-semibold text-gray-400">Payment</span>
         </div>
         <div className="h-[2px] w-12 bg-gray-100 shrink-0"></div>
         <div className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">3</div>
           <span className="text-sm font-semibold text-gray-400">Confirm</span>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">
        <div className="flex items-center gap-4 mb-10">
           <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
             <MapPin size={24} />
           </div>
           <div>
             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Delivery Address</h1>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Where should we send your Lumina products?</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input name="country" type="text" required value={formData.country} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none" placeholder="United States" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Street Address</label>
            <div className="relative">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input name="address1" type="text" required value={formData.address1} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none" placeholder="123 Luxury Avenue" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Apartment, suite, etc. (Optional)</label>
            <input name="address2" type="text" value={formData.address2} onChange={handleChange} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none" placeholder="Suite 404" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">City</label>
              <input name="city" type="text" required value={formData.city} onChange={handleChange} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none" placeholder="New York" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Postcode</label>
              <input name="postcode" type="number" required value={formData.postcode} onChange={handleChange} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none" placeholder="10001" />
            </div>
          </div>

          <button
            disabled={saving}
            type="submit"
            className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:bg-gray-400"
          >
            {saving ? <Loader2 size={24} className="animate-spin" /> : (
              <>
                Save & Continue to Payment <ChevronRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;

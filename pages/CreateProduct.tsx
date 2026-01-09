
import React, { useState, useEffect } from 'react';
import { categoryApi, productApi } from '../api';
import { Category } from '../types';
import { useNavigate } from 'react-router-dom';
import { Image, Upload, Package, CheckCircle, AlertCircle, PlusCircle } from 'lucide-react';

const CreateProductPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    price: '',
    quantity: '',
    category: '',
    photo: null as File | null
  });
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.list().then(res => setCategories(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'file' ? (e.target as any).files[0] : e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    /* Fix: Cast val to any to satisfy FormData.append overload requirements for string | Blob */
    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key, val as any);
    });

    try {
      await productApi.create(data);
      setSuccess('Product published successfully!');
      setTimeout(() => navigate('/productlist'), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 space-y-1 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Create Listing</h1>
        <p className="text-gray-500 font-medium italic">Share your products with the Lumina community</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Product Name</label>
                <input name="name" required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-900" placeholder="e.g. Lumina Pro 2023" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                <textarea name="desc" rows={4} required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-gray-700 resize-none" placeholder="Describe the features and condition..." />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Price ($)</label>
                  <input name="price" type="number" required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Stock Units</label>
                  <input name="quantity" type="number" required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold" placeholder="10" />
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                <select name="category" required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold appearance-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Cover Photo</label>
                <div className="relative group cursor-pointer aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center p-6 text-center">
                  <input type="file" name="photo" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <Upload className="text-gray-300 group-hover:text-indigo-400 mb-4 transition-colors" size={48} />
                  <p className="text-xs font-bold text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Click to Upload</p>
                  <p className="text-[10px] text-gray-400 mt-2">PNG, JPG or WebP up to 5MB</p>
                  {formData.photo && <div className="mt-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold">File Selected: {formData.photo.name}</div>}
                </div>
              </div>

              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-emerald-100">
                  <CheckCircle size={20} /> {success}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : (
                  <>
                    <PlusCircle size={22} /> Publish Product
                  </>
                )}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;

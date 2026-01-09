
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryApi, productApi } from '../api';
import { Category, Product } from '../types';
import { Edit3, Upload, CheckCircle, Loader2, Package } from 'lucide-react';

const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<any>({
    name: '',
    desc: '',
    price: '',
    quantity: '',
    category: '',
    photo: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      Promise.all([categoryApi.list(), productApi.getById(id)]).then(([cRes, pRes]) => {
        setCategories(cRes.data);
        const p = pRes.data;
        setFormData({
          name: p.name,
          desc: p.desc,
          price: p.price,
          quantity: p.quantity,
          category: p.category._id || p.category,
        });
        setLoading(false);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'file' ? (e.target as any).files[0] : e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key, val as any);
    });

    try {
      await productApi.update(id, data);
      setSuccess('Product updated successfully!');
      setTimeout(() => navigate('/productlist'), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Loading product details...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Product</h1>
        <p className="text-gray-500 font-medium">Update inventory details for <span className="text-indigo-600 font-bold">{formData.name}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Product Name</label>
                <input name="name" value={formData.name} required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-900" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                <textarea name="desc" value={formData.desc} rows={5} required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-gray-700" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Price ($)</label>
                  <input name="price" value={formData.price} type="number" required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Stock Units</label>
                  <input name="quantity" value={formData.quantity} type="number" required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold" />
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                <select name="category" value={formData.category} required onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold appearance-none">
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Replace Photo</label>
                <div className="relative group cursor-pointer aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center p-6 text-center">
                  <input type="file" name="photo" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <Upload className="text-gray-300 group-hover:text-indigo-400 mb-4 transition-colors" size={32} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to Change Image</p>
                  {formData.photo && <div className="mt-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold truncate max-w-full">{formData.photo.name}</div>}
                </div>
              </div>

              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-emerald-100">
                  <CheckCircle size={20} /> {success}
                </div>
              )}

              <button 
                disabled={saving}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:bg-gray-400"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <Edit3 size={20} /> Update Product
                  </>
                )}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductPage;

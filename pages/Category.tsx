
import React, { useState, useEffect } from 'react';
import { categoryApi } from '../api';
import { Category } from '../types';
import { Plus, Trash2, Tag, Info } from 'lucide-react';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.list();
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await categoryApi.create({ name });
      setName('');
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete category? All associated products may be affected.')) return;
    try {
      await categoryApi.delete(id);
      loadCategories();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Category Management</h1>
        <p className="text-sm font-medium text-gray-500">Organize your store catalog</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Create */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-3 mb-6 text-indigo-600">
             <Tag size={20} />
             <h2 className="text-lg font-bold">New Category</h2>
          </div>
          {error && <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
             <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="E.g. Electronics" 
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
             />
             <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]">
               <Plus size={20} /> Create Category
             </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
           {categories.map(c => (
             <div key={c._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex justify-between items-center group hover:border-indigo-100 transition-all">
               <span className="font-bold text-gray-900 tracking-tight capitalize">{c.name}</span>
               <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                 <Trash2 size={18} />
               </button>
             </div>
           ))}
           {categories.length === 0 && !loading && (
             <div className="p-12 text-center text-gray-300 italic">No categories created yet.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

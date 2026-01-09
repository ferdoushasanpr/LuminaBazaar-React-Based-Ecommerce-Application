
import React, { useState, useEffect } from 'react';
import { productApi } from '../api';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Trash2, Edit2, Check, X, Package, Search } from 'lucide-react';

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productApi.list();
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await productApi.delete(id);
      loadProducts();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Inventory</h1>
          <p className="text-sm font-medium text-gray-500">Manage your store products and stock status</p>
        </div>
        <Link to="/createproduct" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
           <Package size={20} /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p._id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl p-1 shrink-0 ring-1 ring-gray-100 overflow-hidden">
                        <img src={productApi.getPhotoUrl(p._id)} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-gray-600">${p.price.toLocaleString()}</td>
                  <td className="px-8 py-5 text-sm font-semibold text-gray-600">{p.quantity}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {p.quantity > 0 ? <Check size={12} /> : <X size={12} />}
                      {p.quantity > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <Link to={`/updateproduct/${p._id}`} className="p-2 text-gray-400 hover:text-indigo-600 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all"><Edit2 size={16} /></Link>
                       <button onClick={() => deleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;

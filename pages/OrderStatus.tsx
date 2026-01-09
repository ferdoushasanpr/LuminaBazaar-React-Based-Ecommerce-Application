
import React, { useState, useEffect } from 'react';
import { orderApi } from '../api';
import { Clock, CheckCircle, Package, ExternalLink, Trash2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderStatusPage = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      const res = isAdmin ? await orderApi.listAll() : await orderApi.listByUser();
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (order: any) => {
    if (!isAdmin) return;
    try {
      await orderApi.update(order._id, { done: !order.done });
      loadOrders();
    } catch (e) { console.error(e); }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Delete this order record?')) return;
    try {
      await orderApi.delete(id);
      loadOrders();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{isAdmin ? 'Order Management' : 'My Orders'}</h1>
          <p className="text-sm font-medium text-gray-500">History and tracking information</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
             <Package size={20} />
          </div>
          <span className="text-sm font-bold text-gray-900">{orders.length} Total Orders</span>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${order.done ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                       {order.done ? <CheckCircle size={14} /> : <Clock size={14} />}
                       {order.done ? 'Delivered' : 'In Transit'}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: <span className="text-gray-900 font-mono">{order._id.slice(-8)}</span></span>
                 </div>
                 
                 <div className="space-y-2">
                   {order.product.map((p: any) => (
                     <div key={p.productId} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-[10px]">
                           x{p.quantity}
                        </div>
                        <span className="text-sm font-bold text-gray-900 tracking-tight">Premium Item {p.productId.slice(-4)}</span>
                        <span className="text-xs font-medium text-gray-400 font-mono">${p.price.toLocaleString()} ea</span>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="flex flex-col md:items-end justify-between gap-4">
                 <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Total</p>
                    <p className="text-3xl font-black text-indigo-600">${order.total?.toLocaleString() || order.price?.toLocaleString()}</p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    {isAdmin ? (
                      <>
                        <div className="flex items-center gap-2 mr-4 text-xs font-bold text-gray-400">
                           <Mail size={14} /> {order.user.email}
                        </div>
                        <button onClick={() => toggleStatus(order)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.done ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                           {order.done ? 'Mark Pending' : 'Mark Delivered'}
                        </button>
                        <button onClick={() => deleteOrder(order._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                           <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all">
                        <ExternalLink size={14} /> Tracking Details
                      </button>
                    )}
                 </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
               <span>Ordered on {new Date(order.createdAt || order.time).toLocaleDateString()}</span>
               <span>Estimated Arrival: 3-5 Business Days</span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-200">
             <p className="text-gray-400 font-medium">No order history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;

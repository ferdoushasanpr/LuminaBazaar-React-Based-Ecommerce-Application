
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthData } from '../api';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  ShoppingBag, 
  List, 
  PlusCircle, 
  User as UserIcon,
  Mail,
  Shield,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

const Sidebar = ({ role }: { role: string }) => {
  const links = role === 'admin' 
    ? [
        { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
        { label: 'Products', to: '/productlist', icon: Package },
        { label: 'Categories', to: '/category', icon: List },
        { label: 'New Product', to: '/createproduct', icon: PlusCircle },
        { label: 'All Orders', to: '/orders', icon: ShoppingBag },
      ]
    : [
        { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
        { label: 'My Cart', to: '/cart', icon: ShoppingBag },
        { label: 'My Orders', to: '/order', icon: Clock },
      ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
      <div className="space-y-2">
        {links.map((link) => (
          <Link 
            key={link.to} 
            to={link.to}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group"
          >
            <link.icon size={20} className="group-hover:scale-110 transition-transform" />
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

const DashboardPage = () => {
  const auth = getAuthData();
  if (!auth) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <Sidebar role={auth.decoded.role} />
        
        <main className="flex-grow space-y-12">
          <header className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500">Welcome back, <span className="text-indigo-600 font-bold">{auth.decoded.name}</span></p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
                <p className="text-2xl font-black text-gray-900">$1,240.00</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Orders</p>
                <p className="text-2xl font-black text-gray-900">3</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items in Cart</p>
                <p className="text-2xl font-black text-gray-900">5</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Your Lumina Profile</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-400">
                    <Mail size={20} className="text-indigo-400" />
                    <span>{auth.decoded.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <Shield size={20} className="text-indigo-400" />
                    <span className="capitalize">{auth.decoded.role} Account</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2">
                  Edit Profile <ArrowRight size={18} />
                </button>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="w-40 h-40 bg-indigo-500/20 rounded-full flex items-center justify-center border-4 border-indigo-500/30">
                   <UserIcon size={80} className="text-indigo-400" />
                </div>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

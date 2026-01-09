
import React, { useState } from 'react';
import { authApi, setToken } from '../api';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Info } from 'lucide-react';

const LoginPage = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = mode === 'signIn' 
        ? await authApi.signIn({ email: formData.email, password: formData.password })
        : await authApi.signUp(formData);
      
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            {mode === 'signIn' ? 'Welcome Back' : 'Join Lumina'}
          </h1>
          <p className="text-gray-500 font-medium">
            {mode === 'signIn' ? 'Sign in to access your dashboard' : 'Create an account to start shopping'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <Info size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signUp' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                {mode === 'signIn' && <a href="#" className="text-xs font-semibold text-indigo-600 hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {mode === 'signIn' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {mode === 'signIn' ? "Don't have an account? " : "Already have an account? "}
              <span className="text-indigo-600 font-bold">{mode === 'signIn' ? 'Sign Up' : 'Log In'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

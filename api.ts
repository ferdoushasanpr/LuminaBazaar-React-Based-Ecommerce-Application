
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://luminabazaar.onrender.com';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const getAuthData = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return {
      token,
      decoded: jwtDecode(token) as any
    };
  } catch (e) {
    return null;
  }
};

export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signIn: (data: any) => api.post('/user/signIn', data),
  signUp: (data: any) => api.post('/user/signUp', data)
};

export const productApi = {
  list: () => api.get('/product/'),
  getById: (id: string) => api.get(`/product/${id}`),
  create: (data: FormData) => api.post('/product/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: FormData) => api.put(`/product/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/product/${id}`),
  filter: (filters: any) => api.post('/product/filter', filters),
  getPhotoUrl: (id: string) => `${BASE_URL}/product/getPhoto/${id}`
};

export const categoryApi = {
  list: () => api.get('/category/'),
  create: (data: any) => api.post('/category/', data),
  delete: (id: string) => api.delete(`/category/${id}`)
};

export const cartApi = {
  get: () => api.get('/cart/'),
  add: (data: any) => api.post('/cart/', data),
  update: (id: string, data: any) => api.put(`/cart/${id}`, data),
  remove: (id: string) => api.delete(`/cart/${id}`)
};

export const orderApi = {
  listByUser: () => api.get('/order/'),
  listAll: () => api.get('/order/orders/'),
  create: (data: any) => api.post('/order/', data),
  update: (id: string, data: any) => api.put(`/order/${id}`, data),
  delete: (id: string) => api.delete(`/order/${id}`)
};

export const profileApi = {
  get: () => api.get('/profile/getprofile'),
  update: (data: any) => api.post('/profile/setprofile', data)
};

export const paymentApi = {
  createSession: (data: any) => api.post('/payment/create-checkout-session', data)
};

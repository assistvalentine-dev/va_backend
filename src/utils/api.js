import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- USER APIs ----------
export const createUser = async (userData) => {
  const response = await api.post('/users/create', userData);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post('/users/verify-otp', data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await api.post('/users/resend-otp', data);
  return response.data;
};

// ---------- PAYMENT APIs ----------
export const createPaymentOrder = async (userId, amount) => {
  const response = await api.post('/payments/create-order', {
    userId,
    amount,
  });
  return response.data;
};

export const verifyPayment = async (userId, paymentData) => {
  const response = await api.post('/payments/verify', {
    userId,
    ...paymentData,
  });
  return response.data;
};

export default api;

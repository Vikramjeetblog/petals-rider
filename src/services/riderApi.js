import axios from 'axios';

const BACKEND_URL = 'https://petals-backend-dni0.onrender.com';

let authToken = null;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

api.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export function setAuthToken(token) {
  authToken = token;
}

export const requestRiderOtp = phone =>
  api.post('/rider/auth/request-otp', {
    phone,
  });

export const verifyRiderOtp = ({ phone, otp }) =>
  api.post('/rider/auth/verify-otp', {
    phone,
    otp,
  });

export const fetchAssignedOrders = () =>
  api.get('/rider/orders');

export default api;

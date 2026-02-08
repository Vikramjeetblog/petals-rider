import axios from 'axios';

const api = axios.create({
  baseURL: 'https://YOUR_BACKEND_URL',
  timeout: 10000,
});

// attach token if using auth context
api.interceptors.request.use(config => {
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchAssignedOrders = () =>
  api.get('/rider/orders');

export default api;

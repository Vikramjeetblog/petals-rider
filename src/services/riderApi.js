import axios from 'axios';

const BACKEND_URL = 'https://petals-backend-dni0.onrender.com';
const RIDER_API_BASE = '/api/v1/rider';

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

function riderPath(path) {
  return `${RIDER_API_BASE}${path}`;
}

async function request(method, path, data, config) {
  const response = await api({
    method,
    url: riderPath(path),
    data,
    ...config,
  });

  return response?.data;
}

export function setAuthToken(token) {
  authToken = token;
}

// 1) Rider Auth APIs
export const requestRiderOtp = phone => request('post', '/auth/request-otp', { phone });

export const verifyRiderOtp = ({ phone, otp }) => request('post', '/auth/verify-otp', { phone, otp });

export const logoutRider = () => request('post', '/auth/logout');

export const fetchRiderMe = () => request('get', '/auth/me');

// 2) Rider Profile & Availability
export const fetchRiderProfile = () => request('get', '/profile');

export const updateRiderProfile = payload => request('patch', '/profile', payload);

export const updateRiderLocation = payload => request('post', '/location', payload);

export const updateRiderAvailability = payload => request('patch', '/availability', payload);

export const fetchSensitiveInfo = () => request('get', '/sensitive-info');

export const updateSensitiveInfo = payload => request('patch', '/sensitive-info', payload);

// 3) Rider Order APIs
export const fetchAssignedOrders = query =>
  request('get', '/orders', undefined, { params: query });

export const fetchOrderDetails = orderId => request('get', `/orders/${orderId}`);

export const verifyPickupOtp = (orderId, payload) =>
  request('post', `/orders/${orderId}/pickup/verify-otp`, payload);

export const updateOrderStatus = (orderId, payload) =>
  request('post', `/orders/${orderId}/status`, payload);

export const verifyDeliveryOtp = (orderId, payload) =>
  request('post', `/orders/${orderId}/delivery/verify-otp`, payload);

export const uploadDeliveryProof = (orderId, payload) =>
  request('post', `/orders/${orderId}/delivery-proof`, payload);

// 4) Earnings / Wallet / Payouts
export const fetchEarningsSummary = () => request('get', '/earnings/summary');

export const fetchEarningsActivity = query =>
  request('get', '/earnings/activity', undefined, { params: query });

export const fetchWallet = () => request('get', '/wallet');

export const fetchPayouts = query => request('get', '/payouts', undefined, { params: query });

export const withdrawPayout = payload => request('post', '/payouts/withdraw', payload);

// 5) Bank Account APIs
export const fetchBankAccounts = () => request('get', '/bank-accounts');

export const createBankAccount = payload => request('post', '/bank-accounts', payload);

export const deleteBankAccount = bankAccountId =>
  request('delete', `/bank-accounts/${bankAccountId}`);

// 6) KYC & Onboarding APIs
export const fetchKycStatus = () => request('get', '/kyc/status');

export const uploadKycDocuments = payload => request('post', '/kyc/documents', payload);

export const uploadKycSelfie = payload => request('post', '/kyc/selfie', payload);

export const fetchOnboardingChecklist = () => request('get', '/onboarding/checklist');

export const completeOnboardingTask = taskId =>
  request('post', `/onboarding/checklist/${taskId}/complete`);

// 7) Notifications / Support / Safety APIs
export const fetchNotifications = query =>
  request('get', '/notifications', undefined, { params: query });

export const markNotificationRead = id => request('patch', `/notifications/${id}/read`);

export const fetchNotificationById = id => request('get', `/notifications/${id}`);

export const createSupportIssue = payload => request('post', '/support/issues', payload);

export const fetchSafetyTraining = () => request('get', '/safety/training');

export default api;

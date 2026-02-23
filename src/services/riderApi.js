import axios from 'axios';
import { API_ROUTES, RIDER_API_BASE } from '../constants/apiRoutes';

const BACKEND_URL = 'https://petals-backend-dni0.onrender.com';

let authToken = null;
let unauthorizedHandler = null;
let apiErrorHandler = null;

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

api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    if (apiErrorHandler) {
      apiErrorHandler(normalizeApiError(error));
    }

    return Promise.reject(error);
  }
);

function riderPath(path) {
  return `${RIDER_API_BASE}${path}`;
}

function asMultipartConfig(config) {
  return {
    ...config,
    headers: {
      ...(config?.headers || {}),
      'Content-Type': 'multipart/form-data',
    },
  };
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

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function setApiErrorHandler(handler) {
  apiErrorHandler = handler;
}

export function normalizeApiError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    (status === 500 ? 'Server error. Please try again.' : null) ||
    (status === 401 ? 'Session expired. Please login again.' : null) ||
    error?.message ||
    'Something went wrong.';

  return { status, message, raw: error };
}

// 1) Rider Auth APIs
export const requestRiderOtp = phone => request('post', API_ROUTES.auth.requestOtp, { phone });

export const verifyRiderOtp = ({ phone, otp }) =>
  request('post', API_ROUTES.auth.verifyOtp, { phone, otp });

export const logoutRider = () => request('post', API_ROUTES.auth.logout);

export const fetchRiderMe = () => request('get', API_ROUTES.auth.me);

// 2) Rider Profile & Availability
export const fetchRiderProfile = () => request('get', API_ROUTES.profile.root);

export const updateRiderProfile = payload => request('patch', API_ROUTES.profile.root, payload);

export const updateRiderLocation = payload => request('post', API_ROUTES.profile.location, payload);

export const updateRiderAvailability = payload =>
  request('patch', API_ROUTES.profile.availability, payload);

export const fetchSensitiveInfo = () => request('get', API_ROUTES.profile.sensitiveInfo);

export const updateSensitiveInfo = payload =>
  request('patch', API_ROUTES.profile.sensitiveInfo, payload);

// 3) Rider Order APIs
export const fetchAssignedOrders = query =>
  request('get', API_ROUTES.orders.root, undefined, { params: query });

export const fetchOrderDetails = orderId => request('get', `${API_ROUTES.orders.root}/${orderId}`);

export const verifyPickupOtp = (orderId, payload) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/pickup/verify-otp`, payload);

export const updateOrderStatus = (orderId, payload) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/status`, payload);

export const verifyDeliveryOtp = (orderId, payload) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/delivery/verify-otp`, payload);

export const uploadDeliveryProof = (orderId, payload) =>
  request(
    'post',
    `${API_ROUTES.orders.root}/${orderId}/delivery-proof`,
    payload,
    asMultipartConfig()
  );

// 4) Earnings / Wallet / Payouts
export const fetchEarningsSummary = () => request('get', API_ROUTES.earnings.summary);

export const fetchEarningsActivity = query =>
  request('get', API_ROUTES.earnings.activity, undefined, { params: query });

export const fetchWallet = () => request('get', API_ROUTES.wallet.root);

export const fetchPayouts = query => request('get', API_ROUTES.payouts.root, undefined, { params: query });

export const withdrawPayout = payload => request('post', API_ROUTES.payouts.withdraw, payload);

// 5) Bank Account APIs
export const fetchBankAccounts = () => request('get', API_ROUTES.bankAccounts.root);

export const createBankAccount = payload => request('post', API_ROUTES.bankAccounts.root, payload);

export const deleteBankAccount = bankAccountId =>
  request('delete', `${API_ROUTES.bankAccounts.root}/${bankAccountId}`);

// 6) KYC & Onboarding APIs
export const fetchKycStatus = () => request('get', API_ROUTES.kyc.status);

export const uploadKycDocuments = payload =>
  request('post', API_ROUTES.kyc.documents, payload, asMultipartConfig());

export const uploadKycSelfie = payload =>
  request('post', API_ROUTES.kyc.selfie, payload, asMultipartConfig());

export const fetchOnboardingChecklist = () => request('get', API_ROUTES.onboarding.checklist);

export const completeOnboardingTask = taskId =>
  request('post', `${API_ROUTES.onboarding.checklist}/${taskId}/complete`);

// 7) Notifications / Support / Safety APIs
export const fetchNotifications = query =>
  request('get', API_ROUTES.notifications.root, undefined, { params: query });

export const markNotificationRead = id =>
  request('patch', `${API_ROUTES.notifications.root}/${id}/read`);

export const fetchNotificationById = id => request('get', `${API_ROUTES.notifications.root}/${id}`);

export const createSupportIssue = payload => request('post', API_ROUTES.support.issues, payload);

export const fetchSafetyTraining = () => request('get', API_ROUTES.safety.training);

export default api;

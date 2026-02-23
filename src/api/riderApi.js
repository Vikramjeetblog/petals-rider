import axios from 'axios';
import { API_ROUTES, RIDER_API_BASE } from '../constants/apiRoutes';

export const BACKEND_URL = 'https://petals-backend-dni0.onrender.com';

let authToken = null;
let unauthorizedHandler = null;
let apiErrorHandler = null;
let networkStatusHandler = null;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (networkStatusHandler) {
      networkStatusHandler(true);
    }
    return response;
  },
  (error) => {
    const normalized = normalizeApiError(error);

    if (normalized.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    if (normalized.isNetworkError && networkStatusHandler) {
      networkStatusHandler(false);
    }

    if (apiErrorHandler) {
      apiErrorHandler(normalized);
    }

    return Promise.reject(error);
  }
);

function riderPath(path) {
  return `${RIDER_API_BASE}${path}`;
}

function asMultipartConfig(config) {
  return {
    ...(config || {}),
    headers: {
      ...((config && config.headers) || {}),
      'Content-Type': 'multipart/form-data',
    },
  };
}

async function request(method, path, data, config) {
  const response = await api({
    method,
    url: riderPath(path),
    data,
    ...(config || {}),
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

export function setNetworkStatusHandler(handler) {
  networkStatusHandler = handler;
}

export function normalizeApiError(error) {
  const status = error?.response?.status;
  const isNetworkError = !status || error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';

  let message = error?.response?.data?.message;

  if (!message) {
    if (status === 401) {
      message = 'Session expired. Please login again.';
    } else if (status === 403) {
      message = 'Permission denied for this action.';
    } else if (status >= 500) {
      message = 'Server issue. Please try again shortly.';
    } else if (isNetworkError) {
      message = 'You are offline. Check your internet connection.';
    } else {
      message = 'Something went wrong. Please retry.';
    }
  }

  return { status, message, raw: error, isNetworkError };
}

export const requestRiderOtp = (phone, config) =>
  request('post', API_ROUTES.auth.requestOtp, { phone }, config);

export const verifyRiderOtp = ({ phone, otp }, config) =>
  request('post', API_ROUTES.auth.verifyOtp, { phone, otp }, config);

export const logoutRider = (config) => request('post', API_ROUTES.auth.logout, undefined, config);

export const fetchRiderMe = (config) => request('get', API_ROUTES.auth.me, undefined, config);

export const fetchRiderProfile = (config) => request('get', API_ROUTES.profile.root, undefined, config);

export const updateRiderProfile = (payload, config) =>
  request('patch', API_ROUTES.profile.root, payload, config);

export const updateRiderLocation = (payload, config) =>
  request('post', API_ROUTES.profile.location, payload, config);

export const updateRiderAvailability = (payload, config) =>
  request('patch', API_ROUTES.profile.availability, payload, config);

export const fetchSensitiveInfo = (config) =>
  request('get', API_ROUTES.profile.sensitiveInfo, undefined, config);

export const updateSensitiveInfo = (payload, config) =>
  request('patch', API_ROUTES.profile.sensitiveInfo, payload, config);

export const fetchAssignedOrders = (query, config) =>
  request('get', API_ROUTES.orders.root, undefined, { ...(config || {}), params: query });

export const fetchOrderDetails = (orderId, config) =>
  request('get', `${API_ROUTES.orders.root}/${orderId}`, undefined, config);

export const verifyPickupOtp = (orderId, payload, config) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/pickup/verify-otp`, payload, config);

export const updateOrderStatus = (orderId, payload, config) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/status`, payload, config);

export const verifyDeliveryOtp = (orderId, payload, config) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/delivery/verify-otp`, payload, config);

export const uploadDeliveryProof = (orderId, payload, config) =>
  request('post', `${API_ROUTES.orders.root}/${orderId}/delivery-proof`, payload, asMultipartConfig(config));

export const fetchEarningsSummary = (config) => request('get', API_ROUTES.earnings.summary, undefined, config);

export const fetchEarningsActivity = (query, config) =>
  request('get', API_ROUTES.earnings.activity, undefined, { ...(config || {}), params: query });

export const fetchWallet = (config) => request('get', API_ROUTES.wallet.root, undefined, config);

export const fetchPayouts = (query, config) =>
  request('get', API_ROUTES.payouts.root, undefined, { ...(config || {}), params: query });

export const withdrawPayout = (payload, config) =>
  request('post', API_ROUTES.payouts.withdraw, payload, config);

export const fetchBankAccounts = (config) => request('get', API_ROUTES.bankAccounts.root, undefined, config);

export const createBankAccount = (payload, config) =>
  request('post', API_ROUTES.bankAccounts.root, payload, config);

export const deleteBankAccount = (bankAccountId, config) =>
  request('delete', `${API_ROUTES.bankAccounts.root}/${bankAccountId}`, undefined, config);

export const fetchKycStatus = (config) => request('get', API_ROUTES.kyc.status, undefined, config);

export const uploadKycDocuments = (payload, config) =>
  request('post', API_ROUTES.kyc.documents, payload, asMultipartConfig(config));

export const uploadKycSelfie = (payload, config) =>
  request('post', API_ROUTES.kyc.selfie, payload, asMultipartConfig(config));

export const fetchOnboardingChecklist = (config) =>
  request('get', API_ROUTES.onboarding.checklist, undefined, config);

export const completeOnboardingTask = (taskId, config) =>
  request('post', `${API_ROUTES.onboarding.checklist}/${taskId}/complete`, undefined, config);

export const fetchNotifications = (query, config) =>
  request('get', API_ROUTES.notifications.root, undefined, { ...(config || {}), params: query });

export const markNotificationRead = (id, config) =>
  request('patch', `${API_ROUTES.notifications.root}/${id}/read`, undefined, config);

export const fetchNotificationById = (id, config) =>
  request('get', `${API_ROUTES.notifications.root}/${id}`, undefined, config);

export const createSupportIssue = (payload, config) =>
  request('post', API_ROUTES.support.issues, payload, config);

export const fetchSafetyTraining = (config) => request('get', API_ROUTES.safety.training, undefined, config);

export default api;

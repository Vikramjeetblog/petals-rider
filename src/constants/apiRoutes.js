export const RIDER_API_BASE = '/api/v1/rider';

export const API_ROUTES = {
  auth: {
    requestOtp: '/auth/request-otp',
    verifyOtp: '/auth/verify-otp',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  profile: {
    root: '/profile',
    location: '/location',
    availability: '/availability',
    sensitiveInfo: '/sensitive-info',
  },
  orders: {
    root: '/orders',
  },
  earnings: {
    summary: '/earnings/summary',
    activity: '/earnings/activity',
  },
  wallet: {
    root: '/wallet',
  },
  payouts: {
    root: '/payouts',
    withdraw: '/payouts/withdraw',
  },
  bankAccounts: {
    root: '/bank-accounts',
  },
  kyc: {
    status: '/kyc/status',
    documents: '/kyc/documents',
    selfie: '/kyc/selfie',
  },
  onboarding: {
    checklist: '/onboarding/checklist',
  },
  notifications: {
    root: '/notifications',
  },
  support: {
    issues: '/support/issues',
  },
  safety: {
    training: '/safety/training',
  },
};

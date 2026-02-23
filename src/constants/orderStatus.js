export const ORDER_STATUS = {
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING',
};

export const ACCEPTABLE_ORDER_STATUSES = [ORDER_STATUS.ASSIGNED, ORDER_STATUS.PENDING];

export const STATUS_COLOR_MAP = {
  [ORDER_STATUS.ASSIGNED]: '#2563EB',
  [ORDER_STATUS.PENDING]: '#2563EB',
  [ORDER_STATUS.ACCEPTED]: '#7C3AED',
  [ORDER_STATUS.PICKED_UP]: '#EA580C',
  [ORDER_STATUS.DELIVERED]: '#16A34A',
  [ORDER_STATUS.CANCELLED]: '#DC2626',
};

export function normalizeOrderStatus(status) {
  if (!status) return ORDER_STATUS.PENDING;
  return String(status).trim().toUpperCase().replace(/\s+/g, '_');
}

export const ORDER_TRANSITIONS = {
  [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PICKED_UP]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

export function canTransitionOrderStatus(currentStatus, nextStatus) {
  const current = normalizeOrderStatus(currentStatus);
  const next = normalizeOrderStatus(nextStatus);
  return (ORDER_TRANSITIONS[current] || []).includes(next);
}

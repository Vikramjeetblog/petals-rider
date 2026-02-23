import { useEffect, useRef } from 'react';

import { BACKEND_URL } from '../api/riderApi';
import { useAppStore } from '../store/AppStore';

const PING_INTERVAL_MS = 12000;

function subscribeNetInfo(onChange) {
  try {
    // optional dependency at runtime; fallback below if unavailable
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const NetInfo = require('@react-native-community/netinfo').default;
    return NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state?.isConnected) && state?.isInternetReachable !== false;
      onChange(isOnline);
    });
  } catch {
    return null;
  }
}

export default function useNetworkStatus() {
  const { dispatch } = useAppStore();
  const lastOfflineRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const safeSetOffline = (isOffline) => {
      if (!mounted) return;
      if (lastOfflineRef.current === isOffline) return;
      lastOfflineRef.current = isOffline;
      dispatch({ type: 'SET_OFFLINE', payload: isOffline });
    };

    const unsubscribe = subscribeNetInfo((isOnline) => {
      safeSetOffline(!isOnline);
    });

    if (unsubscribe) {
      return () => {
        mounted = false;
        unsubscribe();
      };
    }

    const probe = async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        await fetch(BACKEND_URL, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timer);
        safeSetOffline(false);
      } catch {
        safeSetOffline(true);
      }
    };

    probe();
    const interval = setInterval(probe, PING_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [dispatch]);
}

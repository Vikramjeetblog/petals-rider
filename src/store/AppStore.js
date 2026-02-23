import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Appearance } from 'react-native';

import darkTheme from '../theme/darkTheme';
import lightTheme from '../theme/lightTheme';

const initialState = {
  auth: { token: null, isLoggedIn: false },
  rider: { profile: null },
  orders: { items: [] },
  earnings: { summary: null, activity: [] },
  online: true,
  themeMode: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, auth: { ...state.auth, ...action.payload } };
    case 'SET_PROFILE':
      return { ...state, rider: { ...state.rider, profile: action.payload } };
    case 'SET_ORDERS':
      return { ...state, orders: { ...state.orders, items: action.payload } };
    case 'SET_EARNINGS_ACTIVITY':
      return { ...state, earnings: { ...state.earnings, activity: action.payload } };
    case 'SET_EARNINGS_SUMMARY':
      return { ...state, earnings: { ...state.earnings, summary: action.payload } };
    case 'SET_ONLINE':
      return { ...state, online: action.payload };
    case 'SET_THEME_MODE':
      return { ...state, themeMode: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: { message: action.payload } };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => {
    const theme = state.themeMode === 'dark' ? darkTheme : lightTheme;
    return { state, dispatch, theme };
  }, [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return context;
}

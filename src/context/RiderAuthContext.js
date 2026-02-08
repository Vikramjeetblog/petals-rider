import React, { createContext, useCallback, useMemo, useState } from 'react';

export const RiderAuthContext = createContext({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export function RiderAuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const login = useCallback((nextToken) => {
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(token),
      token,
      login,
      logout,
    }),
    [token, login, logout]
  );

  return (
    <RiderAuthContext.Provider value={value}>
      {children}
    </RiderAuthContext.Provider>
  );
}

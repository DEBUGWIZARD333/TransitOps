import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearToken,
  decodeJwtPayload,
  getRoleFromToken,
  getStoredToken,
  isTokenValid,
  loginUser,
  saveToken,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(() => {
    const storedToken = getStoredToken();
    const payload = decodeJwtPayload(storedToken);
    return storedToken && payload
      ? {
          email: payload.email || 'ops@transitops.com',
          role: getRoleFromToken(storedToken) || 'Fleet Manager',
          name: payload.name || payload.email || 'TransitOps User',
        }
      : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = getStoredToken();
    return Boolean(storedToken && isTokenValid(storedToken));
  });

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken && isTokenValid(storedToken)) {
      const payload = decodeJwtPayload(storedToken);
      setToken(storedToken);
      setUser({
        email: payload?.email || 'ops@transitops.com',
        role: getRoleFromToken(storedToken) || 'Fleet Manager',
        name: payload?.name || payload?.email || 'TransitOps User',
      });
      setIsAuthenticated(true);
    } else {
      clearToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const payload = decodeJwtPayload(response.token);
    const nextUser = {
      email: payload?.email || credentials.email,
      role: getRoleFromToken(response.token) || 'Fleet Manager',
      name: payload?.name || payload?.email || credentials.email,
    };

    setToken(response.token);
    setUser(nextUser);
    setIsAuthenticated(true);
    saveToken(response.token);
    return nextUser;
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout }),
    [token, user, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

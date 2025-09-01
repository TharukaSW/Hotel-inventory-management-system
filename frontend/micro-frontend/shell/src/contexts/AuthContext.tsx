import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!user;

  // Central API base (must be supplied via VITE_API_BASE_URL or window.__API_BASE_URL__)
  // Re-use shared-lib config if available without creating circular deps.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runtimeApiBase = (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) as string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const envApiBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  const API_BASE_URL = (envApiBase || runtimeApiBase || '').replace(/\/$/, '');

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response;
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Try to parse JSON even on error to get message
      let data: any = null;
      try { data = await response.json(); } catch (_) { /* ignore parse errors */ }

      if (response.ok && data?.success && data?.user) {
        setUser(data.user);
        window.postMessage({ type: 'AUTH_LOGIN', user: data.user }, '*');
        return { success: true };
      }

      // Determine message
      const message = data?.message || (response.status === 401 ? 'Invalid email or password' : 'Login failed');
      return { success: false, message };
  } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
  }
  };

  const logout = async (): Promise<void> => {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
  // Broadcast logout event
  window.postMessage({ type: 'AUTH_LOGOUT' }, '*');
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/me`);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else if (response.status === 401) {
        // Try to refresh token
        const refreshResponse = await tryRefreshToken();
        if (refreshResponse) {
          return await checkAuth(); // Retry after refresh
        }
      }
      
      setUser(null);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    }
  };

  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      // Send empty body; server reads refresh token cookie (HttpOnly)
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken: '' })
      });
      if (response.ok) {
        const data = await response.json();
  if (data.success) return true;
      }
      return false;
    } catch (error) {
      // Don't log error to console on login screen
      return false;
    }
  };

  const getAuthToken = (): string | null => {
  return null; // No bearer token stored; rely purely on cookies
  };

  // Check authentication on mount, but only if a token exists
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
  // Always attempt auth check; server will use cookies
  await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (isAuthenticated) {
      const refreshInterval = setInterval(async () => {
        await tryRefreshToken();
      }, 15 * 60 * 1000); // Refresh every 15 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);

  // Listen for auth state requests from micro-frontends
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REQUEST_AUTH_STATE') {
        console.log('[Shell] Received REQUEST_AUTH_STATE from micro-frontend');
        
        // Send current auth state to requesting micro-frontend
        if (isAuthenticated && user) {
          const accessToken = getAuthToken();
          const refreshToken = sessionStorage.getItem('refreshToken');
          
          window.postMessage({
            type: 'AUTH_LOGIN',
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
          }, '*');
          
          console.log('[Shell] Sent current auth state to micro-frontend');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isAuthenticated, user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    getAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

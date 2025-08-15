import React, { createContext, useContext, ReactNode } from 'react';

type NoAuthUser = null;

interface NoAuthContextType {
  user: NoAuthUser;
  token: null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: null;
  login: (_: any) => Promise<void>;
  register: (_: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (_: any) => Promise<void>;
  changePassword: (_: any) => Promise<void>;
  requestPasswordReset: (_: string) => Promise<void>;
  resetPassword: (_: any) => Promise<void>;
  hasRole: (_: any) => boolean;
  hasPermission: (_: any) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<NoAuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const noAuth: NoAuthContextType = {
    user: null,
    token: null,
    isAuthenticated: true,
    isLoading: false,
    error: null,
    async login() {},
    async register() {},
    async logout() {},
    async refreshToken() {},
    async updateProfile() {},
    async changePassword() {},
    async requestPasswordReset() {},
    async resetPassword() {},
    hasRole: () => true,
    hasPermission: () => true,
    clearError: () => {},
  };

  return (
    <AuthContext.Provider value={noAuth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthContextType, 
  AuthState, 
  PasswordChangeData, 
  PasswordResetData,
  UserRole,
  Permission
} from '../types/auth';
import authService from '../services/authService';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: string }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INIT_AUTH'; payload: { user: User | null; token: string | null } };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.payload,
        error: null,
      };

    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'INIT_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user && !!action.payload.token,
        isLoading: false,
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const user = authService.getUser();
      const token = authService.getToken();
      
      dispatch({
        type: 'INIT_AUTH',
        payload: { user, token },
      });
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authService.login(credentials);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      const response = await authService.register(userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Refresh token
  const refreshToken = async (): Promise<void> => {
    try {
      const newToken = await authService.refreshToken();
      dispatch({
        type: 'REFRESH_TOKEN_SUCCESS',
        payload: newToken,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({
        type: 'UPDATE_PROFILE_SUCCESS',
        payload: updatedUser,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Change password
  const changePassword = async (data: PasswordChangeData): Promise<void> => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      await authService.changePassword(data.currentPassword, data.newPassword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (data: PasswordResetData): Promise<void> => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      await authService.resetPassword(data.token, data.newPassword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Check if user has role
  const hasRole = (role: UserRole): boolean => {
    return authService.hasRole(role);
  };

  // Check if user has permission
  const hasPermission = (permission: Permission): boolean => {
    return state.user?.permissions?.includes(permission) || false;
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    hasRole,
    hasPermission,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

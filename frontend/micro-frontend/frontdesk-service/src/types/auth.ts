export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  roles?: string[];
  permissions?: string[];
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  position?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

// Role-based access control types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  FRONTDESK = 'frontdesk',
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
  USER = 'user',
}

export enum Permission {
  // User management
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',
  
  // Booking management
  MANAGE_BOOKINGS = 'manage_bookings',
  VIEW_BOOKINGS = 'view_bookings',
  CREATE_BOOKINGS = 'create_bookings',
  UPDATE_BOOKINGS = 'update_bookings',
  CANCEL_BOOKINGS = 'cancel_bookings',
  
  // Room management
  MANAGE_ROOMS = 'manage_rooms',
  VIEW_ROOMS = 'view_rooms',
  
  // Inventory management
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_INVENTORY = 'view_inventory',
  
  // Reports
  VIEW_REPORTS = 'view_reports',
  GENERATE_REPORTS = 'generate_reports',
  
  // System settings
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_SETTINGS = 'view_settings',
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: PasswordResetData) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  clearError: () => void;
}

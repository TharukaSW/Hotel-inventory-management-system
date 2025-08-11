import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@hotel-inventory/shared-lib';

// Mock authentication service - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@hotel.com',
    role: 'ADMIN' as const,
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    id: 2,
    username: 'inspector',
    password: 'inspector123',
    email: 'inspector@hotel.com',
    role: 'STOCK_MANAGER' as const,
    firstName: 'Stock',
    lastName: 'Inspector'
  },
  {
    id: 3,
    username: 'frontdesk',
    password: 'frontdesk123',
    email: 'frontdesk@hotel.com',
    role: 'FRONT_DESK' as const,
    firstName: 'Front',
    lastName: 'Desk'
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('hotel-inventory-user');
        const token = localStorage.getItem('hotel-inventory-token');
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('hotel-inventory-user');
        localStorage.removeItem('hotel-inventory-token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Create user object without password
      const userWithoutPassword: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName
      };
      
      // Generate mock token
      const token = `mock-token-${foundUser.id}-${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('hotel-inventory-user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('hotel-inventory-token', token);
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hotel-inventory-user');
    localStorage.removeItem('hotel-inventory-token');
    
    // Redirect to login
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

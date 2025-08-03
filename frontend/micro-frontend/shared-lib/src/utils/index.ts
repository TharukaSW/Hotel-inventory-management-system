import { InventoryItem, User } from '../types';

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'in_stock':
    case 'available':
      return 'text-green-600 bg-green-100';
    case 'low_stock':
    case 'limited':
      return 'text-yellow-600 bg-yellow-100';
    case 'out_of_stock':
    case 'unavailable':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'FRONT_DESK':
      return 'Front Desk';
    case 'STOCK_MANAGER':
      return 'Stock Manager';
    default:
      return role;
  }
};

export const hasPermission = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  
  const roleHierarchy = {
    ADMIN: ['ADMIN', 'FRONT_DESK', 'STOCK_MANAGER'],
    FRONT_DESK: ['FRONT_DESK', 'STOCK_MANAGER'],
    STOCK_MANAGER: ['STOCK_MANAGER']
  };
  
  return roleHierarchy[user.role as keyof typeof roleHierarchy]?.includes(requiredRole) || false;
};

export const calculateStockStatus = (quantity: number, minQuantity: number = 10): string => {
  if (quantity === 0) return 'OUT_OF_STOCK';
  if (quantity <= minQuantity) return 'LOW_STOCK';
  return 'IN_STOCK';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const sortItems = <T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterItems = <T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    })
  );
}; 
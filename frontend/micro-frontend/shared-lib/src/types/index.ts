// Backend model types matching the Java entities
export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  status: string;
  createdDate: string; // ISO date string
  supplier: Supplier;
}

export interface StockTransaction {
  id: number;
  itemId: number;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string; // ISO date string
  userId: number;
  userName: string;
}

// Frontend specific types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'FRONT_DESK' | 'STOCK_MANAGER';
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Form types
export interface InventoryItemForm {
  name: string;
  categoryId: number;
  quantity: number;
  price: number;
  status: string;
  supplierId: number;
}

export interface CategoryForm {
  name: string;
}

export interface SupplierForm {
  name: string;
  contact?: string;
  email?: string;
}

export interface StockTransactionForm {
  itemId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}

// UI Types
export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => any;
  sortable?: boolean;
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
} 
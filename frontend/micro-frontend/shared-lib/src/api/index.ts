import { 
  InventoryItem, 
  Category, 
  Supplier, 
  StockTransaction,
  InventoryItemForm,
  CategoryForm,
  SupplierForm,
  StockTransactionForm
} from '../types';

const API_BASE_URL = 'http://localhost:8082/api';

class ApiService {
  // Cookie-based auth only; no bearer header. JWT is sent automatically via HttpOnly cookie.
  private getBaseHeaders(): HeadersInit {
    return { 'Content-Type': 'application/json' };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const baseHeaders = this.getBaseHeaders();
    const config: RequestInit = {
      headers: {
        ...baseHeaders,
        ...options.headers,
      },
      credentials: 'include', // send cookies (auth-token, refresh-token)
      ...options,
    };

    console.log('🔍 Making request to:', url);
    console.log('🔍 Request config:', {
      method: config.method || 'GET',
      headers: config.headers,
      credentials: config.credentials
    });

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to root/login without clearing cookies (server manages them)
          window.location.href = '/';
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // If no content
      if (response.status === 204) return undefined as unknown as T;
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication (cookie-based)
  async login(email: string, password: string): Promise<any> {
    const result = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return result;
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' });
  }

  async currentUser(): Promise<any> {
    return this.request<any>('/auth/me');
  }

  // Inventory Items
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>('/inventory');
  }

  async getInventoryItem(id: number): Promise<InventoryItem> {
    return this.request<InventoryItem>(`/inventory/${id}`);
  }

  async createInventoryItem(item: InventoryItemForm): Promise<InventoryItem> {
    return this.request<InventoryItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateInventoryItem(id: number, item: InventoryItemForm): Promise<InventoryItem> {
    return this.request<InventoryItem>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteInventoryItem(id: number): Promise<void> {
    return this.request<void>(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(category: CategoryForm): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: number, category: CategoryForm): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    return this.request<Supplier[]>('/suppliers');
  }

  async getSupplier(id: number): Promise<Supplier> {
    return this.request<Supplier>(`/suppliers/${id}`);
  }

  async createSupplier(supplier: SupplierForm): Promise<Supplier> {
    return this.request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  }

  async updateSupplier(id: number, supplier: SupplierForm): Promise<Supplier> {
    return this.request<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplier),
    });
  }

  async deleteSupplier(id: number): Promise<void> {
    return this.request<void>(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Stock Transactions
  async createStockTransaction(transaction: StockTransactionForm): Promise<StockTransaction> {
    return this.request<StockTransaction>('/inventory/transaction', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async getTransactionsForItem(itemId: number): Promise<StockTransaction[]> {
    return this.request<StockTransaction[]>(`/inventory/${itemId}/transactions`);
  }

  // User Management
  async getAllUsers(): Promise<any[]> {
    return this.request<any[]>('/users');
  }

  async getUser(id: number): Promise<any> {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(user: any): Promise<any> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, user: any): Promise<any> {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics and Reports
  async getInventoryStats(): Promise<any> {
    return this.request<any>('/admin/stats');
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>('/admin/inventory/low-stock');
  }

  async getOutOfStockItems(): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>('/admin/inventory/out-of-stock');
  }

  async getStockHistory(itemId?: number, days: number = 30): Promise<StockTransaction[]> {
    const params = new URLSearchParams();
    if (itemId) params.append('itemId', itemId.toString());
    params.append('days', days.toString());
    return this.request<StockTransaction[]>(`/inventory/stock-history?${params}`);
  }

  async getInventoryReport(startDate: string, endDate: string): Promise<any> {
    return this.request<any>(`/admin/reports/inventory?startDate=${startDate}&endDate=${endDate}`);
  }

  async getCategoryReport(): Promise<any> {
    return this.request<any>('/admin/reports/categories');
  }

  async getSupplierReport(): Promise<any> {
    return this.request<any>('/admin/reports/suppliers');
  }

  // Bulk operations
  async bulkUpdateInventory(updates: any[]): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>('/inventory/bulk-update', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async importInventory(data: any[]): Promise<any> {
    return this.request<any>('/inventory/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportInventory(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/inventory/export?format=${format}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.blob();
  }

  // Item Requests
  async getItemRequests(): Promise<any[]> {
    return this.request<any[]>('/admin/item-requests');
  }

  async approveItemRequest(id: number): Promise<any> {
    return this.request<any>(`/admin/item-requests/${id}/approve`, { method: 'POST' });
  }

  async rejectItemRequest(id: number, rejectionNotes: string): Promise<any> {
    return this.request<any>(`/admin/item-requests/${id}/reject?rejectionNotes=${encodeURIComponent(rejectionNotes)}`, { method: 'POST' });
  }
}

export const apiService = new ApiService();
export default apiService;
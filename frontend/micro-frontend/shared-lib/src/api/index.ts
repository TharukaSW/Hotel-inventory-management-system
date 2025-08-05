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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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

  // Mock authentication (since backend doesn't have auth yet)
  async login(username: string, _password: string): Promise<any> {
    // Mock login - replace with actual auth endpoint when available
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          username,
          email: `${username}@hotel.com`,
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'User'
        });
      }, 1000);
    });
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
}

export const apiService = new ApiService();
export default apiService; 
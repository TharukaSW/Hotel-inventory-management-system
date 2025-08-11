import React, { useState, useEffect } from 'react';
import { Search, Package, Filter } from 'lucide-react';
import { getAllInventoryItems, searchInventoryItems, getLowStockInventoryItems, getInventoryItemsByStatus } from '../services/inspectorService';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  status: string;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  supplier?: {
    id: number;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (showLowStockOnly) {
        data = await getLowStockInventoryItems();
      } else if (selectedStatus) {
        data = await getInventoryItemsByStatus(selectedStatus);
      } else if (searchTerm.trim()) {
        data = await searchInventoryItems(searchTerm.trim());
      } else {
        data = await getAllInventoryItems();
      }
      
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
      setError('Failed to load inventory items. Please try again.');
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, [selectedStatus, showLowStockOnly]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchInventoryItems();
      } else if (!selectedStatus && !showLowStockOnly) {
        fetchInventoryItems();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = items;
    
    if (selectedCategory) {
      filtered = filtered.filter(item => 
        item.category?.name === selectedCategory
      );
    }
    
    setFilteredItems(filtered);
  }, [items, selectedCategory]);

  const categories = Array.from(new Set(
    items.map(item => item.category?.name).filter(Boolean)
  )) as string[];

  const getStockStatus = (currentStock: number, minimumStock: number) => {
    if (currentStock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (currentStock <= minimumStock) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-2 text-sm text-gray-700">
          Browse available items for your inspections and requests
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="block w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="DISCONTINUED">Discontinued</option>
        </select>
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            showLowStockOnly
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          Low Stock Only
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.quantity, item.minQuantity);
          return (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {item.quantity} units
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Min: {item.minQuantity}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Price: ${item.price?.toFixed(2) || 'N/A'}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                      item.status === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Category: {item.category?.name || 'N/A'}</p>
                    <p>Supplier: {item.supplier?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Inventory;

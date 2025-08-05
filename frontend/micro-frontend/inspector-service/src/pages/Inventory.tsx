import React, { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  currentStock: number;
  minimumStock: number;
  categoryName: string;
  supplierName: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // TODO: Fetch inventory items from API
    setTimeout(() => {
      setItems([
        {
          id: 1,
          name: 'Towels',
          description: 'White cotton towels',
          currentStock: 50,
          minimumStock: 20,
          categoryName: 'Linens',
          supplierName: 'Linen Supply Co'
        },
        {
          id: 2,
          name: 'Toilet Paper',
          description: '2-ply toilet paper rolls',
          currentStock: 100,
          minimumStock: 25,
          categoryName: 'Bathroom Supplies',
          supplierName: 'Paper Products Inc'
        },
        {
          id: 3,
          name: 'Cleaning Supplies',
          description: 'All-purpose cleaner bottles',
          currentStock: 15,
          minimumStock: 10,
          categoryName: 'Cleaning',
          supplierName: 'Clean Pro Solutions'
        },
        {
          id: 4,
          name: 'Bed Sheets',
          description: 'Queen size white bed sheets',
          currentStock: 8,
          minimumStock: 15,
          categoryName: 'Linens',
          supplierName: 'Linen Supply Co'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(items.map(item => item.categoryName)));

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

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
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
                        {item.currentStock} units
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
                      Min: {item.minimumStock}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Category: {item.categoryName}</p>
                    <p>Supplier: {item.supplierName}</p>
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

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { apiService, Table, Badge } from '@hotel-inventory/shared-lib';
import { InventoryItem, Category, Supplier, TableColumn } from '@hotel-inventory/shared-lib';
import { formatCurrency, getStatusColor, formatDate } from '@hotel-inventory/shared-lib';

const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsData, categoriesData, suppliersData] = await Promise.all([
        apiService.getAllInventoryItems(),
        apiService.getAllCategories(),
        apiService.getAllSuppliers()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiService.deleteInventoryItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">ID: {item.id}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (item) => (
        <Badge variant="primary" size="sm">
          {item.category?.name || 'N/A'}
        </Badge>
      )
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      render: (item) => (
        <div className="text-center">
          <span className={`font-medium ${
            item.quantity === 0 ? 'text-red-600' : 
            item.quantity <= 10 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {item.quantity}
          </span>
        </div>
      )
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (item) => formatCurrency(item.price)
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const status = item.quantity === 0 ? 'OUT_OF_STOCK' : 
                      item.quantity <= 10 ? 'LOW_STOCK' : 'IN_STOCK';
        return (
          <Badge 
            variant={status === 'IN_STOCK' ? 'success' : status === 'LOW_STOCK' ? 'warning' : 'danger'}
            size="sm"
          >
            {status.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (item) => item.supplier?.name || 'N/A'
    },
    {
      header: 'Created',
      accessor: 'createdDate',
      render: (item) => formatDate(item.createdDate)
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingItem(item)}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage hotel inventory items and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Inventory Items ({filteredItems.length})
          </h3>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredItems}
            loading={loading}
            emptyMessage="No inventory items found"
          />
        </div>
      </div>

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
              {/* Form would go here */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement; 
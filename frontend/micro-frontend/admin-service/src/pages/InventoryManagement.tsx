import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { apiService, Table, Badge } from '@hotel-inventory/shared-lib';
import { InventoryItem, Category, Supplier, TableColumn, InventoryItemForm } from '@hotel-inventory/shared-lib';
import { formatCurrency, formatDate } from '@hotel-inventory/shared-lib';
import { useToast } from '../components/ToastContainer';
import { useConfirmation } from '../components/ConfirmationModal';

// Category field configurations
const categoryFieldConfigs = {
  'Housekeeping Inventory': ['unitOfMeasurement', 'expiryDate', 'minQuantity'],
  'Food and Beverage (F&B) Inventory': ['unitOfMeasurement', 'expiryDate', 'minQuantity'],
  'Furniture and Fixtures': ['condition', 'warrantyExpiry'],
  'Maintenance and Engineering Supplies': ['unitOfMeasurement', 'minQuantity'],
  'Office and Stationery Supplies': ['unitOfMeasurement', 'minQuantity'],
  'Kitchen Equipment': ['warrantyExpiry'],
  'Safety and Security Items': [],
  'Laundry Supplies': ['unitOfMeasurement', 'expiryDate', 'minQuantity'],
  'Uniforms and Staff Wear': ['minQuantity'],
  'Event and Banquet Supplies': []
};

const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirmation();

  const [formData, setFormData] = useState<InventoryItemForm>({
    name: '',
    description: '',
    categoryId: 0,
    quantity: 0,
    price: 0,
    status: 'IN_STOCK',
    minQuantity: 10,
    unitOfMeasurement: '',
    expiryDate: '',
    condition: '',
    warrantyExpiry: '',
    supplierId: 0
  });

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
      showError('Error fetching data');
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
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this inventory item? This action cannot be undone.',
      type: 'danger'
    });
    
    if (confirmed) {
      try {
  await apiService.deleteInventoryItem(id);
  // Re-fetch items to ensure consistency (e.g., related counts)
  const refreshed = await apiService.getAllInventoryItems();
  setItems(refreshed);
  showSuccess('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        showError('Failed to delete item');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        // Convert date strings to ISO format if they exist
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry).toISOString() : undefined,
      };

      if (editingItem) {
        const updatedItem = await apiService.updateInventoryItem(editingItem.id, submitData);
        setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
        setEditingItem(null);
        showSuccess('Item updated successfully');
      } else {
        const newItem = await apiService.createInventoryItem(submitData);
        setItems([...items, newItem]);
        showSuccess('Item created successfully');
      }
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
      showError('Failed to save item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: 0,
      quantity: 0,
      price: 0,
      status: 'IN_STOCK',
      minQuantity: 10,
      unitOfMeasurement: '',
      expiryDate: '',
      condition: '',
      warrantyExpiry: '',
      supplierId: 0
    });
    setSelectedCategory(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    const category = categories.find(cat => cat.id === item.category?.id);
    setSelectedCategory(category || null);
    
    setFormData({
      name: item.name,
      description: item.description || '',
      categoryId: item.category?.id || 0,
      quantity: item.quantity,
      price: item.price,
      status: item.status,
      minQuantity: item.minQuantity || 10,
      unitOfMeasurement: item.unitOfMeasurement || '',
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      condition: item.condition || '',
      warrantyExpiry: item.warrantyExpiry ? new Date(item.warrantyExpiry).toISOString().split('T')[0] : '',
      supplierId: item.supplier?.id || 0
    });
    setShowAddModal(true);
  };

  const handleCategoryChange = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(category || null);
    setFormData({ ...formData, categoryId });
  };

  const getRequiredFields = (): string[] => {
    if (!selectedCategory) return [];
    return categoryFieldConfigs[selectedCategory.name as keyof typeof categoryFieldConfigs] || [];
  };

  const renderCategorySpecificFields = () => {
    if (!selectedCategory) return null;

    const requiredFields = getRequiredFields();
    
    return (
      <div className="space-y-4 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-900">
          {selectedCategory.name} - Specific Fields
        </h4>
        
        {/* Description field for categories that use it */}
        {(['Food and Beverage (F&B) Inventory', 'Furniture and Fixtures', 'Maintenance and Engineering Supplies', 
           'Office and Stationery Supplies', 'Safety and Security Items', 'Laundry Supplies', 'Uniforms and Staff Wear', 
           'Event and Banquet Supplies'].includes(selectedCategory.name)) && (
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {selectedCategory.name === 'Food and Beverage (F&B) Inventory' ? 'Food Type' : 
               selectedCategory.name === 'Uniforms and Staff Wear' ? 'Description' : 'Type'}
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={selectedCategory.name === 'Food and Beverage (F&B) Inventory' ? 'e.g., Dairy, Meat, Vegetables' : 
                          selectedCategory.name === 'Uniforms and Staff Wear' ? 'e.g., Chef uniform, Front desk attire' : 
                          'e.g., Equipment type, Item category'}
            />
          </div>
        )}

        {/* Unit of Measurement */}
        {requiredFields.includes('unitOfMeasurement') && (
          <div>
            <label htmlFor="unitOfMeasurement" className="block text-sm font-medium text-gray-700 mb-1">
              Unit of Measurement <span className="text-red-500">*</span>
            </label>
            <select
              id="unitOfMeasurement"
              value={formData.unitOfMeasurement}
              onChange={(e) => setFormData({ ...formData, unitOfMeasurement: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select unit</option>
              <option value="pieces">Pieces</option>
              <option value="liters">Liters</option>
              <option value="kg">Kilograms</option>
              <option value="grams">Grams</option>
              <option value="bottles">Bottles</option>
              <option value="boxes">Boxes</option>
              <option value="packets">Packets</option>
              <option value="rolls">Rolls</option>
              <option value="sets">Sets</option>
              <option value="pairs">Pairs</option>
            </select>
          </div>
        )}

        {/* Expiry Date */}
        {requiredFields.includes('expiryDate') && (
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              {selectedCategory.name === 'Food and Beverage (F&B) Inventory' ? 'Expiry Date/Hours' : 'Expiry Date'} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {/* Condition */}
        {requiredFields.includes('condition') && (
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
        )}

        {/* Warranty Expiry */}
        {requiredFields.includes('warrantyExpiry') && (
          <div>
            <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-gray-700 mb-1">
              Warranty Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="warrantyExpiry"
              value={formData.warrantyExpiry}
              onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {/* Minimum Level */}
        {requiredFields.includes('minQuantity') && (
          <div>
            <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="minQuantity"
              value={formData.minQuantity}
              onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="10"
              min="1"
              required
            />
          </div>
        )}
      </div>
    );
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">ID: {item.id}</div>
          {item.description && (
            <div className="text-sm text-gray-500">{item.description}</div>
          )}
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
      header: 'Details',
      accessor: 'quantity',
      render: (item) => (
        <div className="text-sm">
          <div className="font-medium">Qty: {item.quantity}</div>
          {item.unitOfMeasurement && <div>Unit: {item.unitOfMeasurement}</div>}
          {item.minQuantity && <div>Min: {item.minQuantity}</div>}
          {item.condition && <div>Condition: {item.condition}</div>}
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
                      item.quantity <= (item.minQuantity || 10) ? 'LOW_STOCK' : 'IN_STOCK';
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
      header: 'Dates',
      accessor: 'createdDate',
      render: (item) => (
        <div className="text-sm">
          <div>Created: {formatDate(item.createdDate)}</div>
          {item.expiryDate && <div>Expires: {formatDate(item.expiryDate)}</div>}
          {item.warrantyExpiry && <div>Warranty: {formatDate(item.warrantyExpiry)}</div>}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(item)}
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
          <p className="text-gray-600">Manage hotel inventory items with category-specific fields</p>
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Item Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter item name"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category-specific fields */}
                {renderCategorySpecificFields()}

                {/* Common fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Supplier */}
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="supplierId"
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Select a supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="IN_STOCK">In Stock</option>
                    <option value="LOW_STOCK">Low Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name.trim() || formData.categoryId === 0 || formData.supplierId === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingItem ? 'Update' : 'Create'} Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { apiService, Table } from '@hotel-inventory/shared-lib';
import { Supplier, TableColumn } from '@hotel-inventory/shared-lib';



const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    phoneNumber: '', 
    email: '',
    supplyItem: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await apiService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.supplyItem?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await apiService.updateSupplier(editingSupplier.id, formData);
        setSuppliers(suppliers.map(sup => 
          sup.id === editingSupplier.id ? { ...sup, ...formData } : sup
        ));
        setEditingSupplier(null);
      } else {
        const newSupplier = await apiService.createSupplier(formData);
        setSuppliers([...suppliers, newSupplier]);
      }
      setFormData({ name: '', phoneNumber: '', email: '', supplyItem: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({ 
      name: supplier.name, 
      phoneNumber: supplier.phoneNumber || '', 
      email: supplier.email || '',
      supplyItem: supplier.supplyItem || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await apiService.deleteSupplier(id);
        setSuppliers(suppliers.filter(sup => sup.id !== id));
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const columns: TableColumn<Supplier>[] = [
    {
      header: 'ID',
      accessor: 'id',
      render: (supplier) => <span className="text-gray-500">#{supplier.id}</span>
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (supplier) => (
        <div className="font-medium text-gray-900">{supplier.name}</div>
      )
    },
    {
      header: 'phoneNumber',
      accessor: 'phoneNumber',
      render: (supplier) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span>{supplier.phoneNumber || 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (supplier) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span>{supplier.email || 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Supply Items',
      accessor: 'supplyItem',
      render: (supplier) => (
        <div className="text-gray-800">{supplier.supplyItem || 'N/A'}</div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (supplier) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(supplier)}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(supplier.id)}
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
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600">Manage inventory suppliers</p>
        </div>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setFormData({ name: '', phoneNumber: '', email: '', supplyItem: '' });
            setShowAddModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Suppliers ({filteredSuppliers.length})
          </h3>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredSuppliers}
            loading={loading}
            emptyMessage="No suppliers found"
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter supplier name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="mb-4">
                    <label htmlFor="supplyItem" className="block text-sm font-medium text-gray-700 mb-2">
                    Supply Items
                  </label>
                  <input
                    type="text"
                    id="supplyItem"
                    value={formData.supplyItem}
                    onChange={(e) => setFormData({ ...formData, supplyItem: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter supply items (comma separated)"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingSupplier(null);
                      setFormData({ name: '', phoneNumber: '', email: '', supplyItem: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingSupplier ? 'Update' : 'Add'} Supplier
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

export default SupplierManagement; 
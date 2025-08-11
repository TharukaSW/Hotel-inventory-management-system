import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Shield } from 'lucide-react';
import { Badge } from '@hotel-inventory/shared-lib';
import { useToast } from '../components/ToastContainer';
import { useConfirmation } from '../components/ConfirmationModal';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'ADMIN',
    status: 'active',
    password: ''
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirmation();

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle edit user
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'ADMIN',
      status: user.active ? 'active' : 'inactive',
      password: '' // Don't populate password for editing
    });
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    const confirmed = await confirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (!confirmed) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user');
      await fetchUsers(); // Refresh the user list
      showSuccess('User deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Error deleting user');
      showError('Failed to delete user', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setLoading(true);
    setError(null);
    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        isActive: formData.status === 'active'
      };
      
      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      // Only include email and username if they've changed
      if (formData.email !== editingUser.email) {
        updateData.email = formData.email;
      }
      if (formData.username !== editingUser.username) {
        updateData.username = formData.username;
      }
      
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!res.ok) throw new Error('Failed to update user');
      
      setShowEditModal(false);
      setEditingUser(null);
      setFormData({ username: '', email: '', firstName: '', lastName: '', role: 'ADMIN', status: 'active', password: '' });
      await fetchUsers();
      showSuccess('User updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Error updating user');
      showError('Failed to update user', err.message);
    } finally {
      setLoading(false);
    }
  };



  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'FRONT_DESK':
        return 'primary';
      case 'INSPECTOR':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'success' : 'warning';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddModal(false)}
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                try {
                  const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                  });
                  if (!res.ok) throw new Error('Failed to add user');
                  setShowAddModal(false);
                  setFormData({ username: '', email: '', firstName: '', lastName: '', role: 'ADMIN', status: 'active', password: '' });
                  await fetchUsers();
                  showSuccess('User created successfully!');
                } catch (err: any) {
                  setError(err.message || 'Error adding user');
                  showError('Failed to create user', err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="FRONT_DESK">Front Desk</option>
                  <option value="INSPECTOR">Inspector</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
                setFormData({ username: '', email: '', firstName: '', lastName: '', role: 'ADMIN', status: 'active', password: '' });
              }}
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="FRONT_DESK">Front Desk</option>
                  <option value="INSPECTOR">Inspector</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setFormData({ username: '', email: '', firstName: '', lastName: '', role: 'ADMIN', status: 'active', password: '' });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            System Users ({filteredUsers.length})
          </h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                        {user.role?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(user.active ? 'active' : 'inactive')} size="sm">
                        {user.active ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
<button className="text-blue-600 hover:text-blue-900" onClick={() => handleEditUser(user)}>
  <Edit className="h-4 w-4" />
</button>
<button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user.id)}>
  <Trash2 className="h-4 w-4" />
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Permissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-medium text-gray-900">Administrator</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full system access</li>
              <li>• User management</li>
              <li>• System configuration</li>
              <li>• Reports and analytics</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Front Desk</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View inventory</li>
              <li>• Create requests</li>
              <li>• Basic reporting</li>
              <li>• Limited user access</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-yellow-600 mr-2" />
              <h4 className="font-medium text-gray-900">Inspector</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Inventory inspections</li>
              <li>• Item requests</li>
              <li>• Quality assessments</li>
              <li>• Inspection reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 
import React, { useEffect, useState } from 'react';
import '../styles/animations.css';

type User = {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'FRONT_DESK' | 'STOCK_MANAGER';
  firstName: string;
  lastName: string;
};

const getStatusColor = (role: string) => {
  switch(role) {
    case 'ADMIN':
      return 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-200';
    case 'FRONT_DESK':
      return 'bg-gradient-to-r from-amber-400 to-yellow-500 border-yellow-200';
    default:
      return 'bg-gradient-to-r from-blue-400 to-indigo-500 border-blue-200';
  }
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const roles = ['ALL', 'ADMIN', 'FRONT_DESK', 'STOCK_MANAGER'];

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="mb-12 text-center">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-6">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-3-3.87m6 5.87v-2a4 4 0 00-3-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            User Management
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Efficiently manage and monitor your team members in one place
          </p>
        </div>

        <div className="flex flex-wrap gap-6 mb-8 p-6 bg-white/40 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="flex-1 min-w-[300px]">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl 
                          focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300
                          placeholder:text-gray-400 text-gray-700"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl
                      focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300
                      text-gray-700 cursor-pointer hover:bg-white/90"
          >
            {roles.map(role => (
              <option key={role} value={role} className="bg-white text-gray-700">
                {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-600 text-xl font-medium animate-pulse">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-4 bg-red-50 rounded-2xl border border-red-100">
            <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-xl font-medium mb-2">Error Loading Users</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="overflow-hidden rounded-2xl shadow-lg border border-indigo-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-500">
                      <tr>
                        <th scope="col" className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                        <th scope="col" className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Username</th>
                        <th scope="col" className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                        <th scope="col" className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Role</th>
                        <th scope="col" className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">First Name</th>
                        <th scope="col" className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Last Name</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user, index) => (
                        <tr 
                          key={user.id}
                          onMouseEnter={() => setIsHovered(user.id)}
                          onMouseLeave={() => setIsHovered(null)}
                          className={`transition-all duration-300 fade-in ${
                            isHovered === user.id ? 'bg-indigo-50 scale-[1.01]' : 'hover:bg-gray-50'
                          }`}
                          style={{
                            animationDelay: `${index * 0.1}s`
                          }}
                        >
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">#{user.id}</span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-medium text-sm">
                                {user.username[0].toUpperCase()}
                              </div>
                              <span className="ml-3 text-sm text-gray-900">{user.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <a 
                              href={`mailto:${user.email}`}
                              className="text-sm text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                            >
                              {user.email}
                            </a>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${getStatusColor(user.role)}`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No users found matching your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;

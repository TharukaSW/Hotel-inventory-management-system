import React from 'react';


type User = {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'FRONT_DESK' | 'STOCK_MANAGER';
  firstName: string;
  lastName: string;
};

const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'ADMIN', firstName: 'Admin', lastName: 'User' },
  { id: 2, username: 'jane', email: 'jane@example.com', role: 'FRONT_DESK', firstName: 'Jane', lastName: 'Doe' },
  { id: 3, username: 'john', email: 'john@example.com', role: 'STOCK_MANAGER', firstName: 'John', lastName: 'Smith' },
];

const UserTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Username</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">First Name</th>
            <th className="py-3 px-4 text-left">Last Name</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(user => (
            <tr key={user.id} className="border-b hover:bg-blue-50 transition-colors">
              <td className="py-2 px-4 font-semibold text-gray-700">{user.id}</td>
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                <span className={
                  user.role === 'ADMIN' ? 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs' :
                  user.role === 'FRONT_DESK' ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs' :
                  'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'
                }>
                  {user.role.replace('_', ' ')}
                </span>
              </td>
              <td className="py-2 px-4">{user.firstName}</td>
              <td className="py-2 px-4">{user.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

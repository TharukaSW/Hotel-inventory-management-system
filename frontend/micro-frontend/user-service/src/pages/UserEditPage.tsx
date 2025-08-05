import React from 'react';
import UserForm from '../components/UserForm';

const UserEditPage: React.FC = () => {
  // In a real app, get userId from route params and fetch user data
  return (
    <div>
      <h1>Edit User</h1>
      <UserForm isEdit />
    </div>
  );
};

export default UserEditPage;

import React, { useState } from 'react';

interface UserFormProps {
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ isEdit }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'ADMIN',
    firstName: '',
    lastName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    alert((isEdit ? 'Updated' : 'Created') + ' user: ' + JSON.stringify(form));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} required type="email" />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="ADMIN">Admin</option>
          <option value="FRONT_DESK">Front Desk</option>
          <option value="STOCK_MANAGER">Stock Manager</option>
        </select>
      </div>
      <div>
        <label>First Name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} />
      </div>
      <div>
        <label>Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} />
      </div>
      <button type="submit">{isEdit ? 'Update' : 'Create'} User</button>
    </form>
  );
};

export default UserForm;

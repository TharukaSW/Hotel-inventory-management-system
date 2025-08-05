import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';

const Login: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      // Redirect or perform additional actions on success
      console.log('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="max-w-xs mx-auto my-10 p-6 shadow-lg border rounded-lg">
      <h2 className="text-lg font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button type="submit" className="w-full mt-4 p-2 bg-blue-600 text-white rounded" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;


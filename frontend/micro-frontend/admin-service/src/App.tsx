import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import CategoryManagement from './pages/CategoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
};

export default App; 
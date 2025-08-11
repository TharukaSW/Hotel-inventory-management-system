import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import CategoryManagement from './pages/CategoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import ItemRequests from './pages/ItemRequests';
import { ToastProvider } from './components/ToastContainer';
import { ConfirmationProvider } from './components/ConfirmationModal';
import './App.css';

// Authentication check component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('hotel-inventory-user');
        const token = localStorage.getItem('hotel-inventory-token');
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          // Check if user has ADMIN role
          if (parsedUser.role === 'ADMIN') {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // User doesn't have admin access, redirect to auth
            localStorage.removeItem('hotel-inventory-user');
            localStorage.removeItem('hotel-inventory-token');
            window.location.href = 'http://localhost:3001';
            return;
          }
        } else {
          // No authentication found, redirect to auth service
          window.location.href = 'http://localhost:3001';
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid data and redirect
        localStorage.removeItem('hotel-inventory-user');
        localStorage.removeItem('hotel-inventory-token');
        window.location.href = 'http://localhost:3001';
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should not happen since we redirect above, but just in case
    return null;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthGuard>
      <ToastProvider>
        <ConfirmationProvider>
          <Router>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/suppliers" element={<SupplierManagement />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/item-requests" element={<ItemRequests />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminLayout>
          </Router>
        </ConfirmationProvider>
      </ToastProvider>
    </AuthGuard>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InspectorLayout from './components/InspectorLayout';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import ItemRequests from './pages/ItemRequests';
import Inventory from './pages/Inventory';
import NewInspection from './pages/NewInspection';
import InspectionDetails from './pages/InspectionDetails';

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
          // Check if user has STOCK_MANAGER role
          if (parsedUser.role === 'STOCK_MANAGER') {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // User doesn't have inspector access, redirect to auth
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
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

const App: React.FC = () => {
  return (
    <AuthGuard>
      <BrowserRouter>
        <ToastProvider>
          <InspectorLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/inspections/new" element={<NewInspection />} />
              <Route path="/inspections/:id" element={<InspectionDetails />} />
              <Route path="/item-requests" element={<ItemRequests />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </InspectorLayout>
        </ToastProvider>
      </BrowserRouter>
    </AuthGuard>
  );
};

export default App;

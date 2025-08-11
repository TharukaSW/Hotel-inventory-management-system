import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FrontDeskLayout from './components/FrontDeskLayout';
import BookingList from './components/BookingList';
import BookingForm from './components/BookingForm';
import { Booking } from './types';

// Dashboard component
function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateBooking = () => {
    setEditingBooking(undefined);
    setShowForm(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBooking(undefined);
  };

  const handleFormSubmit = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Front Desk Dashboard</h1>
        <p className="text-gray-600">Manage hotel bookings, check-ins, and check-outs.</p>
      </div>
      
      <BookingList 
        key={refreshKey}
        onEditBooking={handleEditBooking}
        onCreateBooking={handleCreateBooking}
      />
      
      {showForm && (
        <BookingForm
          booking={editingBooking}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

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
          // Check if user has FRONT_DESK role
          if (parsedUser.role === 'FRONT_DESK') {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // User doesn't have front desk access, redirect to auth
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
      <Router>
        <FrontDeskLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FrontDeskLayout>
      </Router>
    </AuthGuard>
  );
}

export default App;

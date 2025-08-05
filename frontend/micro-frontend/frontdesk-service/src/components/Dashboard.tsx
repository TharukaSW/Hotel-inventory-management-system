import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import { Booking } from '../types';
import { LogOut, User, Settings, Bell, Calendar, Users, Key } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">Hotel Management</h1>
                <p className="text-sm text-gray-500">Frontdesk Service</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 px-1 pb-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pb-2 text-sm font-medium">
                Rooms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pb-2 text-sm font-medium">
                Guests
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pb-2 text-sm font-medium">
                Reports
              </a>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-500 p-1"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-gray-600">
                  Manage hotel bookings, check-ins, and check-outs from your dashboard.
                </p>
              </div>
              <div className="hidden md:flex space-x-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Today's</p>
                  <p className="text-lg font-semibold text-gray-900">Bookings</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-lg font-semibold text-gray-900">Guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Management */}
        <div className="space-y-6">
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
      </main>
    </div>
  );
};

export default Dashboard;

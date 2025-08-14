import { useState } from 'react';
import BookingList from './components/BookingList';
import BookingForm from './components/BookingForm';
import { Booking } from './types';

function App() {
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frontdesk Service</h1>
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
    </div>
  );
}

export default App;

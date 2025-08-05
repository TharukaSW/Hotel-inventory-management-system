import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types';
import { frontdeskService } from '../services/frontdeskService';
import { LogIn, LogOut, Edit, Trash2, Plus } from 'lucide-react';

interface BookingListProps {
  onEditBooking: (booking: Booking) => void;
  onCreateBooking: () => void;
}

const BookingList: React.FC<BookingListProps> = ({ onEditBooking, onCreateBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await frontdeskService.getAllBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      await frontdeskService.checkIn(id);
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to check in guest');
      console.error('Error checking in:', err);
    }
  };

  const handleCheckOut = async (id: number) => {
    try {
      await frontdeskService.checkOut(id);
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to check out guest');
      console.error('Error checking out:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await frontdeskService.deleteBooking(id);
        fetchBookings(); // Refresh the list
      } catch (err) {
        setError('Failed to delete booking');
        console.error('Error deleting booking:', err);
      }
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.RESERVED:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CHECKED_IN:
        return 'bg-green-100 text-green-800';
      case BookingStatus.CHECKED_OUT:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Bookings</h2>
        <button
          onClick={onCreateBooking}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={16} />
          New Booking
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.guestName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.guestEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.roomNumber}</div>
                  <div className="text-sm text-gray-500">{booking.roomType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.expectedCheckIn ? new Date(booking.expectedCheckIn).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.expectedCheckOut ? new Date(booking.expectedCheckOut).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {booking.status === BookingStatus.RESERVED && (
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Check In"
                      >
                        <LogIn size={16} />
                      </button>
                    )}
                    {booking.status === BookingStatus.CHECKED_IN && (
                      <button
                        onClick={() => handleCheckOut(booking.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Check Out"
                      >
                        <LogOut size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onEditBooking(booking)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {bookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}
    </div>
  );
};

export default BookingList;

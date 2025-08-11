import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  User, 
  MapPin,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface ItemRequest {
  id: number;
  inspectorId: number;
  inspectorName: string;
  inventoryItemId: number;
  itemName: string;
  requestedQuantity: number;
  locationType: string;
  locationIdentifier: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedById?: number;
  approvedByName?: string;
  approvalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const ItemRequests: React.FC = () => {
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<{ [key: number]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8082/api/admin/item-requests');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching item requests:', err);
      setError('Failed to load item requests. Please try again.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: number) => {
    try {
      setProcessingId(requestId);
      setError(null);
      
      const response = await fetch(`http://localhost:8082/api/admin/item-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const approvedRequest = await response.json();
      
      // Update the request in the list
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? approvedRequest : req
        )
      );

      // Remove from pending list if needed
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
      
    } catch (err: any) {
      console.error('Error approving request:', err);
      setError(err.message || 'Failed to approve request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: number, notes: string) => {
    try {
      setProcessingId(requestId);
      setError(null);
      
      const response = await fetch(`http://localhost:8082/api/admin/item-requests/${requestId}/reject?rejectionNotes=${encodeURIComponent(notes)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const rejectedRequest = await response.json();
      
      // Update the request in the list
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? rejectedRequest : req
        )
      );

      // Remove from pending list
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
      
      setShowRejectModal(null);
      setRejectionNotes(prev => ({ ...prev, [requestId]: '' }));
      
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.message || 'Failed to reject request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Item Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and process item requests from inspectors
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
            {error}
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no item requests waiting for approval.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {request.itemName}
                          </h3>
                          <div className="ml-3">
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-2" />
                            Requested by: {request.inspectorName}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Package className="w-4 h-4 mr-2" />
                            Quantity: {request.requestedQuantity}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location: {request.locationType} - {request.locationIdentifier}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            Requested: {formatDate(request.createdAt)}
                          </div>
                        </div>
                        
                        {request.reason && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-700">
                              <strong>Reason:</strong> {request.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-3 ml-6">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {processingId === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setShowRejectModal(request.id)}
                        disabled={processingId === request.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                
                {request.approvalNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {request.approvalNotes}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject Request
              </h3>
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                placeholder="Please provide a reason for rejection..."
                value={rejectionNotes[showRejectModal] || ''}
                onChange={(e) => setRejectionNotes(prev => ({ 
                  ...prev, 
                  [showRejectModal]: e.target.value 
                }))}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectModal, rejectionNotes[showRejectModal] || '')}
                  disabled={!rejectionNotes[showRejectModal]?.trim() || processingId === showRejectModal}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {processingId === showRejectModal ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Reject'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemRequests;

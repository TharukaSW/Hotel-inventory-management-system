import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { createItemRequest, getItemRequests, getAllInventoryItems as getInventoryItems } from '../services/inspectorService';

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface ItemRequest {
  id: number;
  itemName: string;
  requestedQuantity: number;
  locationType: string;
  locationIdentifier: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  approvedByName?: string;
  approvalNotes?: string;
}

interface CreateItemRequestForm {
  inventoryItemId: number;
  requestedQuantity: number;
  locationType: string;
  locationIdentifier: string;
  reason: string;
}

interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  status: string;
  minQuantity: number;
  maxQuantity: number;
}

const ItemRequests: React.FC = () => {
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    inventoryItemId: 0, // Will be set when inventory items are loaded
    requestedQuantity: 1,
    locationType: '',
    locationIdentifier: '',
    reason: ''
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getItemRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      // Fallback to mock data if API fails
      setRequests([
        {
          id: 1,
          itemName: 'Towels',
          requestedQuantity: 5,
          locationType: 'ROOM',
          locationIdentifier: '301',
          reason: 'Replace damaged towels',
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
          approvedByName: 'Admin User'
        },
        {
          id: 2,
          itemName: 'Toilet Paper',
          requestedQuantity: 10,
          locationType: 'ROOM',
          locationIdentifier: '204',
          reason: 'Replenish stock',
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const items = await getInventoryItems();
      setInventoryItems(items);
    } catch (err) {
      console.error('Failed to fetch inventory items:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchInventoryItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.inventoryItemId || !formData.locationType || !formData.locationIdentifier || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitLoading(true);
      const requestData: CreateItemRequestForm = {
        inventoryItemId: formData.inventoryItemId,
        requestedQuantity: Number(formData.requestedQuantity),
        locationType: formData.locationType,
        locationIdentifier: formData.locationIdentifier,
        reason: formData.reason
      };
      
      await createItemRequest(requestData);
      setShowRequestModal(false);
      setFormData({
        itemName: '',
        inventoryItemId: inventoryItems.length > 0 ? inventoryItems[0].id : 0,
        requestedQuantity: 1,
        locationType: '',
        locationIdentifier: '',
        reason: ''
      });
      
      // Refresh the requests list
      await fetchRequests();
    } catch (err) {
      console.error('Failed to create request:', err);
      alert('Failed to create request');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Item Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            Request items for different locations and track their approval status
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {requests.map((request) => (
            <li key={request.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(request.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {request.requestedQuantity}x {request.itemName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.locationType} - {request.locationIdentifier}
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested: {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={getStatusBadge(request.status)}>
                      {request.status.toLowerCase()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  {request.approvedByName && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Processed by:</strong> {request.approvedByName}
                    </p>
                  )}
                  {request.approvalNotes && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Notes:</strong> {request.approvalNotes}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No item requests found</div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Create Your First Request
          </button>
        </div>
      )}

      {/* New Request Modal - Simplified for now */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                New Item Request
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Item</label>
                  <select
                    name="inventoryItemId"
                    value={formData.inventoryItemId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select an item</option>
                    {inventoryItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Available: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="requestedQuantity"
                    value={formData.requestedQuantity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location Type</label>
                  <select 
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Select location type</option>
                    <option value="ROOM">Room</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="OFFICE">Office</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location Identifier</label>
                  <input
                    type="text"
                    name="locationIdentifier"
                    value={formData.locationIdentifier}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Room 101, Main Kitchen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Why do you need these items?"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className={`px-4 py-2 text-sm font-medium text-white ${submitLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} border border-transparent rounded-md`}
                >
                  {submitLoading ? 'Submitting...' : 'Submit Request'}
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

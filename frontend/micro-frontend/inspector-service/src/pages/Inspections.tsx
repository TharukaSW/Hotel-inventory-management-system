import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { getInspections } from '../services/inspectorService';
import { useToast } from '../components/Toast';

type InspectionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface Inspection {
  id: number;
  inspectorId: number;
  inspectorName: string;
  locationType: string;
  locationIdentifier: string;
  status: InspectionStatus;
  notes?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const Inspections: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchInspections = async () => {
    try {
      const data = await getInspections();
      setInspections(data || []);
    } catch (error: any) {
      console.error('Error fetching inspections:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch inspections. Please try again.';
      showError('Failed to Load', errorMessage);
      setInspections([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInspections();
    showSuccess('Refreshed', 'Inspections list has been updated.');
  };

  const getStatusIcon = (status: InspectionStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: InspectionStatus) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'IN_PROGRESS':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'COMPLETED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'CANCELLED':
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
          <h1 className="text-2xl font-bold text-gray-900">My Inspections</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your inspection activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/inspections/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Inspection
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {inspections.map((inspection) => (
            <li key={inspection.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(inspection.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {inspection.locationType} - {inspection.locationIdentifier}
                      </p>
                      <p className="text-sm text-gray-500">
                        Started: {formatDate(inspection.startedAt)}
                        {inspection.completedAt && (
                          <span className="ml-2">
                            • Completed: {formatDate(inspection.completedAt)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={getStatusBadge(inspection.status)}>
                      {inspection.status.replace('_', ' ').toLowerCase()}
                    </span>
                    <Link
                      to={`/inspections/${inspection.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="-ml-0.5 mr-2 h-4 w-4" />
                      View
                    </Link>
                  </div>
                </div>
                {inspection.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{inspection.notes}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {inspections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No inspections found</div>
          <Link
            to="/inspections/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Start Your First Inspection
          </Link>
        </div>
      )}
    </div>
  );
};

export default Inspections;

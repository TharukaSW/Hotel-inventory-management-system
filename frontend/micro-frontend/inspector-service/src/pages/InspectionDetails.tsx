import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface InspectionDetail {
  id: number;
  locationType: string;
  locationIdentifier: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  completedAt?: string;
  notes?: string;
}

const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<InspectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch inspection detail from API
    setTimeout(() => {
      setInspection({
        id: Number(id),
        locationType: 'ROOM',
        locationIdentifier: '204',
        status: 'COMPLETED',
        startedAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T12:30:00Z',
        notes: 'Everything was in order.'
      });
      setLoading(false);
    }, 1000);
  }, [id]);

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

  if (!inspection) {
    return <div className="text-center py-12">Inspection not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Inspection Details</h1>
      <p className="mt-1 text-sm text-gray-600">
        Here are the details of the selected inspection.
      </p>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {inspection.locationType} - {inspection.locationIdentifier}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Inspection conducted on {formatDate(inspection.startedAt)}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {inspection.status}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Started At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(inspection.startedAt)}
              </dd>
            </div>
            {inspection.completedAt && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(inspection.completedAt)}
                </dd>
              </div>
            )}
            {inspection.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {inspection.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;


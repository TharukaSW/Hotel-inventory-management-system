import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, FileText, Calendar, Loader2 } from 'lucide-react';
import { createInspection } from '../services/inspectorService';
import { useToast } from '../components/Toast';

interface InspectionFormData {
  locationType: string;
  locationIdentifier: string;
  notes: string;
}

interface FormErrors {
  locationType?: string;
  locationIdentifier?: string;
  notes?: string;
}

const NewInspection: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<InspectionFormData>({
    locationType: 'ROOM',
    locationIdentifier: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.locationType) {
      newErrors.locationType = 'Location type is required';
    }

    if (!formData.locationIdentifier.trim()) {
      newErrors.locationIdentifier = 'Location identifier is required';
    } else if (formData.locationIdentifier.trim().length < 2) {
      newErrors.locationIdentifier = 'Location identifier must be at least 2 characters';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    setLoading(true);

    try {
      const inspectionData = {
        locationType: formData.locationType,
        locationIdentifier: formData.locationIdentifier.trim(),
        notes: formData.notes.trim() || null
      };

      const response = await createInspection(inspectionData);
      
      showSuccess('Success!', 'New inspection has been created successfully.');
      
      // Navigate to the created inspection details or inspections list
      setTimeout(() => {
        if (response && response.id) {
          navigate(`/inspections/${response.id}`);
        } else {
          navigate('/inspections');
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating inspection:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create inspection. Please try again.';
      showError('Creation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inspections');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Create New Inspection</h1>
              <p className="text-sm text-gray-600">Set up a new inspection for your assigned location</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Location Type */}
          <div>
            <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              Location Type
            </label>
            <select
              id="locationType"
              name="locationType"
              value={formData.locationType}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.locationType
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="ROOM">Room</option>
              <option value="KITCHEN">Kitchen</option>
              <option value="OFFICE">Office</option>
              <option value="LOBBY">Lobby</option>
              <option value="DINING_AREA">Dining Area</option>
              <option value="BATHROOM">Bathroom</option>
              <option value="STORAGE">Storage</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.locationType && (
              <p className="mt-1 text-sm text-red-600">{errors.locationType}</p>
            )}
          </div>

          {/* Location Identifier */}
          <div>
            <label htmlFor="locationIdentifier" className="block text-sm font-medium text-gray-700 mb-2">
              Location Identifier *
            </label>
            <input
              type="text"
              id="locationIdentifier"
              name="locationIdentifier"
              value={formData.locationIdentifier}
              onChange={handleInputChange}
              placeholder="e.g., Room 101, Main Kitchen, Conference Room A"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.locationIdentifier
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.locationIdentifier && (
              <p className="mt-1 text-sm text-red-600">{errors.locationIdentifier}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Provide a specific identifier for the location to be inspected
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any additional information about this inspection..."
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.notes
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.notes.length}/500 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Inspection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInspection;


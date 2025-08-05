import React from 'react';

const NewInspection: React.FC = () => {
  // TODO: Implement form to create a new inspection
  return (
    <div className="flex justify-center items-center h-96">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-6">New Inspection</h1>
        <p className="mb-4 text-center text-gray-500">This feature will allow inspectors to define new inspections.</p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location Type</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Room 101, Main Kitchen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              placeholder="Additional information about the inspection"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInspection;


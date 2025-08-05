import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InspectorLayout from './components/InspectorLayout';
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import ItemRequests from './pages/ItemRequests';
import Inventory from './pages/Inventory';
import NewInspection from './pages/NewInspection';
import InspectionDetails from './pages/InspectionDetails';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <InspectorLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inspections" element={<Inspections />} />
          <Route path="/inspections/new" element={<NewInspection />} />
          <Route path="/inspections/:id" element={<InspectionDetails />} />
          <Route path="/item-requests" element={<ItemRequests />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </InspectorLayout>
    </BrowserRouter>
  );
};

export default App;

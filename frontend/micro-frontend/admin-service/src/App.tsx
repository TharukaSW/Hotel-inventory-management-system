import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import CategoryManagement from './pages/CategoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import ItemRequests from './pages/ItemRequests';
import { ToastProvider } from './components/ToastContainer';
import { ConfirmationProvider } from './components/ConfirmationModal';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <ConfirmationProvider>
        <Router>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/suppliers" element={<SupplierManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/item-requests" element={<ItemRequests />} />
            </Routes>
          </AdminLayout>
        </Router>
      </ConfirmationProvider>
    </ToastProvider>
  );
}

export default App;

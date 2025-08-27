import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import CategoryManagement from './pages/CategoryManagement';
import SupplierManagement from './pages/SupplierManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import ItemRequests from './pages/AdminItemRequests';
import { ToastProvider } from './components/ToastContainer';
import { ConfirmationProvider } from './components/ConfirmationModal';
import './App.css';

function App() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for auth events from shell
      if (event.data.type === 'AUTH_LOGIN') {
        console.log('[Admin Service] Received AUTH_LOGIN event:', event.data);
        
        // Store tokens in local storage for this micro-frontend
        if (event.data.accessToken) {
          sessionStorage.setItem('accessToken', event.data.accessToken);
          localStorage.setItem('token', event.data.accessToken);
          console.log('[Admin Service] Stored accessToken:', event.data.accessToken);
        }
        if (event.data.refreshToken) {
          sessionStorage.setItem('refreshToken', event.data.refreshToken);
          console.log('[Admin Service] Stored refreshToken');
        }
        if (event.data.user) {
          sessionStorage.setItem('user', JSON.stringify(event.data.user));
          console.log('[Admin Service] Stored user data:', event.data.user);
        }
      } else if (event.data.type === 'AUTH_LOGOUT') {
        console.log('[Admin Service] Received AUTH_LOGOUT event');
        // Clear tokens on logout
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
      } else if (event.data.type === 'CHECK_TOKENS') {
        // For testing - send back token status
        const sessionToken = sessionStorage.getItem('accessToken');
        const localToken = localStorage.getItem('token');
        
        if (event.source) {
          (event.source as Window).postMessage({
            type: 'TOKEN_CHECK_RESULT',
            sessionToken: sessionToken,
            localToken: localToken
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request current auth state from parent if available
    try {
      window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*');
    } catch (error) {
      console.log('[Admin Service] No parent frame available');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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

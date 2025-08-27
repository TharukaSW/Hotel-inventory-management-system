import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InspectorLayout from './components/InspectorLayout';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import ItemRequests from './pages/ItemRequests';
import Inventory from './pages/Inventory';
import NewInspection from './pages/NewInspection';
import InspectionDetails from './pages/InspectionDetails';

const App: React.FC = () => {
  // Listen for auth events like admin service
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_LOGIN') {
        if (event.data.accessToken) {
          sessionStorage.setItem('accessToken', event.data.accessToken);
          localStorage.setItem('token', event.data.accessToken);
        }
        if (event.data.refreshToken) {
          sessionStorage.setItem('refreshToken', event.data.refreshToken);
        }
        if (event.data.user) {
          sessionStorage.setItem('user', JSON.stringify(event.data.user));
        }
      } else if (event.data.type === 'AUTH_LOGOUT') {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
      } else if (event.data.type === 'CHECK_TOKENS') {
        const sessionToken = sessionStorage.getItem('accessToken');
        const localToken = localStorage.getItem('token');
        if (event.source) {
          (event.source as Window).postMessage({
            type: 'TOKEN_CHECK_RESULT',
            sessionToken,
            localToken
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    try { window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*'); } catch {}
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
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
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

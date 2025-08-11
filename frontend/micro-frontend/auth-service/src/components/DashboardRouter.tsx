import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user || redirecting) return;

    console.log('DashboardRouter: User found:', user);
    setRedirecting(true);

    // Check if target service is available before redirecting
    const checkServiceAndRedirect = async () => {
      let targetUrl = '';
      switch (user.role) {
        case 'ADMIN':
          targetUrl = 'http://localhost:3000';
          break;
        case 'STOCK_MANAGER':
          targetUrl = 'http://localhost:3002';
          break;
        case 'FRONT_DESK':
          targetUrl = 'http://localhost:3003';
          break;
        default:
          console.error('Unknown role:', user.role);
          setRedirecting(false);
          return;
      }

      try {
        // Try to fetch the target service
        const response = await fetch(targetUrl, { method: 'HEAD', mode: 'no-cors' });
        console.log(`Service check for ${targetUrl}:`, response);
        
        // Wait a moment then redirect
        setTimeout(() => {
          console.log(`Redirecting to ${targetUrl}...`);
          window.location.href = targetUrl;
        }, 1000);
      } catch (error) {
        console.log(`Service ${targetUrl} not available:`, error);
        // Don't redirect, show manual links
        setTimeout(() => setRedirecting(false), 2000);
      }
    };

    checkServiceAndRedirect();
  }, [user, redirecting]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Welcome, {user?.firstName} {user?.lastName}!
        </h2>
        <p className="text-gray-500 mb-4">
          Redirecting you to your {user?.role?.toLowerCase().replace('_', ' ')} dashboard...
        </p>
        
        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-4">
          <p>Role: {user?.role}</p>
          <p>Target: {user?.role === 'ADMIN' ? 'localhost:3000' : user?.role === 'STOCK_MANAGER' ? 'localhost:3002' : 'localhost:3003'}</p>
        </div>
        
        {/* Fallback manual links */}
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-600">If redirect doesn't work, click below:</p>
          <div className="space-x-4">
            {user?.role === 'ADMIN' && (
              <a 
                href="http://localhost:3000" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                target="_self"
              >
                Go to Admin Dashboard
              </a>
            )}
            {user?.role === 'STOCK_MANAGER' && (
              <a 
                href="http://localhost:3002" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                target="_self"
              >
                Go to Inspector Dashboard
              </a>
            )}
            {user?.role === 'FRONT_DESK' && (
              <a 
                href="http://localhost:3003" 
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                target="_self"
              >
                Go to Front Desk Dashboard
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRouter;

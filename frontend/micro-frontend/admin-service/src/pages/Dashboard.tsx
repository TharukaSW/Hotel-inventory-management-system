import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  AlertTriangle,
  Banknote,
  ShoppingCart,
  Building2
} from 'lucide-react';
import { apiService } from '@hotel-inventory/shared-lib';
import { InventoryItem } from '@hotel-inventory/shared-lib';
import { formatCurrency } from '@hotel-inventory/shared-lib';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState<InventoryItem[]>([]);
  const [recentItemRequests, setRecentItemRequests] = useState<any[]>([]);
  const [prevStats, setPrevStats] = useState<typeof stats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const [items, categories, suppliers] = await Promise.all([
        apiService.getAllInventoryItems(),
        apiService.getAllCategories(),
        apiService.getAllSuppliers()
      ]);
      const lowStockItems = items.filter(item => item.quantity <= 10 && item.quantity > 0);
      const outOfStockItems = items.filter(item => item.quantity === 0);
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newStats = {
        totalItems: items.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        lowStockItems: lowStockItems.length,
        outOfStockItems: outOfStockItems.length,
        totalValue
      };
      setPrevStats(prev => prev ? { ...stats } : prevStats); // keep first prev as null
      setStats(newStats);
      setRecentItems(items.slice(0, 5));
      // Fetch recent activity (items + item requests)
      try {
        // Dynamic API base (must be provided)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || (window as any)?.__API_BASE_URL__ || '';
        if (apiBase) {
          const activityResp = await fetch(`${apiBase.replace(/\/$/, '')}/admin/recent-activity`, { credentials: 'include' });
          if (activityResp.ok) {
            const activityData = await activityResp.json();
            setRecentItems(activityData.recentItems || []);
            setRecentItemRequests(activityData.recentItemRequests || []);
          }
        }
      } catch (e) {
        // ignore activity errors
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial auth check via backend cookie
  useEffect(() => {
    const checkAuthDirect = async () => {
      try {
        const user = await apiService.currentUser();
        if (user && user.id) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        // not authenticated; wait for postMessage
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuthDirect();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_LOGIN') {
        setIsAuthenticated(true);
        setAuthChecked(true);
        setTimeout(() => fetchDashboardData(), 0);
      } else if (event.data.type === 'AUTH_LOGOUT') {
        setIsAuthenticated(false);
        setAuthChecked(true);
        setStats({
          totalItems: 0,
          totalCategories: 0,
          totalSuppliers: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          totalValue: 0
        });
        setRecentItems([]);
      }
    };
    window.addEventListener('message', handleMessage);
    window.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchDashboardData();
  }, [isAuthenticated]);

  // Once auth has been checked and user not authenticated, show message
  if (!isAuthenticated && authChecked) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-gray-600">You must be logged in as admin to view the dashboard.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const computeChange = (current: number, prev: number | undefined | null) => {
    if (!prev || prev === 0) return { change: '+0%', changeType: 'positive' as const };
    const diff = ((current - prev) / prev) * 100;
    const rounded = Math.round(diff);
    return {
      change: `${diff >= 0 ? '+' : ''} ${rounded}%`,
      changeType: diff >= 0 ? 'positive' as const : 'negative' as const
    };
  };

  // Ensures currency always displays as LKR even if an old cached formatter returns '$'
  const toLKR = (amount: number) => {
    const base = formatCurrency(amount);
    if (base.startsWith('$')) {
      // Replace leading $ with LKR and space
      return 'LKR ' + base.substring(1).trim();
    }
    return base;
  };

  const statCards = (() => {
    const ps = prevStats;
    const totalItemsChange = computeChange(stats.totalItems, ps?.totalItems);
    const totalCategoriesChange = computeChange(stats.totalCategories, ps?.totalCategories);
    const totalSuppliersChange = computeChange(stats.totalSuppliers, ps?.totalSuppliers);
    const lowStockChange = computeChange(stats.lowStockItems, ps?.lowStockItems);
    const outOfStockChange = computeChange(stats.outOfStockItems, ps?.outOfStockItems);
    const totalValueChange = computeChange(stats.totalValue, ps?.totalValue);
    return [
      {
        name: 'Total Items',
        value: stats.totalItems,
        icon: Package,
        color: 'bg-blue-500',
        change: totalItemsChange.change,
        changeType: totalItemsChange.changeType
      },
      {
        name: 'Total Categories',
        value: stats.totalCategories,
        icon: Building2,
        color: 'bg-green-500',
        change: totalCategoriesChange.change,
        changeType: totalCategoriesChange.changeType
      },
      {
        name: 'Total Suppliers',
        value: stats.totalSuppliers,
        icon: Users,
        color: 'bg-purple-500',
        change: totalSuppliersChange.change,
        changeType: totalSuppliersChange.changeType
      },
      {
        name: 'Low Stock Items',
        value: stats.lowStockItems,
        icon: AlertTriangle,
        color: 'bg-yellow-500',
        change: lowStockChange.change,
        changeType: lowStockChange.changeType
      },
      {
        name: 'Out of Stock',
        value: stats.outOfStockItems,
        icon: ShoppingCart,
        color: 'bg-red-500',
        change: outOfStockChange.change,
        changeType: outOfStockChange.changeType
      },
      {
        name: 'Total Value',
  value: toLKR(stats.totalValue),
  icon: Banknote,
        color: 'bg-indigo-500',
        change: totalValueChange.change,
        changeType: totalValueChange.changeType
      }
    ];
  })();

  if (loading && isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Hotel Inventory Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Inventory Items</h3>
        </div>
        <div className="p-6">
          {recentItems.length > 0 ? (
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Category: {item.category?.name || 'N/A'} | 
                      Supplier: {item.supplier?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">{toLKR(item.price || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent items found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-blue-600 mr-3" />
                <span>Add New Item</span>
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-green-600 mr-3" />
                <span>Manage Categories</span>
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span>Manage Suppliers</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentItems.slice(0,3).map(item => (
              <div key={`item-${item.id}`} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New inventory item: {item.name}</p>
                  <p className="text-xs text-gray-500">Category: {item.category?.name || 'N/A'}</p>
                </div>
              </div>
            ))}
            {recentItemRequests.slice(0,3).map(req => (
              <div key={`req-${req.id}`} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${req.status === 'APPROVED' ? 'bg-green-500' : req.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Item request {req.status.toLowerCase()}: {req.itemName}</p>
                  <p className="text-xs text-gray-500">Qty: {req.requestedQuantity} • Location: {req.locationType} {req.locationIdentifier}</p>
                </div>
              </div>
            ))}
            {recentItems.length === 0 && recentItemRequests.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
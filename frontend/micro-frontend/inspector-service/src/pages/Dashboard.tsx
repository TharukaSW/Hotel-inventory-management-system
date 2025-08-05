import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  List, 
  Package, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    activeInspections: 0,
    completedInspections: 0,
    pendingRequests: 0,
    approvedRequests: 0
  });

  useEffect(() => {
    // TODO: Fetch stats from API
    setStats({
      activeInspections: 2,
      completedInspections: 15,
      pendingRequests: 3,
      approvedRequests: 8
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, to }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
    to?: string;
  }) => {
    const content = (
      <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color}`}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="text-lg font-medium text-gray-900">{value}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inspector Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your inspection dashboard. Manage inspections and item requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Inspections"
          value={stats.activeInspections}
          icon={ClipboardList}
          color="border-blue-500"
          to="/inspections"
        />
        <StatCard
          title="Completed Inspections"
          value={stats.completedInspections}
          icon={CheckCircle}
          color="border-green-500"
          to="/inspections"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          color="border-yellow-500"
          to="/item-requests"
        />
        <StatCard
          title="Approved Requests"
          value={stats.approvedRequests}
          icon={List}
          color="border-purple-500"
          to="/item-requests"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/inspections/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ClipboardList className="-ml-1 mr-2 h-5 w-5" />
              Start New Inspection
            </Link>
            <Link
              to="/inventory"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Package className="-ml-1 mr-2 h-5 w-5" />
              View Inventory
            </Link>
            <Link
              to="/item-requests"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <List className="-ml-1 mr-2 h-5 w-5" />
              My Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <ClipboardList className="h-4 w-4 mr-2 text-blue-500" />
              Started inspection for Room 204 - 2 hours ago
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Completed kitchen inspection - 1 day ago
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <List className="h-4 w-4 mr-2 text-purple-500" />
              Requested 5 towels for Room 301 - 2 days ago
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              Found damaged items in Room 105 - 3 days ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

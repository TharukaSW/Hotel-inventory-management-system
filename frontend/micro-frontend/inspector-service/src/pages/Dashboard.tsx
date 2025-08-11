import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  List, 
  Package, 
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getInspections, getItemRequests } from '../services/inspectorService';
import { useToast } from '../components/Toast';

interface DashboardStats {
  activeInspections: number;
  completedInspections: number;
  totalInspections: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequests: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeInspections: 0,
    completedInspections: 0,
    totalInspections: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const { showSuccess, showError } = useToast();

  const fetchDashboardData = async () => {
    try {
      const [inspectionsData, requestsData] = await Promise.all([
        getInspections(),
        getItemRequests().catch(() => []) // Fallback to empty array if requests fail
      ]);

      // Calculate inspection stats
      const inspections = inspectionsData || [];
      const activeInspections = inspections.filter((i: any) => i.status === 'IN_PROGRESS').length;
      const completedInspections = inspections.filter((i: any) => i.status === 'COMPLETED').length;
      const totalInspections = inspections.length;

      // Calculate request stats
      const requests = requestsData || [];
      const pendingRequests = requests.filter((r: any) => r.status === 'PENDING').length;
      const approvedRequests = requests.filter((r: any) => r.status === 'APPROVED').length;
      const rejectedRequests = requests.filter((r: any) => r.status === 'REJECTED').length;
      const totalRequests = requests.length;

      setStats({
        activeInspections,
        completedInspections,
        totalInspections,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalRequests
      });

      // Get recent inspections (last 3)
      const sortedInspections = inspections
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      setRecentInspections(sortedInspections);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to Load', 'Could not fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboardData();
    showSuccess('Refreshed', 'Dashboard data has been updated.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspector Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to your inspection dashboard. Manage inspections and item requests.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
            {recentInspections.length > 0 ? (
              recentInspections.map((inspection: any) => (
                <div key={inspection.id} className="flex items-center text-sm text-gray-600">
                  {inspection.status === 'COMPLETED' ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  ) : inspection.status === 'IN_PROGRESS' ? (
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                  ) : (
                    <ClipboardList className="h-4 w-4 mr-2 text-blue-500" />
                  )}
                  <span>
                    {inspection.status === 'COMPLETED' ? 'Completed' : 'Started'} {inspection.locationType.toLowerCase()} inspection for {inspection.locationIdentifier} - {formatDate(inspection.status === 'COMPLETED' ? inspection.completedAt || inspection.updatedAt : inspection.startedAt)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No recent activity found. Start your first inspection!
              </div>
            )}
            
            {/* Show summary stats if we have data */}
            {stats.totalInspections > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Total Statistics:</span>
                  <span>
                    {stats.completedInspections} completed, {stats.activeInspections} active 
                    {stats.totalRequests > 0 && `, ${stats.totalRequests} requests`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

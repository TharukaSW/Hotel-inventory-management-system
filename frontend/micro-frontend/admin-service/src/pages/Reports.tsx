import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Banknote,
  Download
} from 'lucide-react';
import { apiService } from '@hotel-inventory/shared-lib';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventoryItem, Category, Supplier } from '@hotel-inventory/shared-lib';
import { formatCurrency } from '@hotel-inventory/shared-lib';
// Ensure any lingering $-prefixed formatted amounts are displayed as LKR consistently.
const toLKR = (amount: number) => {
  const base = formatCurrency(amount);
  if (base.startsWith('$')) {
    return 'LKR ' + base.substring(1).trim();
  }
  return base;
};
import { useToast } from '../components/ToastContainer';

const Reports: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleExportReport = async () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const marginX = 40;
      let cursorY = 50;

      // Title
      doc.setFontSize(18);
      doc.text('Inventory Report', marginX, cursorY);
      doc.setFontSize(11);
      cursorY += 18;
      doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, cursorY);
      cursorY += 14;
      doc.text(`Period: ${selectedPeriod}`, marginX, cursorY);

      // Summary Table
      cursorY += 24;
      autoTable(doc, {
        startY: cursorY,
        head: [['Metric', 'Value']],
        body: [
          ['Total Items', String(totalItems)],
          ['Total Value', toLKR(totalValue)],
          ['Low Stock Items', String(lowStockItems)],
          ['Out of Stock Items', String(outOfStockItems)]
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      cursorY = (doc as any).lastAutoTable.finalY + 25;

      // Inventory Items Table (paginate automatically)
      autoTable(doc, {
        startY: cursorY,
        head: [['ID','Name','Category','Supplier','Qty','Price','Total','Status']],
        body: items.map(item => [
          item.id,
          item.name,
          item.category?.name || 'N/A',
          item.supplier?.name || 'N/A',
          item.quantity,
          toLKR(item.price),
          toLKR(item.price * item.quantity),
          item.quantity === 0 ? 'Out of Stock' : item.quantity <= 10 ? 'Low Stock' : 'In Stock'
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [52, 73, 94] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 32 }, 4: { cellWidth: 34 } }
      });

      // Footer (page numbers)
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - marginX - 60, doc.internal.pageSize.getHeight() - 20);
      }

      doc.save(`inventory-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
      showSuccess('PDF report generated');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      showError('Failed to export PDF', 'Please try again.');
    }
  };

  const fetchReportData = async () => {
    try {
      const [itemsData, categoriesData, suppliersData] = await Promise.all([
        apiService.getAllInventoryItems(),
        apiService.getAllCategories(),
        apiService.getAllSuppliers()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate report statistics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockItems = items.filter(item => item.quantity <= 10 && item.quantity > 0).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;

  // Category distribution
  const categoryStats = categories.map(category => {
    const categoryItems = items.filter(item => item.category?.id === category.id);
    const categoryValue = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      name: category.name,
      count: categoryItems.length,
      value: categoryValue
    };
  });

  // Supplier distribution
  const supplierStats = suppliers.map(supplier => {
    const supplierItems = items.filter(item => item.supplier?.id === supplier.id);
    const supplierValue = supplierItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      name: supplier.name,
      count: supplierItems.length,
      value: supplierValue
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">View system reports and analytics</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            onClick={handleExportReport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <Banknote className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">{toLKR(totalValue)}</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
              <p className="text-xs text-red-600">-3% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{outOfStockItems}</p>
              <p className="text-xs text-red-600">+2% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Category Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categoryStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{stat.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{stat.count} items</div>
                    <div className="text-xs text-gray-500">{toLKR(stat.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Supplier Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {supplierStats.slice(0, 5).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-green-500' :
                      index === 3 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{stat.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{stat.count} items</div>
                    <div className="text-xs text-gray-500">{toLKR(stat.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">New item added</p>
                <p className="text-sm text-gray-500">"Premium Towels" was added to inventory</p>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Stock updated</p>
                <p className="text-sm text-gray-500">"Coffee Beans" quantity increased by 50</p>
              </div>
              <div className="text-sm text-gray-500">4 hours ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                <p className="text-sm text-gray-500">"Toilet Paper" is running low (5 remaining)</p>
              </div>
              <div className="text-sm text-gray-500">6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 
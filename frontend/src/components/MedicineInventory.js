import { useState } from 'react';
import { Package, Search, AlertTriangle, CheckCircle, Calendar, TrendingDown, Plus, Download } from 'lucide-react';
import { medicineInventory } from '../mockData';

export default function MedicineInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredInventory = medicineInventory
    .filter(med => {
      const searchMatch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.category.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = filterStatus === 'all' || med.status === filterStatus;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return b.stock - a.stock;
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      return 0;
    });

  const stats = {
    total: medicineInventory.length,
    critical: medicineInventory.filter(m => m.status === 'critical').length,
    low: medicineInventory.filter(m => m.status === 'low').length,
    adequate: medicineInventory.filter(m => m.status === 'adequate').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800';
      case 'low':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'adequate':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };

  const getStockIcon = (status) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'low':
        return <TrendingDown className="w-5 h-5 text-amber-500" />;
      case 'adequate':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
          Medicine Inventory
        </h1>
        <p className="text-muted-foreground">Track and manage medicine stock levels</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Medicines</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-red-200 dark:border-red-900 shadow-sm p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Critical Stock</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-amber-200 dark:border-amber-900 shadow-sm p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.low}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-green-200 dark:border-green-900 shadow-sm p-5 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Adequate Stock</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.adequate}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines by name or category..."
            className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="search-medicine"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          data-testid="filter-status"
        >
          <option value="all">All Status</option>
          <option value="critical">Critical</option>
          <option value="low">Low</option>
          <option value="adequate">Adequate</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          data-testid="sort-by"
        >
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="expiry">Sort by Expiry</option>
        </select>

        <button 
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          data-testid="add-medicine-btn"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Medicine</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Current Stock</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Min. Required</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Expiry Date</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((medicine, index) => (
                <tr 
                  key={medicine.id}
                  data-testid={`medicine-row-${index}`}
                  className="border-b border-border hover:bg-accent/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{medicine.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {medicine.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{medicine.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-foreground">{medicine.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-muted-foreground">{medicine.minStock}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {getStockIcon(medicine.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(medicine.status)}`}>
                        {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(medicine.expiryDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="px-3 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                        data-testid={`update-stock-btn-${index}`}
                      >
                        Update
                      </button>
                      <button 
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/80 transition-colors"
                        data-testid={`view-details-btn-${index}`}
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
              No Medicines Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button 
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          data-testid="export-inventory-btn"
        >
          <Download className="w-5 h-5" />
          Export Inventory
        </button>
        <button 
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          data-testid="generate-order-btn"
        >
          Generate Purchase Order
        </button>
      </div>
    </div>
  );
}

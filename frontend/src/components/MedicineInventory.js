import { useState, useEffect } from 'react';
import { Package, Search, AlertTriangle, CheckCircle, Calendar, TrendingDown, Plus, Download, Edit, X, Building, Hash } from 'lucide-react';
import { medicineInventory as initialMedicines, getStockStatus, getInventoryStats } from '../mockData';
import { toast } from './ui/sonner';

export default function MedicineInventory() {
  // Load medicines from localStorage
  const [medicines, setMedicines] = useState(() => {
    const savedMedicines = localStorage.getItem('gramcare_medicines');
    if (savedMedicines) {
      try {
        return JSON.parse(savedMedicines);
      } catch (error) {
        return initialMedicines;
      }
    }
    return initialMedicines;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: 'Analgesic',
    stock: '',
    minStock: '',
    expiryDate: '',
    manufacturer: '',
    batchNumber: '',
    unit: 'Tablets'
  });
  const [stats, setStats] = useState(getInventoryStats(initialMedicines));

  // Save medicines to localStorage and update stats
  useEffect(() => {
    localStorage.setItem('gramcare_medicines', JSON.stringify(medicines));
    setStats(getInventoryStats(medicines));
  }, [medicines]);

  // Filter and sort medicines
  const filteredInventory = medicines
    .filter(med => {
      const searchMatch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.category.toLowerCase().includes(searchQuery.toLowerCase());
      const status = getStockStatus(med.stock, med.minStock);
      const statusMatch = filterStatus === 'all' || status === filterStatus;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return b.stock - a.stock;
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      return 0;
    });

  // Handle edit button click
  const handleEditClick = (medicine) => {
    setEditingMedicine({...medicine});
    setShowEditModal(true);
  };

  // Handle update medicine
  const handleUpdateMedicine = () => {
    if (!editingMedicine.stock || !editingMedicine.minStock) {
      alert('Please enter stock and minimum stock values');
      return;
    }

    const updatedMedicines = medicines.map(med => 
      med.id === editingMedicine.id ? editingMedicine : med
    );

    setMedicines(updatedMedicines);
    setShowEditModal(false);
    setEditingMedicine(null);
  };

  // Handle add new medicine
  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.stock || !newMedicine.minStock) {
      alert('Please fill in medicine name, current stock, and minimum stock');
      return;
    }

    // Generate new ID
    const maxId = Math.max(...medicines.map(m => parseInt(m.id.substring(1))));
    const newId = `M${String(maxId + 1).padStart(3, '0')}`;

    const medicineToAdd = {
      id: newId,
      name: newMedicine.name,
      category: newMedicine.category,
      stock: parseInt(newMedicine.stock),
      minStock: parseInt(newMedicine.minStock),
      expiryDate: newMedicine.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      manufacturer: newMedicine.manufacturer || 'Not specified',
      batchNumber: newMedicine.batchNumber || 'N/A',
      unit: newMedicine.unit
    };

    setMedicines([...medicines, medicineToAdd]);
    setShowAddModal(false);
    
    // Show success toast
    toast.success('Medicine Added Successfully! 💊', {
      description: `${newMedicine.name} has been added to inventory with ${newMedicine.stock} units.`,
      duration: 3000
    });
    
    // Reset form
    setNewMedicine({
      name: '',
      category: 'Analgesic',
      stock: '',
      minStock: '',
      expiryDate: '',
      manufacturer: '',
      batchNumber: '',
      unit: 'Tablets'
    });
  };

  // Get status badge color
  const getStatusColor = (medicine) => {
    const status = getStockStatus(medicine.stock, medicine.minStock);
    if (status === 'critical') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300';
    if (status === 'low') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300';
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300';
  };

  // Get card border color
  const getCardBorderColor = (medicine) => {
    const status = getStockStatus(medicine.stock, medicine.minStock);
    if (status === 'critical') return 'border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/10';
    if (status === 'low') return 'border-yellow-300 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/10';
    return 'border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-950/10';
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
          Medicine Inventory
        </h1>
        <p className="text-muted-foreground">Track and manage medicine stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Medicines</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Critical Stock</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.critical}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.low}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Adequate Stock</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.adequate}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Medicine
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('critical')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'critical'
                ? 'bg-primary text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterStatus('low')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'low'
                ? 'bg-primary text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Low
          </button>
          <button
            onClick={() => setFilterStatus('adequate')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'adequate'
                ? 'bg-primary text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Adequate
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="expiry">Sort by Expiry</option>
        </select>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((medicine) => {
          const status = getStockStatus(medicine.stock, medicine.minStock);
          const percentage = (medicine.stock / medicine.minStock * 100).toFixed(0);
          
          return (
            <div
              key={medicine.id}
              className={`border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-lg ${getCardBorderColor(medicine)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1" style={{fontFamily: 'Manrope'}}>
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{medicine.category}</p>
                </div>
                <button
                  onClick={() => handleEditClick(medicine)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    status === 'critical' 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : status === 'low'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  title="Update Medicine Stock"
                >
                  Update
                </button>
              </div>

              {/* Stock Status Badge */}
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${getStatusColor(medicine)}`}>
                {status === 'critical' && '🔴'}
                {status === 'low' && '🟡'}
                {status === 'adequate' && '🟢'}
                {status.toUpperCase()} - {percentage}%
              </div>

              {/* Stock Info */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-bold text-foreground">{medicine.stock} {medicine.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Min Required:</span>
                  <span className="font-semibold text-foreground">{medicine.minStock} {medicine.unit}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status === 'critical' ? 'bg-red-500' :
                      status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Expiry: {new Date(medicine.expiryDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3 h-3" />
                  <span>{medicine.manufacturer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  <span>Batch: {medicine.batchNumber}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
            No Medicines Found
          </h3>
          <p className="text-muted-foreground">
            {searchQuery ? `No medicines match "${searchQuery}"` : 'No medicines in inventory'}
          </p>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && editingMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                Update Medicine Stock
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMedicine(null);
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Medicine Info Display */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                <h3 className="font-bold text-lg text-foreground mb-2">{editingMedicine.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p>ID: {editingMedicine.id}</p>
                  <p>Category: {editingMedicine.category}</p>
                  <p>Manufacturer: {editingMedicine.manufacturer}</p>
                  <p>Batch: {editingMedicine.batchNumber}</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingMedicine.stock}
                    onChange={(e) => setEditingMedicine({...editingMedicine, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingMedicine.minStock}
                    onChange={(e) => setEditingMedicine({...editingMedicine, minStock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editingMedicine.expiryDate}
                    onChange={(e) => setEditingMedicine({...editingMedicine, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={editingMedicine.batchNumber}
                    onChange={(e) => setEditingMedicine({...editingMedicine, batchNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Preview */}
              <div className="bg-accent/50 border border-border rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Status Preview:</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor({stock: editingMedicine.stock, minStock: editingMedicine.minStock})}`}>
                  <span className="font-bold">
                    {getStockStatus(editingMedicine.stock, editingMedicine.minStock).toUpperCase()}
                  </span>
                  <span>
                    ({((editingMedicine.stock / editingMedicine.minStock) * 100).toFixed(0)}% of minimum)
                  </span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMedicine(null);
                }}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMedicine}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Update Medicine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                Add New Medicine
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewMedicine({
                    name: '',
                    category: 'Analgesic',
                    stock: '',
                    minStock: '',
                    expiryDate: '',
                    manufacturer: '',
                    batchNumber: '',
                    unit: 'Tablets'
                  });
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Medicine Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  placeholder="e.g., Paracetamol 500mg"
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={newMedicine.category}
                    onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Antihypertensive">Antihypertensive</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Antacid">Antacid</option>
                    <option value="Antiplatelet">Antiplatelet</option>
                    <option value="Rehydration">Rehydration</option>
                    <option value="Supplement">Supplement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Unit Type
                  </label>
                  <select
                    value={newMedicine.unit}
                    onChange={(e) => setNewMedicine({...newMedicine, unit: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Tablets">Tablets</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Sachets">Sachets</option>
                    <option value="Vials">Vials</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Units">Units</option>
                    <option value="Strips">Strips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Stock */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newMedicine.stock}
                    onChange={(e) => setNewMedicine({...newMedicine, stock: e.target.value})}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Minimum Required */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newMedicine.minStock}
                    onChange={(e) => setNewMedicine({...newMedicine, minStock: e.target.value})}
                    placeholder="e.g., 50"
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({...newMedicine, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={newMedicine.manufacturer}
                    onChange={(e) => setNewMedicine({...newMedicine, manufacturer: e.target.value})}
                    placeholder="e.g., Sun Pharma"
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Batch Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Batch Number
                </label>
                <input
                  type="text"
                  value={newMedicine.batchNumber}
                  onChange={(e) => setNewMedicine({...newMedicine, batchNumber: e.target.value})}
                  placeholder="e.g., PAR-2024-001"
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Status Preview */}
              {newMedicine.stock && newMedicine.minStock && (
                <div className="bg-accent/50 border border-border rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Status Preview:</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor({
                    stock: parseInt(newMedicine.stock) || 0,
                    minStock: parseInt(newMedicine.minStock) || 1
                  })}`}>
                    <span className="font-bold">
                      {getStockStatus(
                        parseInt(newMedicine.stock) || 0,
                        parseInt(newMedicine.minStock) || 1
                      ).toUpperCase()}
                    </span>
                    <span>
                      ({(((parseInt(newMedicine.stock) || 0) / (parseInt(newMedicine.minStock) || 1)) * 100).toFixed(0)}% of minimum)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewMedicine({
                    name: '',
                    category: 'Analgesic',
                    stock: '',
                    minStock: '',
                    expiryDate: '',
                    manufacturer: '',
                    batchNumber: '',
                    unit: 'Tablets'
                  });
                }}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedicine}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

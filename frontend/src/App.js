import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  Home, Users, Calendar, Activity, Package, FileText, 
  Menu, X, Sun, Moon, Bell, Search, Settings, LogOut,
  UserPlus, Clock, AlertCircle
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./components/Dashboard";
import PatientRegistration from "./components/PatientRegistration";
import MedicalHistory from "./components/MedicalHistory";
import Appointments from "./components/Appointments";
import MedicineInventory from "./components/MedicineInventory";
import PatientSearch from "./components/PatientSearch";
import RHCConsultation from "./components/RHCConsultation";

function App({ onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "GramCare | RHC";
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App min-h-screen bg-background">
      <BrowserRouter>
        <AppContent 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          onLogout={onLogout}
        />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

function AppContent({ darkMode, setDarkMode, sidebarCollapsed, setSidebarCollapsed, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/register', icon: UserPlus, label: 'Register Patient' },
    { path: '/history', icon: Activity, label: 'Medical History' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/inventory', icon: Package, label: 'Medicine Inventory' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
        data-testid="sidebar"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <img 
                src="/gramcarelogo.png" 
                alt="GramCare Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg text-foreground" style={{fontFamily: 'Manrope'}}>
                GramCare
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md hover:bg-accent"
            data-testid="sidebar-toggle-btn"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`
                  flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white font-medium' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-2">
          <button 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            data-testid="settings-btn"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-green-500/10 hover:text-green-600 transition-colors"
            data-testid="switch-portal-btn"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Switch Portal</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 glass-effect border-b border-border flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                GramCare | Rural Health Centre
              </h1>
              <p className="text-xs text-muted-foreground">Dharampur, Gujarat</p>
            </div>
          </div>

          {/* Center - Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-gentle"></div>
            <span className="text-sm font-medium text-foreground">
              CHA: Priya Sharma | Server Active
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button 
              className="p-2 rounded-lg hover:bg-accent transition-colors relative"
              data-testid="notifications-btn"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            
            <button 
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              data-testid="search-btn"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              data-testid="dark-mode-toggle"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors text-sm"
              data-testid="switch-portal-btn"
              title="Go back to login page to switch portal"
            >
              ← Back to Login
            </button>

            <div className="flex items-center gap-2 ml-2">
              <img 
                src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ6MzR8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBkb2N0b3IlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NzAwNDAyMjR8MA&ixlib=rb-4.1.0&q=85"
                alt="GramCare Logo"
                className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                data-testid="logo-image"
              />
              <span className="font-bold text-foreground hidden md:block" style={{fontFamily: 'Manrope'}}>
                GramCare
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<PatientRegistration />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            <Route path="/history" element={<MedicalHistory />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patient-search" element={<PatientSearch />} />
            <Route path="/inventory" element={<MedicineInventory />} />
            <Route path="/consultation/:patientId" element={<RHCConsultation />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

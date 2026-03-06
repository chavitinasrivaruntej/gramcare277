import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  Home, Users, Calendar, Activity, FileText, 
  Menu, X, Sun, Moon, Bell, Search, Settings, LogOut,
  Stethoscope, ClipboardList, Video, UserCheck, BarChart3
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import PatientQueue from "./components/doctor/PatientQueue";
import ConsultationInterface from "./components/doctor/ConsultationInterfaceSimple";
import DoctorAppointments from "./components/doctor/DoctorAppointments";
import PatientHistoryDoctor from "./components/doctor/PatientHistoryDoctor";
import { doctorProfile } from "./mockDataDoctor";

function DoctorApp({ onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "GramCare | DP";
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App min-h-screen bg-background">
      <BrowserRouter>
        <DoctorAppContent 
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

function DoctorAppContent({ darkMode, setDarkMode, sidebarCollapsed, setSidebarCollapsed, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/queue', icon: ClipboardList, label: 'Patient Queue' },
    { path: '/consultation', icon: Stethoscope, label: 'Consultation' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/patient-history', icon: Activity, label: 'Patient History' },
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
              <div>
                <span className="font-bold text-lg text-foreground block" style={{fontFamily: 'Manrope'}}>
                  GramCare
                </span>
                <span className="text-xs text-muted-foreground">Doctor Portal</span>
              </div>
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

        {/* Doctor Profile Section */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={doctorProfile.avatar}
                alt={doctorProfile.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {doctorProfile.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {doctorProfile.specialization}
                </p>
              </div>
            </div>
            <button 
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors mb-2"
              data-testid="settings-btn"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Settings</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-muted-foreground hover:bg-green-500/10 hover:text-green-600 transition-colors"
              data-testid="switch-portal-btn"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Switch Portal</span>
            </button>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="p-4 border-t border-border space-y-2">
            <button 
              className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              data-testid="settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:bg-green-500/10 hover:text-green-600 transition-colors"
              data-testid="switch-portal-btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 glass-effect border-b border-border flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                GramCare Doctor Portal
              </h1>
              <p className="text-xs text-muted-foreground">Remote Consultation Platform</p>
            </div>
          </div>

          {/* Center - Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-gentle"></div>
            <span className="text-sm font-medium text-foreground">
              Online | 6 Patients Waiting
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
              className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 font-medium transition-colors text-sm"
              data-testid="switch-portal-btn"
              title="Go back to login page to switch portal"
            >
              ← Back to Login
            </button>

            <div className="flex items-center gap-2 ml-2">
              <img 
                src={doctorProfile.avatar}
                alt={doctorProfile.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                data-testid="doctor-avatar"
              />
              <span className="font-bold text-foreground hidden md:block" style={{fontFamily: 'Manrope'}}>
                {doctorProfile.name.split(' ')[1]}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Routes>
            <Route path="/" element={<DoctorDashboard />} />
            <Route path="/queue" element={<PatientQueue />} />
            <Route path="/consultation" element={<ConsultationInterface />} />
            <Route path="/consultation/:patientId" element={<ConsultationInterface />} />
            <Route path="/appointments" element={<DoctorAppointments />} />
            <Route path="/patient-history" element={<PatientHistoryDoctor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DoctorApp;

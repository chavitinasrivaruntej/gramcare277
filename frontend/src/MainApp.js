import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, Users, Calendar, Activity, Package, FileText, 
  Menu, X, Sun, Moon, Bell, Search, Settings, LogOut,
  UserPlus, Clock, AlertCircle, Stethoscope, ClipboardList, 
  Video, UserCheck, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Patient Portal Components
import Dashboard from "./components/Dashboard";
import PatientRegistration from "./components/PatientRegistration";
import MedicalHistory from "./components/MedicalHistory";
import Appointments from "./components/Appointments";
import MedicineInventory from "./components/MedicineInventory";
import PatientSearch from "./components/PatientSearch";

// Doctor Portal Components
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import PatientQueue from "./components/doctor/PatientQueue";
import ConsultationInterface from "./components/doctor/ConsultationInterface";
import DoctorAppointments from "./components/doctor/DoctorAppointments";
import PatientHistoryDoctor from "./components/doctor/PatientHistoryDoctor";
import NotificationPopup from "./components/doctor/NotificationPopup";
import PatientDashboardDemo from "./components/PatientDashboardDemo";

import { doctorProfile } from "./mockDataDoctor";
import { consultationEvents } from "./lib/consultationEvents";
import { Info, AlertCircle } from "lucide-react";

function MainApp() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App min-h-screen bg-background">
      <BrowserRouter>
        <AppRouter darkMode={darkMode} setDarkMode={setDarkMode} />
      </BrowserRouter>
    </div>
  );
}

function AppRouter({ darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDoctorPortal = location.pathname.startsWith('/doctor');

  return (
    <>
      {/* Portal Switcher - Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            if (isDoctorPortal) {
              navigate('/');
            } else {
              navigate('/doctor');
            }
          }}
          className="shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          {isDoctorPortal ? (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Switch to Patient Portal
            </>
          ) : (
            <>
              <Stethoscope className="w-5 h-5 mr-2" />
              Switch to Doctor Portal
            </>
          )}
        </Button>
      </div>

      <Routes>
        {/* Patient Portal Routes */}
        <Route path="/*" element={
          <PatientPortalLayout darkMode={darkMode} setDarkMode={setDarkMode} />
        } />
        
        {/* Patient Demo Portal Routes */}
        <Route path="/patient" element={<PatientDashboardDemo />} />

        {/* Doctor Portal Routes */}
        <Route path="/doctor/*" element={
          <DoctorPortalLayout darkMode={darkMode} setDarkMode={setDarkMode} />
        } />
      </Routes>
    </>
  );
}

function PatientPortalLayout({ darkMode, setDarkMode }) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
              <a
                key={item.path}
                href={item.path}
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
              </a>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border">
          <button 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            data-testid="settings-btn"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
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
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle"></div>
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
          </Routes>
        </main>
      </div>
    </div>
  );
}

function DoctorPortalLayout({ darkMode, setDarkMode }) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(() => consultationEvents.getNotifications());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleStorageChange = (e) => {
      // Refresh notifications list from storage
      const updated = consultationEvents.getNotifications();
      setNotifications(updated);

      // Handle new consultation event specifically if it's 'requested'
      const eventJson = localStorage.getItem('gramcare_consultation_event');
      if (eventJson) {
        try {
          const event = JSON.parse(eventJson);
          if (event.status === 'requested' && event.source === 'rural_health_centre') {
            // Check if this notification already exists to avoid dupes (id is random, so check patientId + source logic)
            const exists = updated.some(n => n.patientId === event.patientId && n.status === 'requested');
            if (!exists) {
               consultationEvents.addNotification({
                  title: 'Urgent Consultation Requested',
                  message: `${event.name} is waiting for consultation.`,
                  patientId: event.patientId,
                  status: 'requested',
                  type: 'urgent'
               });
            }
          }
        } catch (err) {
          console.error("Notification Event Parse Error", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    consultationEvents.markAsRead();
    setShowNotifications(false);
  };

  const navItems = [
    { path: '/doctor', icon: Home, label: 'Dashboard' },
    { path: '/doctor/queue', icon: ClipboardList, label: 'Patient Queue' },
    { path: '/doctor/consultation', icon: Stethoscope, label: 'Consultation' },
    { path: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctor/patient-history', icon: Activity, label: 'Patient History' },
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
              <a
                key={item.path}
                href={item.path}
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
              </a>
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
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              data-testid="settings-btn"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <button 
              className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              data-testid="settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NotificationPopup />
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
            <div className="relative">
              <button 
                className="p-2 rounded-lg hover:bg-accent transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
                data-testid="notifications-btn"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white animate-pulse shadow-sm"></span>
                )}
              </button>

              {/* Persistent Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 overflow-hidden ring-1 ring-black/5">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-blue-50/10 dark:bg-blue-900/10">
                    <h4 className="font-black text-xs text-[#1E3A8A] dark:text-blue-400 uppercase tracking-widest">Clinical Alerts</h4>
                    <button onClick={markAllRead} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter">Mark all as read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative ${n.unread ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''}`}>
                            {n.unread && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full"></div>}
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${n.type === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                 {n.type === 'urgent' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{n.title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{n.message}</p>
                                <p className="text-[9px] text-slate-400 mt-2 font-black uppercase tracking-tight">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-xs text-slate-400 font-bold tracking-tight">Clinical log is clear</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
                       <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">View All Incident Reports</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
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

export default MainApp;

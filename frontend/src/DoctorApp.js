import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  Home, Users, Calendar, Activity, FileText, 
  Menu, X, Sun, Moon, Bell, Search, Settings, LogOut,
  Stethoscope, ClipboardList, Video, UserCheck, BarChart3,
  ChevronRight, ArrowLeftRight
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import PatientQueue from "./components/doctor/PatientQueue";
import ConsultationSelection from "./components/doctor/ConsultationSelection";
import ConsultationInterface from "./components/doctor/ConsultationInterfaceSimple";
import DoctorAppointments from "./components/doctor/DoctorAppointments";
import PatientHistoryDoctor from "./components/doctor/PatientHistoryDoctor";
import { doctorProfile } from "./mockDataDoctor";

function DoctorApp({ onLogout }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.title = "GramCare | Specialist DP";
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App min-h-screen bg-background doctor-portal doctor-portal-bg">
      <BrowserRouter>
        <DoctorAppContent 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={onLogout}
        />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

function DoctorAppContent({ darkMode, setDarkMode, onLogout }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/queue', icon: ClipboardList, label: 'Patient Queue' },
    { path: '/consultation', icon: Stethoscope, label: 'Consultation' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/patient-history', icon: Activity, label: 'Patient History' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Premium Hover-Expand Sidebar */}
      <aside 
        className={`h-screen bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-[100] sb-transition ${
          isExpanded ? 'doctor-sidebar-expanded' : 'w-[var(--sb-collapsed)]'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 overflow-hidden">
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0 sb-text-reveal' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                <span className="font-black text-xl text-[#1E3A8A] dark:text-blue-400 block leading-none tracking-tighter">
                  GramCare
                </span>
                <span className="text-[10px] uppercase font-black text-blue-500/50 tracking-widest mt-0.5 block">Doctor Portal</span>
              </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 h-12 rounded-2xl transition-all duration-300 px-3 relative group
                  ${isActive ? 'nav-active' : 'text-slate-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:text-primary'}
                `}
              >
                <div className="w-8 flex justify-center shrink-0">
                   <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                </div>
                
                <span className={`font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'opacity-100 translate-x-0 sb-text-reveal' : 'opacity-0 translate-x-4 pointer-events-none'
                }`}>
                  {item.label}
                </span>

                {isActive && !isExpanded && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Doctor Profile Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
            <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700' : ''}`}>
              <img 
                src={doctorProfile.avatar}
                alt={doctorProfile.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-700 shrink-0 shadow-sm"
              />
              <div className={`flex-1 min-w-0 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0 sb-text-reveal' : 'opacity-0 translate-x-8 pointer-events-none text-transparent'}`}>
                <p className="text-sm font-black text-[#1E3A8A] dark:text-blue-400 truncate">
                  {doctorProfile.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                  {doctorProfile.specialization}
                </p>
              </div>
            </div>

            <div className={`mt-4 space-y-1 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <button className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-bold">Clinical Settings</span>
               </button>
               <button 
                  onClick={onLogout}
                  className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="text-xs font-bold">Switch to Health Center</span>
               </button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden doctor-main-content">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-8 z-[50]">
          <div className="flex items-center gap-4">
             <div className="h-10 w-1 bg-primary/20 rounded-full hidden lg:block"></div>
             <div>
                <h1 className="text-xl font-black text-[#1E3A8A] dark:text-blue-400 tracking-tight">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Clinic console'}
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">GramCare Vision Telemedicine</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Status Pill */}
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="mini" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="h-4 w-px bg-blue-200 dark:bg-blue-800"></div>
               <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">6 in Queue</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
              </button>
              
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all duration-300">
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

              <button
                onClick={onLogout}
                className="h-10 px-5 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Exit Portal
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 custom-scrollbar p-6">
          <Routes>
            <Route path="/" element={<DoctorDashboard />} />
            <Route path="/queue" element={<PatientQueue />} />
            <Route path="/consultation" element={<ConsultationSelection />} />
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

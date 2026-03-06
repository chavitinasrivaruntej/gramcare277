import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Clock, CheckCircle, AlertTriangle, 
  Activity, Thermometer, Heart, Wind,
  Phone, Ambulance, Hospital, TrendingUp
} from 'lucide-react';
import { emergencyContacts, appointments as initialAppointments, getQuickStats } from '../mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const liveQueueRef = useRef(null);
  
  // Load appointments from localStorage or use initial data
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('gramcare_appointments');
    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments);
        // Convert scheduledTime back to Date objects
        return parsed.map(apt => ({
          ...apt,
          scheduledTime: new Date(apt.scheduledTime)
        }));
      } catch (error) {
        console.error('Error loading appointments:', error);
        return initialAppointments;
      }
    }
    return initialAppointments;
  });
  
  const [stats, setStats] = useState(getQuickStats(appointments));

  // Update stats whenever appointments change
  useEffect(() => {
    setStats(getQuickStats(appointments));
  }, [appointments]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gramcare_appointments' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const updated = parsed.map(apt => ({
            ...apt,
            scheduledTime: new Date(apt.scheduledTime)
          }));
          setAppointments(updated);
        } catch (error) {
          console.error('Error syncing appointments:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get today's date (matching mockData)
  const today = new Date('2026-02-06').toISOString().split('T')[0];
  
  // Filter today's appointments - only active and upcoming (exclude completed)
  const todayAppointments = appointments
    .filter(a => a.date === today && a.status !== 'completed')
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  const criticalPatients = todayAppointments.filter(a => a.priority === 'high');

  // Smooth scroll to Live Queue section
  const scrollToLiveQueue = () => {
    liveQueueRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Patients Today"
          value={stats.patientsToday}
          color="bg-green-500"
          testId="stat-patients-today"
          onClick={() => navigate('/appointments')}
          clickable={true}
        />
        <StatCard
          icon={Clock}
          label="In Queue"
          value={stats.inQueue}
          color="bg-amber-500"
          testId="stat-in-queue"
          onClick={scrollToLiveQueue}
          clickable={true}
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed}
          color="bg-green-500"
          testId="stat-completed"
        />
        <StatCard
          icon={AlertTriangle}
          label="Critical"
          value={stats.critical}
          color="bg-red-500"
          testId="stat-critical"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Patient Queue */}
        <div ref={liveQueueRef} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6 card-hover scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
              Live Patient Queue
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle"></div>
              <span>Live Updates</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment, index) => {
                const isActive = appointment.status === 'active';
                const isUpcoming = appointment.status === 'scheduled';
                const isPriority = appointment.priority === 'high';
                
                return (
                  <div
                    key={appointment.id}
                    data-testid={`patient-queue-item-${index}`}
                    className={`
                      p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                      ${isPriority && isActive
                        ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900 animate-pulse-gentle' 
                        : isActive
                        ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900'
                        : isUpcoming
                        ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
                        : 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xs
                          ${isPriority && isActive ? 'bg-red-600' : 
                            isActive ? 'bg-red-500' :
                            isUpcoming ? 'bg-green-500' : 'bg-amber-500'}
                        `}>
                          {appointment.time.split(':')[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{appointment.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.age ? `Age: ${appointment.age} | ` : ''}{appointment.complaint}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`
                            status-dot
                            ${isPriority && isActive ? 'status-critical' :
                              isActive ? 'bg-red-500' :
                              isUpcoming ? 'bg-green-500' : 'bg-amber-500'}
                          `}></span>
                          <span className="text-sm font-medium capitalize">
                            {isActive ? (isPriority ? '🚨 Urgent' : 'Active') : 'Scheduled'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{appointment.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No appointments in queue</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Emergency Action Hub */}
          <div className="bg-card rounded-xl border-2 border-red-200 shadow-sm p-6 emergency-card dark:bg-red-950/20 dark:border-red-900">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                Emergency Hub
              </h2>
            </div>
            
            {criticalPatients.length > 0 ? (
              <div className="space-y-3 mb-4" data-testid="emergency-patients-list">
                {criticalPatients.map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-semibold text-foreground">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.complaint}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">⚠️ Priority: HIGH | {appointment.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No critical cases at the moment</p>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">Emergency Contacts</h3>
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-2 text-sm p-2 rounded hover:bg-accent">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button 
                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                data-testid="call-ambulance-btn"
              >
                <Ambulance className="w-5 h-5" />
                Call Ambulance
              </button>
              <button 
                className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                data-testid="refer-patient-btn"
              >
                <Hospital className="w-5 h-5" />
                Refer to Hospital
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, testId, onClick, clickable }) {
  return (
    <div 
      className={`bg-card rounded-xl border border-border shadow-sm p-6 card-hover animate-slide-in ${
        clickable ? 'cursor-pointer transition-transform hover:scale-105' : ''
      }`}
      data-testid={testId}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {clickable && (
        <p className="text-xs text-primary mt-2 font-medium">Click to view →</p>
      )}
    </div>
  );
}

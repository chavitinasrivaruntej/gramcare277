import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Clock, CheckCircle, AlertTriangle, 
  Activity, Thermometer, Heart, Wind,
  Phone, Ambulance, Hospital, TrendingUp, PlayCircle
} from 'lucide-react';
import { emergencyContacts, appointments as initialAppointments, getQuickStats } from '../mockData';

import { useUnifiedData } from '../hooks/useUnifiedData';

export default function Dashboard() {
  const navigate = useNavigate();
  const liveQueueRef = useRef(null);
  const { patients } = useUnifiedData();

  // Calculate stats dynamically from unified data
  const stats = {
    patientsToday: patients.length,
    inQueue: patients.filter(p => ['waiting', 'scheduled', 'urgent', 'in_progress'].includes(p.status)).length,
    completed: patients.filter(p => p.status === 'completed').length,
    critical: patients.filter(p => (p.priority === 'high' || p.priority === 'critical' || p.priority === 'urgent') && p.status !== 'completed').length
  };

  // Filter today's appointments - active and upcoming (exclude completed)
  // sorting by appointment time
  const activeQueue = patients
    .filter(p => p.status !== 'completed')
    .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
    
  const criticalPatients = activeQueue.filter(p => p.priority === 'high' || p.priority === 'urgent' || p.priority === 'critical');

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
            {activeQueue.length > 0 ? (
              activeQueue.map((appointment, index) => {
                const isActive = appointment.status === 'in_progress' || appointment.status === 'in-progress';
                const isUpcoming = appointment.status === 'scheduled' || appointment.status === 'waiting';
                const isPriority = appointment.priority === 'high' || appointment.priority === 'critical' || appointment.priority === 'urgent';
                const apptTime = new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div
                    key={appointment.patientId}
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
                          w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xs
                          ${isPriority && isActive ? 'bg-red-600' : 
                            isActive ? 'bg-red-500' :
                            isUpcoming ? 'bg-green-500' : 'bg-amber-500'}
                        `}>
                          {appointment.tokenId?.split('-')[1] || appointment.tokenId}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{appointment.name}</h3>
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
                        <p className="text-xs text-muted-foreground mb-2">{apptTime}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/consultation/${appointment.patientId}`);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold hover:bg-red-700 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <PlayCircle className="w-3 h-3" />
                          Start Now
                        </button>
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
                  <div key={appointment.patientId} className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-semibold text-foreground">{appointment.name}</p>
                    <p className="text-sm text-muted-foreground">{appointment.complaint}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">⚠️ Priority: {appointment.priority.toUpperCase()} | {new Date(appointment.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
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

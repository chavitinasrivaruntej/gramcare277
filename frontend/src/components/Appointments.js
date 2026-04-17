import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, CheckCircle, AlertCircle, PlayCircle, Timer } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { dataEngine } from "@/lib/dataEngine";

export default function Appointments() {
  const navigate = useNavigate();
  const { patients } = useUnifiedData();
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter appointments by status (today only as inferred)
  const filteredAppointments = [...patients].filter(apt => {
    const statusMatch = filterStatus === 'all' || apt.status === filterStatus;
    return statusMatch;
  }).sort((a, b) => {
    // Priority sorting: Urgent/Critical first
    const aUrgent = a.status === 'urgent' || a.priority === 'critical';
    const bUrgent = b.status === 'urgent' || b.priority === 'critical';
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return 0;
  });

  // Group by status
  const completedAppointments = filteredAppointments.filter(a => a.status === 'completed');
  const activeAppointments = filteredAppointments.filter(a => a.status === 'in_progress' || a.status === 'in-progress' || a.status === 'urgent');
  const upcomingAppointments = filteredAppointments.filter(a => a.status === 'scheduled' || a.status === 'waiting');

  // Calculate time difference
  const getTimeDifference = (scheduledTime) => {
    const diff = new Date(scheduledTime) - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return 'Time Up';
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope' }}>
          Appointments Queue
        </h1>
        <p className="text-muted-foreground tracking-tight">Managing synchronized clinical schedules across portals</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{completedAppointments.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Now</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">{activeAppointments.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{upcomingAppointments.length}</p>
            </div>
            <Timer className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Today</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{filteredAppointments.length}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
            { id: 'all', label: 'All', count: filteredAppointments.length },
            { id: 'completed', label: 'Completed', count: completedAppointments.length },
            { id: 'in_progress', label: 'In Progress', count: activeAppointments.length },
            { id: 'scheduled', label: 'Upcoming', count: upcomingAppointments.length }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === tab.id ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            >
                {tab.label} ({tab.count})
            </button>
        ))}

        <div className="ml-auto">
          <button
            onClick={() => window.location.href = '/patient-registration'}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const isCompleted = appointment.status === 'completed';
            const isActive = appointment.status === 'in_progress' || appointment.status === 'in-progress' || appointment.status === 'urgent';
            const isUpcoming = appointment.status === 'scheduled' || appointment.status === 'waiting';
            const apptTime = new Date(appointment.appointmentTime);

            return (
              <div
                key={appointment.patientId}
                className={`p-5 rounded-xl transition-all duration-200 hover:shadow-md border-2 ${isCompleted
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900'
                    : isActive
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-900'
                      : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900'
                  }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Time Badge */}
                    <div className={`flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center border-2 ${isCompleted
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-300'
                        : isActive
                          ? 'bg-red-100 dark:bg-red-900/30 border-red-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 border-blue-300'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : isActive ? (
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      ) : (
                        <>
                          <Clock className="w-5 h-5 mb-1 text-blue-600" />
                          <span className="text-sm font-bold text-blue-600">
                            {apptTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-lg text-foreground" style={{ fontFamily: 'Manrope' }}>
                          {appointment.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">({appointment.age}y, {appointment.gender})</span>
                        <Badge variant="outline" className="ml-2 font-mono text-[10px]">{appointment.tokenId}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">
                          {appointment.appointmentType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted
                            ? 'bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : isActive
                              ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                              : 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                          }`}>
                          {isCompleted ? '✓ Completed' : isActive ? '🔴 Active' : '⏰ Upcoming'}
                        </span>
                        {(appointment.priority === 'high' || appointment.priority === 'critical' || appointment.priority === 'urgent') && (
                          <span className="px-3 py-1 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full text-xs font-bold animate-pulse">
                            ⚠️ Priority
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-bold">Complaint:</span> {appointment.complaint}
                      </p>
                      
                      {isCompleted && appointment.visitHistory?.[0] && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-bold italic">
                          ✓ {appointment.visitHistory[0].diagnosis}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:w-48">
                    {isCompleted ? (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                        View clinical Summary
                      </button>
                    ) : isActive ? (
                      <>
                        <button 
                          onClick={() => {
                            // Update status to requested for demo
                            dataEngine.updatePatientStatus(appointment.patientId, appointment.status, { 
                              consultationStatus: 'requested' 
                            });
                            navigate(`/consultation/${appointment.patientId}`);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Start Now
                        </button>
                        <div className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold text-center">
                          ⏰ TIME UP
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-black text-center">
                          {getTimeDifference(appointment.appointmentTime)}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                          Schedule Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Appointments in Queue</h3>
            <p className="text-muted-foreground">The clinical schedule is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

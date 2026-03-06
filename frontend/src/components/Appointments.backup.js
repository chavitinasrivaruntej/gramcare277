import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, Filter, CheckCircle, AlertCircle, PlayCircle, FileText, Timer, X, Search, Activity, Pill, ClipboardList, TrendingUp } from 'lucide-react';
import { appointments as initialAppointments, patientsDatabase as initialPatients } from '../mockData';

export default function Appointments() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  
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
  
  // Load patients from localStorage
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem('gramcare_patients');
    if (savedPatients) {
      try {
        return JSON.parse(savedPatients);
      } catch (error) {
        return initialPatients;
      }
    }
    return initialPatients;
  });

  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    time: '',
    type: 'New Consultation',
    complaint: '',
    doctor: 'Dr. Sharma',
    priority: 'normal'
  });

  // Update current time every minute for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gramcare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Filter appointments by date and status
  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.date === selectedDate;
    const statusMatch = filterStatus === 'all' || apt.status === filterStatus;
    return dateMatch && statusMatch;
  });

  // Group appointments by status
  const completedAppointments = filteredAppointments.filter(a => a.status === 'completed');
  const activeAppointments = filteredAppointments.filter(a => a.status === 'active');
  const upcomingAppointments = filteredAppointments.filter(a => a.status === 'scheduled');

  // Calculate time difference for countdowns
  const getTimeDifference = (scheduledTime) => {
    const diff = new Date(scheduledTime) - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return 'Time Up';
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearchQuery(patient.name);
    setNewAppointment({
      ...newAppointment,
      patientId: patient.id
    });
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
    p.phone.includes(patientSearchQuery)
  );

  // Handle new appointment form submission
  const handleAddAppointment = () => {
    if (!selectedPatient || !newAppointment.time || !newAppointment.complaint) {
      alert('Please select a patient, time, and enter complaint');
      return;
    }

    // Parse time and create scheduled time
    const [hours, minutes] = newAppointment.time.split(':');
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Generate new appointment ID
    const newId = `A${String(appointments.length + 1).padStart(3, '0')}`;

    const appointmentToAdd = {
      id: newId,
      patientName: selectedPatient.name,
      patientId: selectedPatient.id,
      age: selectedPatient.age,
      date: selectedDate,
      time: formatTime(newAppointment.time),
      scheduledTime: scheduledDateTime,
      type: newAppointment.type,
      complaint: newAppointment.complaint,
      doctor: newAppointment.doctor,
      status: 'scheduled',
      priority: newAppointment.priority
    };

    setAppointments([...appointments, appointmentToAdd]);
    setShowNewAppointmentModal(false);
    
    // Reset form
    setSelectedPatient(null);
    setPatientSearchQuery('');
    setNewAppointment({
      patientId: '',
      time: '',
      type: 'New Consultation',
      complaint: '',
      doctor: 'Dr. Sharma',
      priority: 'normal'
    });
  };

  // Format time from 24h to 12h format
  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
          Appointments
        </h1>
        <p className="text-muted-foreground">Manage and schedule patient appointments</p>
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
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
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-primary text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All ({filteredAppointments.length})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'completed'
              ? 'bg-green-500 text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Completed ({completedAppointments.length})
        </button>
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'active'
              ? 'bg-red-500 text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Active ({activeAppointments.length})
        </button>
        <button
          onClick={() => setFilterStatus('scheduled')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'scheduled'
              ? 'bg-blue-500 text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Upcoming ({upcomingAppointments.length})
        </button>
      </div>

      {/* Date Selector */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="select-appointment-date"
          />
        </div>
        <button 
          onClick={() => window.location.href = '/patient-search'}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          data-testid="new-appointment-btn"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
            Schedule for {new Date(selectedDate).toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {filteredAppointments.length} Appointments
          </span>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => {
              const isCompleted = appointment.status === 'completed';
              const isActive = appointment.status === 'active';
              const isUpcoming = appointment.status === 'scheduled';
              
              return (
                <div
                  key={appointment.id}
                  data-testid={`appointment-item-${index}`}
                  className={`p-5 rounded-lg transition-all duration-200 hover:shadow-md card-hover border-2 ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900'
                      : isActive
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-900 animate-pulse-gentle'
                      : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Time Badge */}
                      <div className={`flex-shrink-0 w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 ${
                        isCompleted 
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
                            <Clock className={`w-5 h-5 mb-1 ${
                              isActive ? 'text-red-600' : 'text-blue-600'
                            }`} />
                            <span className={`text-sm font-bold ${
                              isActive ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {appointment.time.split(' ')[0]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {appointment.time.split(' ')[1]}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-lg text-foreground" style={{fontFamily: 'Manrope'}}>
                            {appointment.patientName}
                          </h3>
                          {appointment.age && (
                            <span className="text-sm text-muted-foreground">({appointment.age}y)</span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                            {appointment.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted 
                              ? 'bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                              : isActive
                              ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                              : 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                          }`}>
                            {isCompleted ? '✓ Completed' : isActive ? '🔴 Active' : '⏰ Upcoming'}
                          </span>
                          {appointment.priority === 'high' && (
                            <span className="px-3 py-1 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                              ⚠️ Priority
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Complaint:</span> {appointment.complaint}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Doctor:</span> {appointment.doctor}
                        </p>
                        
                        {isCompleted && appointment.duration && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            ✓ Completed at {appointment.completedAt} ({appointment.duration})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 md:w-48">
                      {isCompleted && (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowSummaryModal(true);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            data-testid={`view-summary-btn-${index}`}
                          >
                            <FileText className="w-4 h-4" />
                            View Summary
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowReportsModal(true);
                            }}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                          >
                            <ClipboardList className="w-4 h-4" />
                            View Reports
                          </button>
                        </>
                      )}
                      
                      {isActive && (
                        <>
                          <button 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 animate-pulse"
                            data-testid={`start-now-btn-${index}`}
                          >
                            <PlayCircle className="w-5 h-5" />
                            Start Now
                          </button>
                          <div className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold text-center">
                            ⏰ TIME UP
                          </div>
                        </>
                      )}
                      
                      {isUpcoming && (
                        <>
                          <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold text-center">
                            {getTimeDifference(appointment.scheduledTime)}
                          </div>
                          <button 
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                            data-testid={`reschedule-btn-${index}`}
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
              No Appointments
            </h3>
            <p className="text-muted-foreground mb-4">
              No appointments scheduled for this date
            </p>
            <button 
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              data-testid="schedule-new-btn"
            >
              Schedule New Appointment
            </button>
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                Schedule New Appointment
              </h2>
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Patient Selection with Search */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Patient <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={patientSearchQuery}
                    onChange={(e) => {
                      setPatientSearchQuery(e.target.value);
                      setSelectedPatient(null);
                    }}
                    placeholder="Search by name, ID, or phone..."
                    className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                {/* Patient dropdown */}
                {patientSearchQuery && !selectedPatient && filteredPatients.length > 0 && (
                  <div className="mt-2 max-h-60 overflow-y-auto border border-input rounded-lg bg-background shadow-lg">
                    {filteredPatients.slice(0, 10).map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.id} | Age: {patient.age} | {patient.phone}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            {patient.village}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Patient Display */}
                {selectedPatient && (
                  <div className="mt-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">✓ {selectedPatient.name}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          ID: {selectedPatient.id} | Age: {selectedPatient.age} | Gender: {selectedPatient.gender}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Phone: {selectedPatient.phone} | Village: {selectedPatient.village}
                        </p>
                        {selectedPatient.allergies !== 'None' && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            ⚠️ Allergies: {selectedPatient.allergies}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatient(null);
                          setPatientSearchQuery('');
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {patientSearchQuery && !selectedPatient && filteredPatients.length === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">No patients found. Please register the patient first.</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="New Consultation">New Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="General Checkup">General Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Prenatal Checkup">Prenatal Checkup</option>
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assigned Doctor
                  </label>
                  <select
                    value={newAppointment.doctor}
                    onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Dr. Sharma">Dr. Sharma</option>
                    <option value="Dr. Malini">Dr. Malini</option>
                    <option value="Nurse Priya">Nurse Priya</option>
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <select
                  value={newAppointment.priority}
                  onChange={(e) => setNewAppointment({...newAppointment, priority: e.target.value})}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Complaint */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chief Complaint <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAppointment.complaint}
                  onChange={(e) => setNewAppointment({...newAppointment, complaint: e.target.value})}
                  placeholder="Describe the patient's complaint"
                  rows="3"
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppointment}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Summary Modal */}
      {showSummaryModal && selectedAppointment && selectedAppointment.consultationSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1" style={{fontFamily: 'Manrope'}}>
                  Consultation Summary
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.patientName} | {selectedAppointment.date} | {selectedAppointment.time}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setSelectedAppointment(null);
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Appointment Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient ID</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.patientId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.age} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.doctor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.duration}</p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Chief Complaint
                </h3>
                <p className="text-foreground bg-accent/50 p-3 rounded-lg">
                  {selectedAppointment.consultationSummary.chiefComplaint}
                </p>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Symptoms Reported
                </h3>
                <p className="text-foreground bg-accent/50 p-3 rounded-lg">
                  {selectedAppointment.consultationSummary.symptoms}
                </p>
              </div>

              {/* Vitals Recorded */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Vitals Recorded
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedAppointment.consultationSummary.vitalsRecorded && 
                    Object.keys(selectedAppointment.consultationSummary.vitalsRecorded).map((key) => {
                      const value = selectedAppointment.consultationSummary.vitalsRecorded[key];
                      return (
                        <div key={key} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{value}</p>
                        </div>
                      );
                    })
                  }
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-green-500" />
                  Diagnosis
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <p className="text-foreground font-semibold text-lg">
                    {selectedAppointment.consultationSummary.diagnosis}
                  </p>
                </div>
              </div>

              {/* Doctor's Notes */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Doctor's Notes & Observations
                </h3>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                  <p className="text-foreground leading-relaxed">
                    {selectedAppointment.consultationSummary.doctorNotes}
                  </p>
                </div>
              </div>

              {/* Follow-up Information */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-amber-500" />
                  Follow-up Required
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Follow-up Date</p>
                      <p className="font-semibold text-foreground">
                        {new Date(selectedAppointment.consultationSummary.followUpDate).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reason</p>
                      <p className="font-semibold text-foreground">
                        {selectedAppointment.consultationSummary.followUpReason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setShowReportsModal(true);
                }}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <ClipboardList className="w-5 h-5" />
                View Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Reports/Prescription Modal */}
      {showReportsModal && selectedAppointment && selectedAppointment.prescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1" style={{fontFamily: 'Manrope'}}>
                  Prescription & Reports
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.patientName} | {selectedAppointment.date} | {selectedAppointment.time}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReportsModal(false);
                  setSelectedAppointment(null);
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient Name</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient ID</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.patientId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.age} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold text-foreground">{new Date(selectedAppointment.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.doctor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diagnosis</p>
                    <p className="font-semibold text-foreground">{selectedAppointment.consultationSummary?.diagnosis || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Prescribed Medicines */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Pill className="w-6 h-6 text-blue-500" />
                  Prescribed Medicines
                </h3>
                <div className="space-y-3">
                  {selectedAppointment.prescription.medicines.map((medicine, index) => {
                    return (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-900 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-1">{medicine.name}</h4>
                          <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                          #{index + 1}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                          <p className="font-semibold text-foreground">{medicine.frequency}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Timing</p>
                          <p className="font-semibold text-foreground">{medicine.timing}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="font-semibold text-foreground">{medicine.duration}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-900 rounded-lg p-3">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold text-amber-800 dark:text-amber-300">Instructions: </span>
                          {medicine.instructions}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Lab Tests */}
              {selectedAppointment.prescription.labTests && selectedAppointment.prescription.labTests.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-red-500" />
                    Recommended Lab Tests
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedAppointment.prescription.labTests.map((test, index) => {
                        return (
                        <li key={index} className="flex items-center gap-2 text-foreground">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>{test}</span>
                        </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}

              {/* Dietary Advice */}
              {selectedAppointment.prescription.dietaryAdvice && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    Dietary Advice
                  </h3>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed">
                      {selectedAppointment.prescription.dietaryAdvice}
                    </p>
                  </div>
                </div>
              )}

              {/* General Instructions */}
              {selectedAppointment.prescription.generalInstructions && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-500" />
                    General Instructions
                  </h3>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed">
                      {selectedAppointment.prescription.generalInstructions}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowReportsModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
              <button
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Print Prescription
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

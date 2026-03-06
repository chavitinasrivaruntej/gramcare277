import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Phone, MapPin, Calendar, ArrowRight, UserPlus, X, Clock } from 'lucide-react';
import { patientsDatabase as initialPatients, appointments as initialAppointments } from '../mockData';

export default function PatientSearch() {
  const navigate = useNavigate();
  
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    time: '',
    type: 'New Consultation',
    complaint: '',
    doctor: 'Dr. Sharma',
    priority: 'normal'
  });

  // Filter patients based on search
  const filteredPatients = searchQuery
    ? patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowAppointmentModal(true);
  };

  // Handle appointment booking
  const handleBookAppointment = () => {
    if (!appointmentDetails.time || !appointmentDetails.complaint) {
      alert('Please enter time and complaint');
      return;
    }

    // Load existing appointments - prefer localStorage, fallback to mockData
    const savedAppointments = localStorage.getItem('gramcare_appointments');
    let appointments = [];
    if (savedAppointments) {
      try {
        appointments = JSON.parse(savedAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
        appointments = initialAppointments;
      }
    } else {
      // First time - use mock data as base
      appointments = initialAppointments;
    }

    // Parse time and create scheduled time
    const today = new Date('2026-02-06').toISOString().split('T')[0];
    const [hours, minutes] = appointmentDetails.time.split(':');
    const scheduledDateTime = new Date(today);
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Generate new appointment ID
    const newId = `A${String(appointments.length + 1).padStart(3, '0')}`;

    // Format time to 12h format
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;

    const newAppointment = {
      id: newId,
      patientName: selectedPatient.name,
      patientId: selectedPatient.id,
      age: selectedPatient.age,
      date: today,
      time: formattedTime,
      scheduledTime: scheduledDateTime.toISOString(),
      type: appointmentDetails.type,
      complaint: appointmentDetails.complaint,
      doctor: appointmentDetails.doctor,
      status: 'scheduled',
      priority: appointmentDetails.priority
    };

    // Save to localStorage
    appointments.push(newAppointment);
    localStorage.setItem('gramcare_appointments', JSON.stringify(appointments));

    // Close modal and navigate to appointments
    setShowAppointmentModal(false);
    navigate('/appointments');
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
          Select Patient for Appointment
        </h1>
        <p className="text-muted-foreground">Search and select a patient to book an appointment</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, phone, or village..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className="p-5 bg-card border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-1" style={{fontFamily: 'Manrope'}}>
                {patient.name}
              </h3>
              
              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-primary">{patient.id}</span>
                  <span>•</span>
                  <span>{patient.age}y</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {patient.phone}
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {patient.village}
                </p>
              </div>

              {patient.allergies !== 'None' && (
                <div className="px-2 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded text-xs text-red-700 dark:text-red-400">
                  ⚠️ Allergies: {patient.allergies}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
            Patient Not Found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? `No patients match "${searchQuery}"`
              : "No patients registered yet"
            }
          </p>
          <button
            onClick={() => navigate('/patient-registration')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Register New Patient
          </button>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground" style={{fontFamily: 'Manrope'}}>
                Book Appointment
              </h2>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setSelectedPatient(null);
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Info Display */}
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.id} | {selectedPatient.age}y | {selectedPatient.gender} | {selectedPatient.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Village: {selectedPatient.village} | Blood: {selectedPatient.bloodGroup}
                  </p>
                  {selectedPatient.allergies !== 'None' && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      ⚠️ Allergies: {selectedPatient.allergies}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="time"
                    value={appointmentDetails.time}
                    onChange={(e) => setAppointmentDetails({...appointmentDetails, time: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={appointmentDetails.type}
                    onChange={(e) => setAppointmentDetails({...appointmentDetails, type: e.target.value})}
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
                    value={appointmentDetails.doctor}
                    onChange={(e) => setAppointmentDetails({...appointmentDetails, doctor: e.target.value})}
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
                  value={appointmentDetails.priority}
                  onChange={(e) => setAppointmentDetails({...appointmentDetails, priority: e.target.value})}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority / Emergency</option>
                </select>
              </div>

              {/* Complaint */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chief Complaint <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={appointmentDetails.complaint}
                  onChange={(e) => setAppointmentDetails({...appointmentDetails, complaint: e.target.value})}
                  placeholder="Describe the patient's complaint or reason for visit"
                  rows="3"
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setSelectedPatient(null);
                }}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

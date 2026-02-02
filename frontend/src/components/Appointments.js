import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, Filter } from 'lucide-react';
import { appointments } from '../mockData';

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState('2025-01-15');
  const [filterType, setFilterType] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.date === selectedDate;
    const typeMatch = filterType === 'all' || apt.type.toLowerCase().includes(filterType.toLowerCase());
    return dateMatch && typeMatch;
  });

  const appointmentTypes = ['All', 'Follow-up', 'New Consultation', 'Vaccination', 'Blood Test'];

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
          Appointments
        </h1>
        <p className="text-muted-foreground">Manage and schedule patient appointments</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="select-appointment-date"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Filter by Type
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="filter-appointment-type"
            >
              {appointmentTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button 
            className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            data-testid="new-appointment-btn"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        </div>
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
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                data-testid={`appointment-item-${index}`}
                className="p-5 border border-border rounded-lg hover:border-primary transition-all duration-200 hover:shadow-md card-hover"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Time Badge */}
                    <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-lg flex flex-col items-center justify-center border-2 border-primary/20">
                      <Clock className="w-5 h-5 text-primary mb-1" />
                      <span className="text-sm font-bold text-primary">
                        {appointment.time.split(' ')[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {appointment.time.split(' ')[1]}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-lg text-foreground" style={{fontFamily: 'Manrope'}}>
                          {appointment.patientName}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          {appointment.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${appointment.status === 'scheduled' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }
                        `}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Provider:</span> {appointment.doctor}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:w-40">
                    <button 
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      data-testid={`start-consultation-btn-${index}`}
                    >
                      Start Visit
                    </button>
                    <button 
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                      data-testid={`reschedule-btn-${index}`}
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Weekly Overview */}
      <div className="mt-6 bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-bold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
          Weekly Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-2xl font-bold text-foreground">
              {appointments.filter(a => a.date === '2025-01-15').length}
            </p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Tomorrow</p>
            <p className="text-2xl font-bold text-foreground">
              {appointments.filter(a => a.date === '2025-01-16').length}
            </p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Avg. per Day</p>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(appointments.length / 7)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

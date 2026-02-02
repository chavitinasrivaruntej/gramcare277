import { useState } from 'react';
import { 
  Users, Clock, CheckCircle, AlertTriangle, 
  Activity, Thermometer, Heart, Wind,
  Phone, Ambulance, Hospital, TrendingUp
} from 'lucide-react';
import { patientQueue, quickStats, emergencyContacts } from '../mockData';

export default function Dashboard() {
  const [vitalsData, setVitalsData] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    spo2: '',
    weight: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleVitalsChange = (field, value) => {
    setVitalsData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const errors = { ...validationErrors };
    
    if (field === 'spo2' && value) {
      if (parseFloat(value) < 94) {
        errors.spo2 = true;
      } else {
        delete errors.spo2;
      }
    }
    
    if (field === 'temperature' && value) {
      if (parseFloat(value) > 101) {
        errors.temperature = true;
      } else {
        delete errors.temperature;
      }
    }
    
    setValidationErrors(errors);
  };

  const criticalPatients = patientQueue.filter(p => p.status === 'critical');

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Patients Today"
          value={quickStats.patientsToday}
          color="bg-blue-500"
          testId="stat-patients-today"
        />
        <StatCard
          icon={Clock}
          label="In Queue"
          value={quickStats.inQueue}
          color="bg-amber-500"
          testId="stat-in-queue"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={quickStats.completed}
          color="bg-green-500"
          testId="stat-completed"
        />
        <StatCard
          icon={AlertTriangle}
          label="Critical"
          value={quickStats.critical}
          color="bg-red-500"
          testId="stat-critical"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Patient Queue */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6 card-hover">
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
            {patientQueue.map((patient, index) => (
              <div
                key={patient.id}
                data-testid={`patient-queue-item-${index}`}
                className={`
                  p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                  ${patient.status === 'critical' 
                    ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900' 
                    : patient.status === 'completed'
                    ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
                    : patient.status === 'in-consultation'
                    ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900'
                    : 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                      ${patient.status === 'critical' ? 'bg-red-500' : 
                        patient.status === 'completed' ? 'bg-green-500' :
                        patient.status === 'in-consultation' ? 'bg-blue-500' : 'bg-amber-500'}
                    `}>
                      {patient.tokenNumber.split('-')[1]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">Age: {patient.age} | {patient.complaint}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`
                        status-dot
                        ${patient.status === 'critical' ? 'status-critical' :
                          patient.status === 'completed' ? 'status-completed' :
                          patient.status === 'in-consultation' ? 'status-in-consultation' : 'status-waiting'}
                      `}></span>
                      <span className="text-sm font-medium capitalize">{patient.status.replace('-', ' ')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{patient.checkInTime}</p>
                  </div>
                </div>
              </div>
            ))}
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
                {criticalPatients.map((patient) => (
                  <div key={patient.id} className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="font-semibold text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.complaint}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Priority: HIGH</p>
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

      {/* Vitals Quick Entry */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6" style={{fontFamily: 'Manrope'}}>
          Vitals Quick Entry
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Blood Pressure (mmHg)
            </label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="120/80"
                value={vitalsData.bloodPressure}
                onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="vitals-blood-pressure"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Heart Rate (bpm)
            </label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="72"
                value={vitalsData.heartRate}
                onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="vitals-heart-rate"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Temperature (°F)
            </label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                step="0.1"
                placeholder="98.6"
                value={vitalsData.temperature}
                onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent
                  ${validationErrors.temperature ? 'border-red-500 focus:ring-red-500' : 'border-input'}
                `}
                data-testid="vitals-temperature"
              />
            </div>
            {validationErrors.temperature && (
              <p className="text-xs text-red-500 mt-1">⚠️ High temperature (&gt; 101°F)</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SpO2 (%)
            </label>
            <div className="relative">
              <Wind className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="98"
                value={vitalsData.spo2}
                onChange={(e) => handleVitalsChange('spo2', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent
                  ${validationErrors.spo2 ? 'border-red-500 focus:ring-red-500' : 'border-input'}
                `}
                data-testid="vitals-spo2"
              />
            </div>
            {validationErrors.spo2 && (
              <p className="text-xs text-red-500 mt-1">⚠️ Low oxygen level (&lt; 94%)</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Weight (kg)
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="65"
                value={vitalsData.weight}
                onChange={(e) => handleVitalsChange('weight', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="vitals-weight"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            data-testid="save-vitals-btn"
          >
            Save Vitals
          </button>
          <button 
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            data-testid="clear-vitals-btn"
            onClick={() => {
              setVitalsData({
                bloodPressure: '',
                heartRate: '',
                temperature: '',
                spo2: '',
                weight: ''
              });
              setValidationErrors({});
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, testId }) {
  return (
    <div 
      className="bg-card rounded-xl border border-border shadow-sm p-6 card-hover animate-slide-in"
      data-testid={testId}
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
    </div>
  );
}

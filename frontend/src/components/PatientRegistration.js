import { useState } from 'react';
import { User, Calendar, Phone, MapPin, FileText, Camera, Save, CheckCircle, Stethoscope } from 'lucide-react';
import { dataEngine } from '../lib/dataEngine';

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    village: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    complaint: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.gender || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Create unified patient object
    const newPatient = {
      name: `${formData.firstName} ${formData.lastName}`,
      age: parseInt(formData.age),
      gender: formData.gender,
      complaint: formData.complaint || "Routine checkup",
      priority: 'normal', // Default, can be updated later
      vitals: {
        bloodPressure: formData.bloodPressure || 'N/A',
        pulse: formData.heartRate || 'N/A', // HR mapped to pulse in unified schema
        temperature: formData.temperature || 'N/A',
        weight: formData.weight || 'N/A',
        oxygenSaturation: formData.oxygenSaturation || 'N/A'
      },
      // Additional metadata
      phone: formData.phone,
      village: formData.village,
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
    };

    // Add to unified engine
    const addedPatient = dataEngine.addPatient(newPatient);

    if (addedPatient) {
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        phone: '',
        address: '',
        village: '',
        emergencyContact: '',
        bloodGroup: '',
        allergies: '',
        chronicConditions: '',
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: '',
        complaint: ''
      });
      
      console.log('Patient registered via Unified Engine:', addedPatient);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-3 animate-slide-in">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">Patient Registered Successfully!</p>
              <p className="text-sm text-green-600 dark:text-green-400">Patient has been added to the database and is now available for appointments.</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
            Patient Registration
          </h1>
          <p className="text-muted-foreground">Register a new patient in the system</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-sm p-8 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter first name"
                    data-testid="input-first-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Enter last name"
                  data-testid="input-last-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter age"
                    data-testid="input-age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  data-testid="select-gender"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  data-testid="select-blood-group"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="+91 9876543210"
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
              Address Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Village/Town *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => handleChange('village', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter village/town name"
                    data-testid="input-village"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  rows="3"
                  placeholder="Enter complete address"
                  data-testid="input-address"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
              Medical Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Known Allergies
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    rows="2"
                    placeholder="List any known allergies"
                    data-testid="input-allergies"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chronic Conditions
                </label>
                <textarea
                  value={formData.chronicConditions}
                  onChange={(e) => handleChange('chronicConditions', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  rows="2"
                  placeholder="List any chronic conditions (diabetes, hypertension, etc.)"
                  data-testid="input-chronic-conditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Emergency Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Emergency contact number"
                    data-testid="input-emergency-contact"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Information */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
              Vitals Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  value={formData.bloodPressure}
                  onChange={(e) => handleChange('bloodPressure', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., 120/80"
                  data-testid="input-blood-pressure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="text"
                  value={formData.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., 72"
                  data-testid="input-heart-rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Temperature (°F)
                </label>
                <input
                  type="text"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., 98.6"
                  data-testid="input-temperature"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., 70"
                  data-testid="input-weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., 170"
                  data-testid="input-height"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="text"
                  value={formData.oxygenSaturation}
                  onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., 98"
                  data-testid="input-oxygen-saturation"
                />
              </div>
            </div>
          </div>

          {/* Patient Photo */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
              Patient Photo (Optional)
            </h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Click to capture or upload photo</p>
              <button
                type="button"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                data-testid="capture-photo-btn"
              >
                Capture Photo
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-600/90 transition-colors flex items-center gap-2"
              data-testid="register-patient-btn"
            >
              <Save className="w-5 h-5" />
              Register Patient
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              data-testid="cancel-btn"
              onClick={() => {
                setFormData({
                  firstName: '',
                  lastName: '',
                  age: '',
                  gender: '',
                  phone: '',
                  address: '',
                  village: '',
                  emergencyContact: '',
                  bloodGroup: '',
                  allergies: '',
                  chronicConditions: ''
                });
              }}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

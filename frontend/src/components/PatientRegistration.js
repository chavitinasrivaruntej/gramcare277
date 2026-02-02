import { useState } from 'react';
import { User, Calendar, Phone, MapPin, FileText, Camera, Save } from 'lucide-react';

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
    chronicConditions: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Patient Registration:', formData);
    // Handle form submission
    alert('Patient registered successfully!');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
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
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Emergency contact number"
                    data-testid="input-emergency-contact"
                  />
                </div>
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
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
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

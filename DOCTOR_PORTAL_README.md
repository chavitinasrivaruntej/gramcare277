# GramCare Doctor Portal

## Overview
The GramCare Doctor Portal is a comprehensive telemedicine platform designed for doctors to conduct remote consultations with rural patients. It provides a complete suite of tools for patient management, video consultations, prescription writing, and medical record management.

## Features

### 1. **Doctor Dashboard** 📊
- Real-time statistics: Today's patients, completed consultations, queue status, critical cases
- Patient queue overview with priority cases highlighted
- Upcoming appointments
- Recent prescriptions history
- Quick action buttons for common tasks

### 2. **Patient Queue Management** 👥
- Complete list of waiting patients with real-time status
- Priority filtering (High Priority, Critical, Normal)
- Status filtering (Waiting, In Progress, Completed)
- Patient search by name, token number, or complaint
- Detailed patient vitals displayed for each patient
- Quick access to start consultations

### 3. **Consultation Interface** 🩺
The most comprehensive feature, includes:

#### Video Consultation
- Full video call interface with simulated video feed
- Audio and video controls (mute/unmute)
- Screen sharing capability
- Call duration tracking
- Picture-in-picture view
- Professional call controls

#### Patient Information Panel
- **Vitals Tab**: Current vitals, complete medical history, allergies (prominently displayed), chronic conditions, current medications, previous consultations
- **Diagnosis Tab**: Chief complaint entry, diagnosis notes, clinical notes, advice & instructions
- **Prescription Tab**: Medicine search with autocomplete, prescription templates (Common Cold, Hypertension, Diabetes), detailed dosage and duration entry, follow-up scheduling

### 4. **Patient Medical History** 📋
- Complete patient medical records
- Allergies and warnings (highlighted in red)
- Chronic conditions tracking
- Current medications
- Medical background (smoking, alcohol, family history)
- Past surgeries
- Complete consultation history with diagnoses and prescriptions

### 5. **Appointments Management** 📅
- Interactive calendar view
- Daily, weekly, and monthly appointment views
- Appointment statistics
- Schedule new appointments
- Quick join for video consultations
- Patient communication tools

## Tech Stack
- **React** - Frontend framework
- **React Router** - Navigation and routing
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Mock Data** - Development data layer

## File Structure
```
healthcarecentre/frontend/src/
├── DoctorApp.js                          # Main Doctor Portal app
├── indexDoctor.js                        # Entry point for Doctor Portal
├── mockDataDoctor.js                     # Mock data for doctor features
└── components/doctor/
    ├── DoctorDashboard.js               # Dashboard with stats and overview
    ├── PatientQueue.js                  # Patient queue management
    ├── ConsultationInterface.js         # Video consultation + prescription
    ├── PatientHistoryDoctor.js          # Medical records viewer
    └── DoctorAppointments.js            # Appointment management
```

## Running the Doctor Portal

### Method 1: Using Batch Scripts (Windows)
```bash
# Switch to Doctor Portal and run
cd healthcarecentre/frontend
tmp_rovodev_run_doctor_portal.bat

# Restore Patient Portal when done
tmp_rovodev_restore_patient_portal.bat
```

### Method 2: Manual Switch
```bash
# Backup current index.js
cd healthcarecentre/frontend/src
copy index.js index.js.backup

# Use doctor portal
copy indexDoctor.js index.js

# Run the app
cd ..
npm start

# Restore when done
copy index.js.backup index.js
```

### Method 3: Separate Build (Recommended for Production)
Update `package.json` to include separate scripts:
```json
{
  "scripts": {
    "start": "craco start",
    "start:doctor": "REACT_APP_PORTAL=doctor craco start",
    "build": "craco build",
    "build:doctor": "REACT_APP_PORTAL=doctor craco build"
  }
}
```

## Routes

All doctor routes are prefixed with `/doctor`:

- `/doctor` - Dashboard
- `/doctor/queue` - Patient Queue
- `/doctor/consultation` - Consultation Interface
- `/doctor/consultation/:patientId` - Consultation with specific patient
- `/doctor/appointments` - Appointments Management
- `/doctor/patient-history` - Patient Medical Records

## Key Components Usage

### Starting a Consultation
1. Go to Patient Queue (`/doctor/queue`)
2. Click on a patient card
3. Click "Start Consultation" button
4. You'll be redirected to the Consultation Interface with video call ready

### Writing a Prescription
1. In Consultation Interface, go to "Prescription" tab
2. Use quick templates OR search for medicines
3. Add medicines and customize dosage, duration, instructions
4. Add follow-up date if needed
5. Save consultation

### Video Consultation Controls
- **Green Video Icon**: Start/Stop video call
- **Mic Icon**: Mute/Unmute audio
- **Video Icon**: Turn camera on/off
- **Red Phone Icon**: End call
- **Monitor Icon**: Share screen
- **Settings Icon**: Call settings

## Mock Data Structure

### Doctor Profile
- Name, specialization, experience, qualifications
- Contact information
- Languages spoken

### Today's Consultations
- 7 mock patients with varying priorities
- Complete vitals for each patient
- Previous visit history
- Different consultation statuses

### Prescription Templates
- Common Cold & Fever
- Hypertension Management
- Diabetes Type 2

### Common Medicines
- 15 commonly prescribed medicines
- Categories: Antipyretic, NSAID, Antibiotic, Antihistamine, etc.
- Stock levels included

## Design Highlights

### User Experience
- **Priority-First**: Critical and high-priority patients are visually distinct (red borders, badges)
- **Efficient Workflow**: Quick actions available at every step
- **Context-Aware**: Patient information always visible during consultation
- **Professional**: Clean, medical-grade interface design

### Visual Features
- Animated pulse for live status indicators
- Gradient avatars for patient identification
- Color-coded vitals and status badges
- Responsive grid layouts
- Smooth transitions and hover effects

## Integration Points (Future Backend)

When integrating with backend:

1. **Authentication**: Doctor login with credentials
2. **WebRTC**: Real video/audio streaming
3. **Database**: Store consultations, prescriptions, patient records
4. **API Endpoints**:
   - `GET /api/doctor/queue` - Fetch patient queue
   - `GET /api/doctor/patients/:id` - Patient details
   - `POST /api/doctor/consultations` - Save consultation
   - `POST /api/doctor/prescriptions` - Create prescription
   - `GET /api/doctor/appointments` - Fetch appointments

## Accessibility Features
- Keyboard navigation support
- High contrast mode compatible
- Screen reader friendly labels
- Focus indicators on interactive elements

## Performance Considerations
- Lazy loading for patient history
- Optimized re-renders with proper state management
- Efficient search filtering
- Virtualized lists for large datasets (can be added)

## Next Steps for Enhancement

1. **Video Integration**: Integrate actual WebRTC for real video calls
2. **E-Prescription**: Digital signature and prescription export (PDF)
3. **Analytics**: Detailed consultation analytics and reporting
4. **Multi-language**: Support for regional languages
5. **Voice Notes**: Record consultation notes via speech-to-text
6. **Lab Integration**: Order lab tests and view results
7. **Emergency Protocol**: Quick access to emergency procedures
8. **Offline Mode**: Work offline and sync when connected

## Notes
- All data is currently mocked for development
- Video consultation is simulated (not real WebRTC)
- Prescription saving logs to console
- Built with scalability and real-world usage in mind

## Support
For issues or questions about the Doctor Portal, contact the development team.

---

**Built with ❤️ for rural healthcare**

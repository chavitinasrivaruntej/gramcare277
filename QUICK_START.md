# GramCare - Quick Start Guide

## 🎉 Welcome to GramCare!

GramCare now has **TWO complete portals** in a unified application:

1. **Patient Portal (CHA Interface)** - For Community Health Assistants
2. **Doctor Portal** - For remote doctors conducting consultations

## 🚀 Getting Started

### Start the Application

```bash
cd healthcarecentre/frontend
npm start
```

The app will open at `http://localhost:3000`

## 📍 Portal Access

### Patient Portal (CHA Interface)
- **URL**: `http://localhost:3000/`
- **User**: Community Health Assistant (Priya Sharma)
- **Features**:
  - Dashboard with patient stats
  - Patient Registration
  - Medical History viewer
  - Appointments booking
  - Medicine Inventory management

### Doctor Portal
- **URL**: `http://localhost:3000/doctor`
- **User**: Dr. Amit Verma (General Medicine)
- **Features**:
  - Doctor Dashboard with queue overview
  - Patient Queue management with priority filtering
  - **Video Consultation Interface** with:
    - Simulated video call
    - Patient vitals and medical history
    - Prescription writing with medicine search
    - Follow-up scheduling
  - Appointments calendar
  - Patient medical records viewer

## 🔄 Switching Between Portals

### Method 1: Floating Button (Easiest)
Look for the **floating button** at the bottom-right corner:
- Click "Switch to Doctor Portal" when in Patient Portal
- Click "Switch to Patient Portal" when in Doctor Portal

### Method 2: Direct Navigation
- Patient Portal: Navigate to `/`
- Doctor Portal: Navigate to `/doctor`

### Method 3: URL Bar
- Type `http://localhost:3000/` for Patient Portal
- Type `http://localhost:3000/doctor` for Doctor Portal

## 🎯 Quick Tour

### Patient Portal Flow
1. Start at Dashboard (`/`)
2. Register a new patient (`/register`)
3. Book an appointment (`/appointments`)
4. View medical history (`/history`)
5. Check medicine inventory (`/inventory`)

### Doctor Portal Flow
1. Start at Doctor Dashboard (`/doctor`)
2. View patient queue (`/doctor/queue`)
3. Click on a patient to start consultation
4. **Video consultation interface opens** with:
   - Video call controls (start/stop, mute, camera, screen share)
   - Patient vitals and medical history (left side shows patient info)
   - Three tabs: Vitals & History, Diagnosis & Notes, Prescription
5. Write prescription:
   - Search for medicines
   - Use quick templates
   - Add dosage and duration
6. Save consultation

## 🎨 Features Showcase

### Video Consultation (Doctor Portal)
- **Start Call**: Click green "Start Video Call" button
- **Controls**: Mic, Video, Screen Share, End Call
- **Call Timer**: See live call duration
- **PIP View**: See yourself in picture-in-picture

### Prescription Writing
- **Medicine Search**: Type to search from 15+ common medicines
- **Templates**: Quick templates for Common Cold, Hypertension, Diabetes
- **Detailed Entry**: Dosage (1-0-1), Duration, Instructions
- **Follow-up**: Schedule next appointment

### Patient Queue
- **Priority Filtering**: High priority patients highlighted in red
- **Status Filtering**: Filter by Waiting, In Progress, Completed
- **Quick Stats**: See patient count at a glance
- **One-Click Start**: Start consultation with any patient

## 🧪 Test Scenarios

### Scenario 1: Emergency Patient
1. Go to Doctor Portal (`/doctor`)
2. Look for red-bordered critical patients (Sunita Devi, Lakshmi Bai)
3. Click "Start Now" on critical patient
4. Video interface opens with patient details

### Scenario 2: Regular Consultation
1. Go to Patient Queue (`/doctor/queue`)
2. Click on "Rajesh Kumar" (normal priority)
3. Start consultation
4. Add medicines from prescription tab
5. Save consultation

### Scenario 3: View Patient History
1. Go to Patient History (`/doctor/patient-history`)
2. Click on "Vikram Patel" (has diabetes history)
3. See allergies, chronic conditions, past consultations

## 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Collapsible sidebar (click X button)
- Responsive grids and layouts

## 🌙 Dark Mode
- Click the moon/sun icon in the top-right header
- Persists across portal switches
- Smooth transitions

## 📊 Mock Data

### Patients with Full History
- **Rajesh Kumar** (P001) - Fever, has Penicillin allergy
- **Sunita Devi** (P002) - Critical: Chest pain, Hypertension
- **Vikram Patel** (P005) - Diabetes follow-up, extensive history

### Available Medicines
15+ medicines including:
- Paracetamol, Ibuprofen
- Antibiotics (Amoxicillin, Azithromycin)
- BP medicines (Amlodipine, Atenolol)
- Diabetes medicines (Metformin, Glimepiride)

## 🔧 Development

### File Structure
```
healthcarecentre/frontend/src/
├── MainApp.js                    # Unified portal router
├── index.js                      # Entry point (uses MainApp)
├── App.js                        # Original Patient Portal (still works standalone)
├── DoctorApp.js                  # Original Doctor Portal (still works standalone)
├── mockData.js                   # Patient Portal mock data
├── mockDataDoctor.js             # Doctor Portal mock data
└── components/
    ├── Dashboard.js              # Patient portal components
    ├── PatientRegistration.js
    ├── ...
    └── doctor/
        ├── DoctorDashboard.js    # Doctor portal components
        ├── PatientQueue.js
        ├── ConsultationInterface.js
        └── ...
```

### Making Changes
- **Patient Portal**: Edit components in `src/components/`
- **Doctor Portal**: Edit components in `src/components/doctor/`
- **Shared UI**: Edit components in `src/components/ui/`

## 🎓 Learning Path

### For Developers
1. Start with Patient Portal - simpler workflow
2. Explore Doctor Dashboard
3. Study Consultation Interface (most complex)
4. Review mock data structures
5. Check component implementations

### For Designers
1. Observe color coding (red for critical, blue for normal)
2. Note animations and transitions
3. Check responsive breakpoints
4. Review dark mode styling

## 📚 Documentation

- **Doctor Portal Details**: See `DOCTOR_PORTAL_README.md`
- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Patient Portal**: See main `README.md`

## ⚡ Quick Tips

1. **Critical Patients**: Always shown at top with red borders
2. **Search**: Use search in Patient Queue to find patients quickly
3. **Templates**: Use prescription templates to save time
4. **Allergies**: Always displayed prominently in red
5. **Portal Switch**: Use the floating button - it's the fastest way

## 🐛 Troubleshooting

### Issue: Portal switcher not visible
**Solution**: Scroll down - it's a floating button at bottom-right

### Issue: Routes not working
**Solution**: Make sure you're using the correct base path (`/` vs `/doctor`)

### Issue: Components not loading
**Solution**: Check console for errors, ensure `npm install` was run

### Issue: Dark mode not working
**Solution**: Clear browser cache and reload

## 🎯 Next Steps

1. **Try both portals** - Navigate and explore features
2. **Test consultation flow** - Complete end-to-end patient consultation
3. **Review code** - Check component implementations
4. **Customize** - Add your own features or modify existing ones

## 📞 Support

For questions or issues, refer to:
- Component source code (well-commented)
- README files in the project
- Mock data files for data structure reference

---

**Enjoy exploring GramCare! 🏥💚**

Built for rural healthcare connectivity 🌾

# GramCare Portal Integration Guide

## Overview
This guide explains how to switch between the **Patient Portal (CHA Interface)** and the **Doctor Portal**.

## Current Architecture

### Patient Portal (CHA Interface)
- **Entry Point**: `src/index.js` → `src/App.js`
- **Base Route**: `/`
- **Components**: `src/components/`
- **Mock Data**: `src/mockData.js`

### Doctor Portal
- **Entry Point**: `src/indexDoctor.js` → `src/DoctorApp.js`
- **Base Route**: `/doctor`
- **Components**: `src/components/doctor/`
- **Mock Data**: `src/mockDataDoctor.js`

## How to Switch Between Portals

### Option 1: Quick Switch (Development)

#### For Windows:
```bash
# Run Doctor Portal
cd healthcarecentre/frontend
tmp_rovodev_run_doctor_portal.bat

# Restore Patient Portal
tmp_rovodev_restore_patient_portal.bat
```

#### Manual Method:
```bash
cd healthcarecentre/frontend/src

# Switch to Doctor Portal
copy index.js index.js.backup
copy indexDoctor.js index.js
cd ..
npm start

# Switch back to Patient Portal
cd src
copy index.js.backup index.js
del index.js.backup
```

### Option 2: Unified Portal (Recommended for Production)

Create a unified entry point that handles both portals based on the route.

**Step 1**: Create a new main app file `src/MainApp.js`:

```javascript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App"; // Patient Portal
import DoctorApp from "./DoctorApp"; // Doctor Portal

function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Patient Portal Routes */}
        <Route path="/*" element={<App />} />
        
        {/* Doctor Portal Routes */}
        <Route path="/doctor/*" element={<DoctorApp />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainApp;
```

**Step 2**: Update `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './MainApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
```

**Step 3**: Remove BrowserRouter from both `App.js` and `DoctorApp.js` since it's now in MainApp.

### Option 3: Subdomain-based (Production)

Deploy portals on different subdomains:
- Patient Portal: `https://cha.gramcare.in`
- Doctor Portal: `https://doctor.gramcare.in`

Build separately:
```bash
# Build Patient Portal
npm run build

# Build Doctor Portal (after switching index.js)
npm run build
```

## Accessing the Portals

### Development URLs
- **Patient Portal**: `http://localhost:3000/`
- **Doctor Portal**: `http://localhost:3000/doctor` (if using unified approach)

### Production URLs (Example)
- **Patient Portal**: `https://app.gramcare.in/`
- **Doctor Portal**: `https://app.gramcare.in/doctor` or `https://doctor.gramcare.in/`

## Route Structure

### Patient Portal Routes
```
/                           - Dashboard
/register                   - Patient Registration
/history                    - Medical History
/appointments               - Appointments
/inventory                  - Medicine Inventory
/patient-search            - Patient Search
```

### Doctor Portal Routes
```
/doctor                     - Doctor Dashboard
/doctor/queue              - Patient Queue
/doctor/consultation       - Consultation Interface
/doctor/consultation/:id   - Consultation with Patient
/doctor/appointments       - Appointments Management
/doctor/patient-history    - Patient Medical Records
```

## Authentication Flow (Future Implementation)

```
User Login
    ↓
Check Role
    ├─→ CHA/Staff → Patient Portal (/)
    └─→ Doctor → Doctor Portal (/doctor)
```

## Environment Variables

Add to `.env`:
```
REACT_APP_PORTAL_TYPE=unified
REACT_APP_API_URL=https://api.gramcare.in
REACT_APP_PATIENT_PORTAL_URL=/
REACT_APP_DOCTOR_PORTAL_URL=/doctor
```

## Testing Both Portals

### Test Patient Portal:
1. Run `npm start`
2. Navigate to `http://localhost:3000/`
3. Test all CHA features

### Test Doctor Portal:
1. Switch using batch script OR use unified approach
2. Navigate to `http://localhost:3000/doctor`
3. Test all doctor features

## Common Issues & Solutions

### Issue 1: Routes Conflicting
**Solution**: Ensure BrowserRouter is only in one place (MainApp for unified, or individual apps)

### Issue 2: Styles Not Loading
**Solution**: Both portals share the same `index.css` and Tailwind config

### Issue 3: Components Not Found
**Solution**: Check import paths use `@/` alias configured in jsconfig.json

## Deployment Checklist

- [ ] Build both portals and verify no errors
- [ ] Test all routes in both portals
- [ ] Verify navigation between pages
- [ ] Check responsive design on mobile
- [ ] Test dark mode in both portals
- [ ] Verify all icons and images load
- [ ] Test form submissions
- [ ] Check console for errors

## Performance Tips

1. **Code Splitting**: Use React.lazy() for route-based code splitting
2. **Shared Components**: Both portals share UI components from `src/components/ui/`
3. **Separate Chunks**: Consider building separate JS bundles for each portal
4. **Caching**: Implement proper caching strategies

## Future Enhancements

1. **Role-Based Access Control**: Implement proper authentication and authorization
2. **Shared Components**: Extract common features into shared components
3. **State Management**: Consider Redux or Context API for complex state
4. **Real-time Updates**: WebSocket for live patient queue updates
5. **Progressive Web App**: Make both portals installable

## Support

For implementation questions, refer to:
- `DOCTOR_PORTAL_README.md` - Doctor Portal documentation
- `README.md` - Patient Portal documentation
- Source code comments in component files

---

**Last Updated**: February 25, 2026

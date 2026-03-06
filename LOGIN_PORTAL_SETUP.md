# Login Portal Integration Guide

## Overview

Your healthcare center now has a unified login page that routes users to either:
- **Healthcare Portal** (Port 3000) - For patients & health center staff
- **Doctor Portal** (Port 3001) - For doctors

## How It Works

1. **Login Page** (`LoginPage.js`)
   - Beautiful split-screen design
   - Left side: Health Center login (Green)
   - Right side: Doctor login (Blue)
   - Smooth animations and transitions

2. **Smart Routing** (`RootApp.js`)
   - Shows login page until user logs in
   - Saves user role to `localStorage`
   - Routes to appropriate portal based on role
   - Persists session on page refresh

3. **Logout Functionality**
   - Both portals now have logout buttons
   - Located in bottom of sidebar (Healthcare & Doctor)
   - Clears localStorage and returns to login page

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Run Healthcare Portal (Port 3000)
```bash
npm start
```
This opens: http://localhost:3000
- Shows login page first
- Click "Health Center" to login to healthcare portal

### Step 3: Run Doctor Portal (Port 3001) - NEW TERMINAL
```bash
npm run start:doctor
```
This opens: http://localhost:3001
- Same login page
- Click "Doctor" to login to doctor portal

## File Structure

```
src/
├── index.js                    # Updated to use RootApp
├── RootApp.js                 # NEW - Smart router component
├── LoginPage.js               # NEW - Login page component
├── App.js                     # Healthcare portal (updated with logout)
├── DoctorApp.js              # Doctor portal (updated with logout)
├── App.css                    # Updated with login styles
└── ...other files
```

## Key Changes Made

### 1. New Files Created
- `LoginPage.js` - Beautiful split-screen login UI
- `RootApp.js` - Smart routing logic with localStorage

### 2. Files Modified
- `index.js` - Now uses `RootApp` instead of `MainApp`
- `App.js` - Added logout button in sidebar
- `DoctorApp.js` - Added logout button in sidebar
- `App.css` - Added login page styles (346 lines)
- `package.json` - Added `start:doctor` script

### 3. Features Added
- Login form for healthcare (Center ID + PIN)
- Login form for doctor (Doctor ID + Password)
- Session persistence with localStorage
- Animated transitions between login and portals
- Logout buttons in both portals

## Running Both Portals Simultaneously

### Terminal 1 - Healthcare Portal
```bash
cd frontend
npm start
# Opens on http://localhost:3000
```

### Terminal 2 - Doctor Portal
```bash
cd frontend
npm run start:doctor
# Opens on http://localhost:3001
```

## Testing Login Flow

1. **Healthcare Portal Test:**
   - Go to http://localhost:3000
   - Click "Health Center" side
   - Enter any Center ID and PIN
   - Click "Enter"
   - You're now in the healthcare portal
   - Click logout to return to login

2. **Doctor Portal Test:**
   - Go to http://localhost:3001
   - Click "Doctor" side
   - Enter any Doctor ID and Password
   - Click "Login"
   - You're now in the doctor portal
   - Click logout to return to login

3. **Session Persistence Test:**
   - Login to healthcare portal on 3000
   - Refresh the page
   - You'll stay logged in to healthcare portal
   - Now logout and login to doctor portal on 3001
   - Refresh the page
   - You'll stay logged in to doctor portal

## Behind the Scenes

### RootApp Logic
```javascript
1. Check if user is logged in (from localStorage)
2. If NO → Show LoginPage
3. If YES:
   - Role = "center" → Show App (Healthcare Portal)
   - Role = "doctor" → Show DoctorApp (Doctor Portal)
4. On logout → Clear localStorage, return to LoginPage
```

### localStorage Keys Used
- `userRole` - Stores either "center" or "doctor"

## Customization

### Change Login Credentials Validation
Edit `LoginPage.js` and add backend API validation:
```javascript
const handleLogin = async (side, e) => {
  e.preventDefault();
  // Add API call to validate credentials
  const response = await fetch('/api/login', { ... });
  if (response.ok) {
    onLoginSuccess(side);
  }
};
```

### Change Port Numbers
Edit `package.json`:
```json
"scripts": {
  "start": "PORT=5000 craco start",      // Change 3000
  "start:doctor": "PORT=5001 craco start" // Change 3001
}
```

### Customize Login Styles
All login styles are in `App.css` under the "LOGIN PAGE STYLES" section

## Troubleshooting

**Issue:** Port 3000/3001 already in use
- **Solution:** Kill the process or use different ports in `package.json`

**Issue:** Login page not showing
- **Solution:** Check that `index.js` imports `RootApp`, not `MainApp`

**Issue:** Logout not working
- **Solution:** Verify `onLogout` prop is passed from `RootApp` to portals

**Issue:** States not persisting on refresh
- **Solution:** Check localStorage in browser DevTools

## Next Steps

1. ✅ Integrate with real backend authentication API
2. ✅ Add form validation and error messages
3. ✅ Skip login page if auto-login token exists
4. ✅ Add role-based permissions in portals
5. ✅ Add session timeout functionality

---

**Setup Date:** March 1, 2026
**Integration Status:** ✅ Complete and Ready to Test

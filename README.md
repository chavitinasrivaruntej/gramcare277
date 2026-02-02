# GramCare - Rural Healthcare Connectivity Platform

A modern, accessible healthcare dashboard designed for Community Health Assistants (CHAs) serving rural communities.

## 🌟 Features

### Core Functionality
- **Live Patient Queue Management** - Real-time status tracking with color-coded priorities
- **Vitals Quick Entry** - Fast data entry with real-time validation
- **Emergency Action Hub** - Dedicated section for critical cases with emergency contacts
- **Medicine Inventory** - Track stock levels with low-stock alerts
- **Patient Registration** - Comprehensive patient onboarding
- **Medical History** - Timeline view of patient records
- **Appointment Scheduling** - Calendar-based appointment management

### Design Highlights
- **Dark Mode Support** - Full light/dark theme toggle
- **GramCare Green (#7db540)** - Brand-consistent color palette
- **High Accessibility** - Large fonts, high contrast for rural healthcare workers
- **Responsive Layout** - Works across all device sizes
- **Collapsible Sidebar** - Maximize workspace when needed

## 🎨 Design System

### Colors
- **Primary**: #7db540 (GramCare Green)
- **Status Colors**:
  - Critical: Red (#ef4444)
  - Waiting: Amber (#f59e0b)
  - Completed: Green (#22c55e)
  - In Consultation: Blue (#3b82f6)

### Typography
- **Headings**: Manrope (Modern, friendly medical feel)
- **Body**: Inter (High legibility)
- **Monospace**: JetBrains Mono (For vitals/data)

## 📊 Dashboard Widgets

### Quick Stats
Four-column grid displaying:
- Patients Today
- In Queue
- Completed Consultations
- Critical Cases

### Live Patient Queue
Real-time patient tracking with:
- Token numbers
- Status indicators (Waiting/Critical/Completed/In-Consultation)
- Patient demographics
- Chief complaints
- Check-in times

### Vitals Quick Entry
Fast vitals recording with validation:
- Blood Pressure
- Heart Rate
- Temperature (alerts if > 101°F)
- SpO2 (alerts if < 94%)
- Weight

### Emergency Action Hub
Critical patient management:
- Active critical cases
- Emergency contact directory
- Quick actions (Call Ambulance, Refer to Hospital)

## 🏥 Patient Management

### Registration Form
Comprehensive patient intake:
- Personal information (name, age, gender, blood group)
- Contact details
- Address information
- Medical history (allergies, chronic conditions)
- Emergency contacts
- Optional photo capture

### Medical History
Patient record timeline:
- Diagnosis details
- Treatment prescribed
- Clinical notes
- Follow-up dates
- Print functionality

### Appointments
Schedule management:
- Date-based filtering
- Appointment type categories
- Provider assignment
- Status tracking
- Weekly overview stats

## 💊 Medicine Inventory

Comprehensive stock management:
- Real-time stock levels
- Low-stock warnings (amber)
- Critical stock alerts (red)
- Adequate stock indicators (green)
- Category-based organization
- Expiry date tracking
- Search and filter capabilities
- Export functionality
- Purchase order generation

## 🔧 Technical Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **UI Components**: Shadcn/UI (Radix UI)
- **Animations**: Custom CSS animations

## 🚀 Getting Started

The application is already running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8001

### Mock Data
High-quality mock data is pre-loaded for:
- 7 patients in queue (various statuses)
- 8 medicines in inventory (with stock levels)
- 5 upcoming appointments
- 4 medical history records

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full sidebar with expanded navigation
- **Tablet**: Collapsible sidebar for more space
- **Mobile**: Optimized touch targets and stacked layouts

## ♿ Accessibility Features

- High contrast ratios (4.5:1 minimum)
- Large, readable fonts
- Keyboard navigation support
- Focus indicators on all interactive elements
- ARIA labels for screen readers
- `data-testid` attributes for automated testing

## 🎯 User Roles

**Community Health Assistant (CHA)**
- View/manage patient queue
- Record patient vitals
- Access medical history
- Schedule appointments
- Monitor medicine inventory
- Handle emergency cases

## 🔮 Future Enhancements

- Backend integration with MongoDB
- Real-time updates via WebSocket
- SMS/WhatsApp notifications
- Telemedicine integration
- Multi-language support
- Offline mode for rural connectivity
- Analytics dashboard
- Report generation

## 🎨 Color Customization

The primary color (#7db540) can be easily changed in:
- `/app/frontend/src/index.css` - CSS variables
- `/app/design_guidelines.json` - Design tokens

## 📝 Notes

- All forms have validation
- Mock data represents realistic rural healthcare scenarios
- Indian patient names and contexts for authenticity
- Emergency contacts include standard Indian emergency numbers (108)

---

**Built with ❤️ for Rural Healthcare Workers**

*Serving the community with care*

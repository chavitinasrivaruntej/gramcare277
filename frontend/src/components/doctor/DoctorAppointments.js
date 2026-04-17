import { useState } from "react";
import { 
  Calendar, Clock, User, Video, Phone, MessageSquare,
  Filter, Search, Plus, ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { upcomingAppointments, todayConsultations } from "@/mockDataDoctor";

export default function DoctorAppointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [searchQuery, setSearchQuery] = useState("");

  // Generate calendar data for the current month
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const changeMonth = (delta) => {
    setSelectedDate(new Date(currentYear, currentMonth + delta, 1));
  };

  // Mock appointments by date
  const appointmentsByDate = {
    '2026-02-25': [
      ...upcomingAppointments,
      {
        id: 'A004',
        patientName: 'Ravi Kumar',
        time: '02:00 PM',
        type: 'Follow-up',
        condition: 'Back Pain'
      },
      {
        id: 'A005',
        patientName: 'Deepa Singh',
        time: '03:30 PM',
        type: 'New Patient',
        condition: 'Skin Allergy'
      }
    ],
    '2026-02-26': [
      {
        id: 'A006',
        patientName: 'Amit Patel',
        time: '10:00 AM',
        type: 'Follow-up',
        condition: 'Diabetes'
      },
      {
        id: 'A007',
        patientName: 'Neha Sharma',
        time: '11:30 AM',
        type: 'New Patient',
        condition: 'General Checkup'
      }
    ]
  };

  const getTodayAppointments = () => {
    const today = selectedDate.toISOString().split('T')[0];
    return appointmentsByDate[today] || [];
  };

  const stats = {
    today: getTodayAppointments().length,
    thisWeek: 24,
    thisMonth: 92,
    completed: todayConsultations.filter(c => c.status === 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E3A8A] dark:text-blue-400 mb-1" style={{fontFamily: 'Manrope'}}>
            Appointments
          </h1>
          <p className="text-sm font-medium text-blue-600/70 dark:text-blue-300/70">
            Manage your consultation schedule
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="doctor-card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.today}</p>
                <p className="text-sm text-muted-foreground font-medium">Today</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="doctor-card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground font-medium">This Week</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="doctor-card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
                <p className="text-sm text-muted-foreground font-medium">This Month</p>
              </div>
              <User className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="doctor-card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-indigo-600">{stats.completed}</p>
                <p className="text-sm text-muted-foreground font-medium">Completed Today</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-lg">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-semibold min-w-[150px] text-center">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day names */}
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(currentYear, currentMonth, day);
                const dateString = date.toISOString().split('T')[0];
                const isToday = dateString === new Date().toISOString().split('T')[0];
                const isSelected = dateString === selectedDate.toISOString().split('T')[0];
                const hasAppointments = appointmentsByDate[dateString]?.length > 0;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square p-2 rounded-lg border cursor-pointer transition-all
                      flex flex-col items-center justify-center
                      ${isSelected ? 'border-primary bg-primary text-white shadow-md shadow-primary/30' : 'hover:border-primary/50 hover:bg-blue-50'}
                      ${isToday && !isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''}
                    `}
                  >
                    <span className="text-sm font-medium">{day}</span>
                    {hasAppointments && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              {getTodayAppointments().length} appointments scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {getTodayAppointments().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments</p>
                </div>
              ) : (
                getTodayAppointments().map(appointment => (
                  <div 
                    key={appointment.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground mb-1">
                          {appointment.patientName}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {appointment.condition}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                          <span className="text-xs font-medium text-primary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.time}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                            <Video className="w-3 h-3 mr-1" />
                            Join
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Upcoming Appointments</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(appointmentsByDate).map(([date, appointments]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 sticky top-0 bg-background py-2">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="p-4 border rounded-lg hover:border-primary transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{appointment.patientName}</h4>
                            <p className="text-xs text-muted-foreground">{appointment.condition}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Video className="w-3 h-3 mr-1" />
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

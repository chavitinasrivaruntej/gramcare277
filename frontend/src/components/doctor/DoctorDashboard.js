import { useState, useEffect } from "react";
import { 
  Users, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Calendar, Activity, FileText,
  Video, Phone, MessageSquare, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  doctorStats, 
  todayConsultations, 
  upcomingAppointments,
  recentPrescriptions 
} from "@/mockDataDoctor";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }));

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Today's Patients",
      value: doctorStats.todayPatients,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+3 from yesterday"
    },
    {
      title: "Completed",
      value: doctorStats.completed,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: `${doctorStats.todayPatients - doctorStats.inQueue} total`
    },
    {
      title: "In Queue",
      value: doctorStats.inQueue,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: "Avg wait: 12 min"
    },
    {
      title: "Critical Cases",
      value: doctorStats.criticalCases,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      change: "Immediate attention"
    }
  ];

  const waitingPatients = todayConsultations.filter(c => c.status === 'waiting');
  const criticalPatients = waitingPatients.filter(c => c.priority === 'high' || c.priority === 'critical');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
            {getGreeting()}, Doctor 👋
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/queue')}
          >
            <Clock className="w-4 h-4 mr-2" />
            View Queue
          </Button>
          <Button 
            onClick={() => navigate('/consultation')}
            className="bg-primary hover:bg-primary/90"
          >
            <Video className="w-4 h-4 mr-2" />
            Start Consultation
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {stat.title === "Critical Cases" && stat.value > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Queue - Priority */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Queue</CardTitle>
                <CardDescription>Patients waiting for consultation</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/queue')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalPatients.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Priority Cases
                  </h3>
                  {criticalPatients.slice(0, 2).map((patient) => (
                    <div 
                      key={patient.id}
                      className="flex items-center justify-between p-4 rounded-lg border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 mb-2 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/consultation/${patient.patientId}`)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                          {patient.tokenNumber}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{patient.patientName}</h4>
                            <Badge variant="destructive" className="text-xs">
                              {patient.priority === 'critical' ? 'Critical' : 'High Priority'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{patient.complaint}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {patient.checkInTime}
                            </span>
                            <span>{patient.age}Y, {patient.gender}</span>
                            <span>BP: {patient.vitals.bloodPressure}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive">
                        Start Now
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Regular Queue</h3>
              {waitingPatients.filter(p => p.priority === 'normal').slice(0, 3).map((patient) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/consultation/${patient.patientId}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                      {patient.tokenNumber}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{patient.patientName}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{patient.complaint}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {patient.checkInTime}
                        </span>
                        <span>{patient.age}Y, {patient.gender}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <CardDescription>Today's scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {appointment.patientName}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {appointment.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {appointment.condition}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
              <CardDescription>Latest consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPrescriptions.map((prescription) => (
                  <div 
                    key={prescription.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground mb-1">
                        {prescription.patientName}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {prescription.diagnosis}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {prescription.medicines} medicines
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {prescription.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/queue')}
            >
              <Users className="w-6 h-6" />
              <span>View All Patients</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/consultation')}
            >
              <Video className="w-6 h-6" />
              <span>Start Video Call</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/appointments')}
            >
              <Calendar className="w-6 h-6" />
              <span>Manage Appointments</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/patient-history')}
            >
              <Activity className="w-6 h-6" />
              <span>Patient Records</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

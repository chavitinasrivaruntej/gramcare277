import { useState, useEffect } from "react";
import {
  Clock, AlertCircle, CheckCircle, User, Activity,
  Search, Filter, ArrowRight, Phone, Video, MessageSquare
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { todayConsultations as defaultConsultations } from "@/mockDataDoctor";

export default function PatientQueue() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, waiting, in-progress, completed
  const [filterPriority, setFilterPriority] = useState("all"); // all, high, normal
  const [patientQueue, setPatientQueue] = useState(defaultConsultations);

  const today = new Date('2026-02-06').toISOString().split('T')[0];

  // Load appointments from localStorage and sync with patient queue
  useEffect(() => {
    const loadAppointmentsAsQueue = () => {
      const savedAppointments = localStorage.getItem('gramcare_appointments');
      if (savedAppointments) {
        try {
          const appointments = JSON.parse(savedAppointments);
          
          // Convert appointments to patient queue format for today only
          const todayAppointments = appointments
            .filter(apt => apt.date === today)
            .map((apt, index) => ({
              id: apt.id,
              patientId: apt.patientId,
              patientName: apt.patientName,
              age: apt.age,
              gender: apt.gender || 'Not specified',
              tokenNumber: `T-${String(index + 1).padStart(3, '0')}`,
              status: apt.status === 'scheduled' ? 'waiting' : apt.status === 'active' ? 'in-progress' : 'completed',
              checkInTime: apt.time,
              priority: apt.priority === 'high' ? 'high' : 'normal',
              complaint: apt.complaint,
              vitals: apt.vitals || {
                temperature: 'N/A',
                bloodPressure: 'N/A',
                pulse: 'N/A',
                oxygenSaturation: 'N/A',
                weight: 'N/A'
              },
              previousVisits: 0,
              lastVisit: apt.completedAt || null
            }));

          // Merge with any existing consultations not in appointments
          const appointmentIds = new Set(todayAppointments.map(a => a.id));
          const mergedQueue = [
            ...todayAppointments,
            ...defaultConsultations.filter(c => !appointmentIds.has(c.id))
          ];

          setPatientQueue(mergedQueue);
        } catch (error) {
          console.error('Error loading appointments:', error);
          setPatientQueue(defaultConsultations);
        }
      }
    };

    loadAppointmentsAsQueue();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadAppointmentsAsQueue();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [today]);

  // Filter patients based on search and filters
  const filteredPatients = patientQueue.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.complaint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
    const matchesPriority = filterPriority === "all" || patient.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-950 border-red-200';
      case 'normal':
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950 border-blue-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Waiting</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: patientQueue.length,
    waiting: patientQueue.filter(p => p.status === 'waiting').length,
    inProgress: patientQueue.filter(p => p.status === 'in-progress').length,
    completed: patientQueue.filter(p => p.status === 'completed').length,
    critical: patientQueue.filter(p => (p.priority === 'high' || p.priority === 'critical') && p.status !== 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope' }}>
          Patient Queue
        </h1>
        <p className="text-muted-foreground">
          Manage and prioritize patient consultations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('all')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('waiting')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.waiting}</p>
                <p className="text-sm text-muted-foreground">Waiting</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('in-progress')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <Activity className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('completed')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterPriority('high')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Priority</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, token, or complaint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'waiting' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('waiting')}
              >
                Waiting
              </Button>
              <Button
                variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('in-progress')}
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterPriority === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterPriority('all')}
              >
                All Priority
              </Button>
              <Button
                variant={filterPriority === 'high' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setFilterPriority('high')}
              >
                High Priority
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No patients found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${patient.priority === 'high' || patient.priority === 'critical'
                  ? 'border-2 border-red-200 dark:border-red-800'
                  : ''
                }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Token Number */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-sm ${patient.priority === 'high' || patient.priority === 'critical'
                      ? 'bg-gradient-to-br from-red-400 to-red-600'
                      : patient.status === 'completed'
                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                        : patient.status === 'in-progress'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                          : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                    {patient.tokenNumber}
                  </div>

                  {/* Patient Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {patient.patientName}
                          </h3>
                          {getStatusBadge(patient.status)}
                          {(patient.priority === 'high' || patient.priority === 'critical') && (
                            <Badge variant="destructive">
                              {patient.priority === 'critical' ? 'Critical' : 'High Priority'}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>ID: {patient.patientId}</span>
                          <span>•</span>
                          <span>{patient.age} Years</span>
                          <span>•</span>
                          <span>{patient.gender}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Check-in: {patient.checkInTime}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-3">
                          <span className="font-semibold">Complaint: </span>
                          {patient.complaint}
                        </p>
                      </div>
                    </div>

                    {/* Vitals */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-sm font-semibold">{patient.vitals.temperature}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                        <p className="text-sm font-semibold">{patient.vitals.bloodPressure}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pulse</p>
                        <p className="text-sm font-semibold">{patient.vitals.pulse}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">SpO2</p>
                        <p className="text-sm font-semibold">{patient.vitals.oxygenSaturation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Weight</p>
                        <p className="text-sm font-semibold">{patient.vitals.weight}</p>
                      </div>
                    </div>

                    {/* Patient History Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Previous Visits: {patient.previousVisits}</span>
                      {patient.lastVisit && (
                        <>
                          <span>•</span>
                          <span>Last Visit: {patient.lastVisit}</span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      {patient.status !== 'completed' && (
                        <>
                          <Button
                            onClick={() => navigate(`/consultation/${patient.patientId}`)}
                            className={
                              patient.priority === 'high' || patient.priority === 'critical'
                                ? 'bg-red-600 hover:bg-red-700'
                                : ''
                            }
                          >
                            <Video className="w-4 h-4 mr-2" />
                            {patient.status === 'in-progress' ? 'Continue Consultation' : 'Start Consultation'}
                          </Button>
                          <Button variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                          <Button variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </>
                      )}
                      {patient.status === 'completed' && (
                        <Button variant="outline" onClick={() => navigate(`/consultation/${patient.patientId}`)}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

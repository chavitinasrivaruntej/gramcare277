import { useState, useEffect } from "react";
import {
  Clock, AlertCircle, CheckCircle, User, Activity,
  Search, Filter, ArrowRight, Phone, Video, MessageSquare,
  Calendar, Stethoscope, AlertTriangle, PlayCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUnifiedData } from "@/hooks/useUnifiedData";

export default function PatientQueue() {
  const navigate = useNavigate();
  const { patients } = useUnifiedData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterPriority, setFilterPriority] = useState("all");

  // Filter patients based on search and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      (patient?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (patient?.tokenId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (patient?.complaint?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
    const matchesPriority = filterPriority === "all" || 
      (filterPriority === 'high' && (patient.priority === 'high' || patient.priority === 'critical' || patient.priority === 'urgent'));

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status, priority) => {
    if (priority === 'critical' || priority === 'urgent' || priority === 'high') {
      return <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />;
    }
    switch (status) {
      case 'waiting':
      case 'scheduled':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'in_progress':
      case 'in-progress':
        return <PlayCircle className="w-6 h-6 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <User className="w-6 h-6 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
      case 'urgent':
      case 'high':
        return 'text-rose-700 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900';
      default:
        return 'text-blue-700 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Waiting</Badge>;
      case 'in_progress':
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Scheduled</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === 'waiting' || p.status === 'scheduled').length,
    inProgress: patients.filter(p => p.status === 'in_progress' || p.status === 'in-progress').length,
    completed: patients.filter(p => p.status === 'completed').length,
    critical: patients.filter(p => (p.priority === 'high' || p.priority === 'critical' || p.priority === 'urgent') && p.status !== 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1E3A8A] dark:text-blue-400 mb-1" style={{ fontFamily: 'Manrope' }}>
          Patient Queue
        </h1>
        <p className="text-sm font-medium text-blue-600/70 dark:text-blue-300/70">
          Manage and prioritize patient consultations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Patients', value: stats.total, icon: User, color: 'blue', action: () => setFilterStatus('all') },
          { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'blue', action: () => setFilterStatus('waiting') },
          { label: 'In Progress', value: stats.inProgress, icon: PlayCircle, color: 'amber', action: () => setFilterStatus('in-progress') },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green', action: () => setFilterStatus('completed') },
          { label: 'Priority', value: stats.critical, icon: AlertTriangle, color: 'red', action: () => setFilterPriority('high') }
        ].map((stat, idx) => (
          <Card key={idx} className={`cursor-pointer hover:shadow-md transition-shadow border-t-4 border-t-${stat.color}-500`} onClick={stat.action}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full w-fit">
          {['all', 'waiting', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`medical-pill ${filterStatus === status ? 'doctor-pill-active' : 'doctor-pill-inactive'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full h-10 border-slate-200 dark:border-slate-700"
            />
          </div>
          <Button
            variant={filterPriority === 'high' ? 'destructive' : 'outline'}
            className="rounded-full h-10 px-4"
            onClick={() => setFilterPriority(filterPriority === 'high' ? 'all' : 'high')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            High Priority
          </Button>
        </div>
      </div>

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
              key={patient.patientId}
              className={`doctor-card-shadow doctor-card-hover border-l-4 transition-all overflow-hidden ${
                patient.priority === 'critical' || patient.priority === 'high'
                  ? 'border-l-rose-500 bg-rose-50/10'
                  : patient.status === 'completed'
                  ? 'border-l-green-500'
                  : patient.status === 'in_progress' || patient.status === 'in-progress'
                  ? 'border-l-amber-500'
                  : 'border-l-blue-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-6">
                  {/* Left: Icon & Patient Info */}
                  <div className="flex items-center gap-4 w-1/3">
                    <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800`}>
                      {getStatusIcon(patient.status, patient.priority)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-bold text-[#1E3A8A] dark:text-blue-400 truncate">
                          {patient.tokenId} | {patient.name}
                        </h3>
                        {getStatusBadge(patient.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span>{patient.age}Y • {patient.gender}</span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          {patient.complaint}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Vitals Chips */}
                  <div className="flex-1 flex items-center gap-3">
                    {[
                      { label: 'Temp', value: patient?.vitals?.temperature || 'N/A' },
                      { label: 'BP', value: patient?.vitals?.bloodPressure || 'N/A' },
                      { label: 'Pulse', value: patient?.vitals?.pulse || 'N/A' },
                      { label: 'SpO2', value: patient?.vitals?.oxygenSaturation || 'N/A' }
                    ].map((v, i) => (
                      <div key={i} className="vitals-chip flex-1 text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-600/60 leading-none mb-1">{v.label}</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{v.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-fit">
                    {patient.status !== 'completed' ? (
                      <Button
                        onClick={() => navigate(`/consultation/${patient.patientId}`)}
                        className={`h-10 px-6 rounded-full font-bold shadow-lg transition-all ${
                          patient.priority === 'critical' || patient.priority === 'high'
                            ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                            : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                        }`}
                      >
                        {patient.status === 'in_progress' || patient.status === 'in-progress' ? 'Continue' : 'Start'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-full h-10 px-6 font-bold"
                        onClick={() => navigate(`/consultation/${patient.patientId}`)}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
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

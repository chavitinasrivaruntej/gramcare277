import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Search, ArrowRight, Clock, AlertTriangle, 
  Stethoscope, Calendar, Filter, CheckCircle, Timer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUnifiedData } from "@/hooks/useUnifiedData";

export default function ConsultationSelection() {
  const navigate = useNavigate();
  const { patients } = useUnifiedData();
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(new Date());

  // Update "now" every second for live timers
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to calculate time difference
  const getTimeDiff = (targetTime) => {
    const target = new Date(targetTime);
    const diff = target - now;
    
    if (diff < 0) return { expired: true, text: "00:00:00" };
    
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    return {
      expired: false,
      text: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
      minutesRemaining: diff / 60000
    };
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      if (p.status === 'completed') return false;

      const diff = getTimeDiff(p.appointmentTime);
      
      // Rule: Show if urgent OR in_progress OR starting within 15 mins OR already late
      const isUrgent = p.priority === 'critical' || p.priority === 'urgent' || p.priority === 'high';
      const isInProgress = p.status === 'in_progress' || p.status === 'in-progress';
      const isImminent = diff.minutesRemaining <= 15 || diff.expired;

      if (!isUrgent && !isInProgress && !isImminent) return false;

      const matchesSearch = (p?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                           (p?.tokenId?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    }).sort((a, b) => {
      // Priority sorting
      const priorityMap = { 'critical': 0, 'urgent': 0, 'high': 1, 'normal': 2 };
      if (priorityMap[a.priority] !== priorityMap[b.priority]) {
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      return new Date(a.appointmentTime) - new Date(b.appointmentTime);
    });
  }, [patients, searchQuery, now]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-[#1E3A8A] dark:text-blue-400 tracking-tight">
          Clinical Priority Board
        </h1>
        <p className="text-lg text-blue-600/70 dark:text-blue-300/70 font-medium">
          Showing imminent appointments and urgent clinical cases
        </p>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search priority clinical cases..." 
            className="pl-12 h-14 rounded-2xl border-blue-100 shadow-sm focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-center">
            <p className="text-2xl font-black text-rose-600 leading-none">
              {patients.filter(p => (p.priority === 'critical' || p.priority === 'urgent' || p.priority === 'high') && p.status !== 'completed').length}
            </p>
            <p className="text-[10px] uppercase font-bold text-rose-400 mt-1">Urgent Cases</p>
          </div>
          <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <p className="text-2xl font-black text-blue-600 leading-none">
              {filteredPatients.length}
            </p>
            <p className="text-[10px] uppercase font-bold text-blue-400 mt-1">Imminent/Active</p>
          </div>
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.length === 0 ? (
          <Card className="col-span-full py-20 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No Imminent Consultations</h3>
              <p className="text-slate-500">Upcoming appointments will appear here 15 mins before schedule.</p>
              <Button variant="link" className="text-blue-600 mt-4" onClick={() => navigate('/queue')}>
                View Full Patient Queue
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => {
            const timer = getTimeDiff(patient.appointmentTime);
            return (
              <Card 
                key={patient.patientId}
                className={`group transition-all duration-300 hover:shadow-xl border-2 cursor-pointer ${
                  patient.priority === 'critical' || patient.priority === 'urgent' 
                  ? 'border-rose-100 hover:border-rose-400 bg-rose-50/10' 
                  : 'border-blue-50 hover:border-blue-400 bg-white'
                } clinical-shadow overflow-hidden rounded-3xl`}
                onClick={() => navigate(`/consultation/${patient.patientId}`)}
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          patient.priority === 'critical' || patient.priority === 'urgent' 
                          ? 'bg-rose-100 text-rose-600' 
                          : 'bg-blue-100 text-blue-600'
                        }`}>
                          {patient.priority === 'critical' || patient.priority === 'urgent' ? <AlertTriangle className="animate-pulse" /> : <Timer />}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-[#1E3A8A] leading-tight flex items-center gap-2">
                            {patient.name}
                            {patient.status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
                          </h3>
                          <p className="text-sm font-bold text-blue-600/60 uppercase tracking-widest">
                            {patient.tokenId} • {patient.appointmentType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Countdown</p>
                         <div className={`px-3 py-1 rounded-xl text-sm font-mono font-black border ${
                           timer.expired ? 'bg-rose-600 text-white border-rose-600 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-100'
                         }`}>
                           {timer.expired ? 'TIME UP' : timer.text}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <Stethoscope className="w-4 h-4 text-blue-400" />
                          <span className="truncate">{patient.complaint}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Appt: {new Date(patient.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>{patient.age}Y • {patient.gender}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex gap-2">
                         <Badge variant="secondary" className="bg-blue-50/50 text-blue-700 font-bold border-blue-100">BP: {patient.vitals?.bloodPressure}</Badge>
                         <Badge variant="secondary" className="bg-blue-50/50 text-blue-700 font-bold border-blue-100">O2: {patient.vitals?.oxygenSaturation}</Badge>
                      </div>
                      <Button 
                        className={`rounded-2xl font-black px-6 transition-all duration-300 shadow-lg ${
                          patient.priority === 'critical' || patient.priority === 'urgent' 
                          ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' 
                          : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                        }`}
                      >
                        {patient.status === 'in_progress' ? 'Resume Session' : 'Start Session'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Access Actions */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button variant="ghost" className="text-blue-600 font-black h-12 rounded-2xl hover:bg-blue-50" onClick={() => navigate('/queue')}>
          View Full clinical Queue
        </Button>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        <Button variant="ghost" className="text-blue-600 font-black h-12 rounded-2xl hover:bg-blue-50" onClick={() => navigate('/patient-history')}>
          Recent Clinical Records
        </Button>
      </div>
    </div>
  );
}

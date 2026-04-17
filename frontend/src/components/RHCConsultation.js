import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mic, MicOff, Video, VideoOff, PhoneOff, 
  Settings, ShieldCheck, Activity, Info, Clock, Stethoscope,
  CheckCircle, AlertTriangle, ArrowLeft, Heart, Wind, Thermometer
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { startAgoraCall, endAgoraCall } from "./services/agoraService";
import { consultationEvents } from "@/lib/consultationEvents";

export default function RHCConsultation() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, updateStatus } = useUnifiedData();
  
  const [patient, setPatient] = useState(null);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [doctorIsReady, setDoctorIsReady] = useState(false);

  // Load patient data
  useEffect(() => {
    const found = patients.find(p => p.patientId === patientId);
    if (found) {
      setPatient(found);
    }
  }, [patients, patientId]);

  // Listen for Doctor Ready event
  useEffect(() => {
    const handleStorage = () => {
      const eventJson = localStorage.getItem('gramcare_consultation_event');
      if (eventJson) {
        try {
          const event = JSON.parse(eventJson);
          if (event.patientId === patientId && event.status === 'doctor_ready') {
            setDoctorIsReady(true);
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [patientId]);

  // Agora Logic
  const startConsultation = useCallback(async () => {
    try {
      const channel = patientId === 'P006' ? 'P006' : patientId;
      
      setIsJoined(true);
      
      // Emit Requested Event
      consultationEvents.emit({
        patientId,
        name: patient?.name || 'Patient',
        status: 'requested',
        source: 'rural_health_centre',
        complaint: patient?.complaint
      });

      await startAgoraCall(
        channel, 
        "rhc-local-player-view", 
        "rhc-remote-player-view",
        () => setRemoteJoined(true)
      );

      updateStatus(patientId, 'in_consultation', { 
        consultationStatus: 'live' 
      });

    } catch (error) {
      console.error("RHC Agora join failed:", error);
      setIsJoined(false);
    }
  }, [patientId, updateStatus, patient]);

  const endSession = useCallback(async () => {
    await endAgoraCall();
    updateStatus(patientId, 'completed');
    // Clear event on end
    consultationEvents.clearEvent();
    navigate('/appointments');
  }, [patientId, updateStatus, navigate]);

  if (!patient) return <div className="p-12 text-center font-black">Loading Patient Case...</div>;

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/appointments')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <h2 className="text-lg font-black text-[#1E3A8A] dark:text-blue-400 leading-none">Tele-Clinic Module</h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-widest">CHA Support Unit | {patient.village}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-blue-200 text-blue-600 font-bold px-4 py-1">Room ID: {patientId === 'P006' ? 'P006' : patientId}</Badge>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left: Video Area (Doctor centric) */}
        <div className="flex-[0.65] flex flex-col h-full bg-slate-950 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative">
          <div className="flex-1 relative bg-[#0B1120]">
            
            {/* PERSISTENT AGORA CONTAINERS (Always in DOM) */}
            <div className={`w-full h-full relative ${isJoined ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Main feed (Remote - Doctor) */}
                <div id="rhc-remote-player-view" className="w-full h-full" />
                
                {remoteJoined ? null : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-slate-950/90 z-10 transition-all duration-500">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 relative transition-all duration-700 ${doctorIsReady ? 'bg-emerald-500/20 scale-125' : 'bg-blue-500/10'}`}>
                       <div className={`absolute inset-0 rounded-full animate-ping ${doctorIsReady ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}></div>
                       {doctorIsReady ? <CheckCircle className="w-8 h-8 text-emerald-500" /> : <User className="w-8 h-8 text-blue-500" />}
                    </div>
                    <h3 className="text-white text-xl font-black transition-all">
                      {doctorIsReady ? 'Specialist is Ready' : 'Connecting to specialist...'}
                    </h3>
                    <p className={`text-sm mt-2 transition-all font-bold ${doctorIsReady ? 'text-emerald-400 uppercase tracking-widest' : 'text-slate-500'}`}>
                      {doctorIsReady ? 'Stable Secure clinical Tunnel Active' : 'Waiting for Dr. Amit Verma to join'}
                    </p>
                    
                    {doctorIsReady && (
                      <div className="mt-8 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse-gentle">
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Doctor is on standby</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Local feed (CHA) - Small Overlay */}
                <div className="absolute bottom-8 right-8 w-48 h-32 bg-slate-900 rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden group z-20">
                  <div id="rhc-local-player-view" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 rounded text-[10px] text-white font-bold uppercase tracking-tighter">
                    Local Preview
                  </div>
                </div>
            </div>

            {/* Placeholder / Start Button (Shown when not joined) */}
            {!isJoined && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6 z-30">
                <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center">
                  <Video className="w-10 h-10 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white text-2xl font-black tracking-tight">Consultation Link Ready</h3>
                  <p className="text-slate-400 text-sm mt-2">Patient {patient.name} is scheduled for virtual session.</p>
                </div>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-black px-12 rounded-2xl h-16 shadow-2xl shadow-primary/20 text-lg uppercase tracking-wider"
                  onClick={startConsultation}
                >
                  Start Now
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          {isJoined && (
            <div className="bg-slate-950 px-10 py-6 h-28 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex gap-4">
                <Button variant={isMicOn ? "secondary" : "destructive"} size="icon" className="w-12 h-12 rounded-2xl" onClick={() => setIsMicOn(!isMicOn)}>
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
                <Button variant={isVideoOn ? "secondary" : "destructive"} size="icon" className="w-12 h-12 rounded-2xl" onClick={() => setIsVideoOn(!isVideoOn)}>
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              </div>
              
              <Button variant="destructive" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/10" onClick={endSession}>
                <PhoneOff className="w-5 h-5 mr-3" />
                End Session
              </Button>
              
              <Button variant="ghost" className="w-12 h-12 text-slate-500"><Settings className="w-5 h-5" /></Button>
            </div>
          )}
        </div>

        {/* Right: Patient Panel */}
        <div className="flex-[0.35] flex flex-col gap-6 overflow-y-auto pr-1">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary font-black text-3xl">
                  {patient.tokenId?.split('-')[1] || 'LB'}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#1E3A8A]">{patient.name}</h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Age: {patient.age} | {patient.gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Temp', value: patient.vitals?.temperature, icon: Thermometer, color: 'text-orange-500' },
                  { label: 'Blood Pressure', value: patient.vitals?.bloodPressure, icon: Heart, color: 'text-rose-500' },
                  { label: 'Pulse Rate', value: patient.vitals?.pulse, icon: Activity, color: 'text-emerald-500' },
                  { label: 'SpO2 Level', value: patient.vitals?.oxygenSaturation, icon: Wind, color: 'text-blue-500' }
                ].map((v, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-3xl">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 leading-none">{v.label}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-slate-700">{v.value || 'N/A'}</span>
                      <v.icon className={`w-4 h-4 ${v.color}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Presenting Complaint</h4>
                    <p className="text-sm font-bold text-slate-700 leading-snug mt-1">{patient.complaint}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Assigned Doctor</h4>
                    <p className="text-sm font-bold text-slate-700 leading-snug mt-1">{patient.doctorAssigned || 'Specialist'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-slate-100 border-2 border-dashed bg-slate-50/50 flex-1 flex flex-col items-center justify-center p-10 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold leading-relaxed">
              Secure clinical support tunnel active. Please assist the doctor with patient vitals when requested.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

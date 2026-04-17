import React, { useState, useEffect } from 'react';
import { 
  Heart, Activity, Clock, ShieldCheck, Stethoscope, 
  PlayCircle, Wind, Thermometer, User, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { useNavigate } from "react-router-dom";

export default function PatientDashboardDemo() {
  const { patients } = useUnifiedData();
  const navigate = useNavigate();
  // Fixed demo ID for Lakshmi Bai
  const patientId = "P006";
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const found = patients.find(p => p.patientId === patientId);
    if (found) setPatient(found);
  }, [patients]);

  if (!patient) return <div className="p-12 text-center font-black">Loading Health Profile...</div>;

  const getStatusDisplay = () => {
    switch (patient.consultationStatus) {
      case 'requested':
        return {
          title: "Request Sent to Specialist",
          subtitle: "Hold on, we are connecting you with Dr. Amit Verma",
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="w-8 h-8 text-amber-500 animate-spin-slow" />
        };
      case 'doctor_ready':
        return {
          title: "Specialist is Ready",
          subtitle: "Dr. Amit Verma has joined the clinical tunnel. You can start now.",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
        };
      case 'live':
        return {
          title: "Consultation Live",
          subtitle: "You are currently in a secure clinical session.",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
        };
      case 'completed':
        return {
          title: "Consultation Completed",
          subtitle: "Your reports and prescription are being finalized.",
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <ShieldCheck className="w-8 h-8 text-slate-500" />
        };
      default:
        return {
          title: "Ready for Consultation",
          subtitle: "The RHC staff will initiate the link shortly.",
          color: "bg-slate-50 text-slate-500 border-slate-200",
          icon: <User className="w-8 h-8 text-slate-400" />
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 h-64 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 pt-12 text-white relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-blue-800 font-black text-4xl shadow-2xl">
              LB
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black">{patient.name}</h1>
                <Badge className="bg-white/20 text-white border-white/20 h-6">Age {patient.age}</Badge>
              </div>
              <p className="text-blue-100 font-bold mt-2 opacity-80 uppercase tracking-[0.2em] text-xs">
                Vansda Village Unit | ID: {patient.patientId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main clinical Status */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden mb-8">
          <CardContent className="p-0">
            <div className={`p-10 flex items-center justify-between transition-colors duration-500 ${status.color}`}>
              <div className="flex items-center gap-8">
                <div className="p-5 bg-white rounded-[2rem] shadow-sm">
                  {status.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black leading-tight tracking-tight">{status.title}</h2>
                  <p className="text-lg font-medium opacity-80 mt-1">{status.subtitle}</p>
                </div>
              </div>
              
              {patient.consultationStatus === 'doctor_ready' && (
                <Button 
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-3xl h-16 px-12 shadow-xl shadow-emerald-500/20 text-lg uppercase tracking-wider animate-pulse"
                  onClick={() => navigate('/consultation/' + patientId)}
                >
                  Join Room Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Stats */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-[#1E3A8A] px-4 flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-500" />
              Latest Health Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Blood Pressure', value: patient.vitals?.bloodPressure, icon: Heart, color: 'text-rose-500' },
                { label: 'Oxygen Level', value: patient.vitals?.oxygenSaturation, icon: Wind, color: 'text-blue-500' },
                { label: 'Pulse Rate', value: patient.vitals?.pulse, icon: Activity, color: 'text-emerald-500' },
                { label: 'Body Temp', value: patient.vitals?.temperature, icon: Thermometer, color: 'text-orange-500' }
              ].map((stat, i) => (
                <Card key={i} className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">Normal Range</Badge>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <h4 className="text-2xl font-black text-[#1E3A8A] mt-1">{stat.value || 'N/A'}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* clinical Instructions Sidebar */}
          <div className="space-y-6">
             <h3 className="text-xl font-black text-[#1E3A8A] px-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
              Instructions
            </h3>
            <Card className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white shadow-sm h-[300px] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                <Stethoscope className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold leading-relaxed">
                Specialist medical advice and prescriptions will appear here after your session with Dr. Amit Verma.
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bottom Floating Navigation for Demo */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
         <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-full shadow-2xl border border-slate-200 flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 rounded-full cursor-pointer font-black text-[10px] uppercase tracking-wider">
               Switch to RHC View
            </Badge>
            <div className="h-4 w-px bg-slate-300 mx-2"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Demo Mode: Patient Portal</p>
         </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Bell, X, CheckCircle, ExternalLink, 
  AlertTriangle, Stethoscope, Clock, ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { useNavigate } from "react-router-dom";

export default function NotificationPopup() {
  const { patients, updateStatus } = useUnifiedData();
  const navigate = useNavigate();
  const [activeRequest, setActiveRequest] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkEvents = () => {
      const eventJson = localStorage.getItem('gramcare_consultation_event');
      if (eventJson) {
        try {
          const event = JSON.parse(eventJson);
          if (event.status === 'requested' && event.source === 'rural_health_centre') {
            setActiveRequest({
              ...event,
              tokenId: `T-${event.patientId.slice(1)}` // fallback tokenId
            });
            setIsVisible(true);
            return;
          }
        } catch (e) {}
      }
      
      // Fallback to patient list if no direct event found
      const request = patients.find(p => p.consultationStatus === 'requested');
      if (request) {
        setActiveRequest(request);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setTimeout(() => setActiveRequest(null), 300);
      }
    };

    checkEvents();
    window.addEventListener('storage', checkEvents);
    return () => window.removeEventListener('storage', checkEvents);
  }, [patients]);

  const handleAccept = () => {
    if (!activeRequest) return;
    
    // Set status to doctor_ready
    updateStatus(activeRequest.patientId, activeRequest.status, { 
      consultationStatus: 'doctor_ready',
      doctorReadyTime: new Date().toISOString()
    });
    
    // Navigate to the consultation selection or direct channel
    navigate(`/doctor/consultation/${activeRequest.patientId}`);
    setIsVisible(false);
  };

  const handleView = () => {
    navigate('/doctor/queue');
    setIsVisible(false);
  };

  if (!activeRequest && !isVisible) return null;

  return (
    <div className={`fixed top-6 right-6 z-[100] w-96 transform transition-all duration-500 ease-out ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
    }`}>
      <Card className="doctor-card-shadow border-2 border-blue-500/20 bg-white/95 backdrop-blur-xl overflow-hidden rounded-[2rem]">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs font-black uppercase tracking-widest">Urgent clinical Request</span>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner border border-blue-100/50">
              {activeRequest?.tokenId?.split('-')[1] || 'NC'}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1E3A8A] leading-tight">{activeRequest?.name}</h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                Age: {activeRequest?.age} | {activeRequest?.village}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black text-rose-400 leading-none">Primary Complaint</p>
                <p className="text-sm font-bold text-rose-800 mt-1 truncate">{activeRequest?.complaint}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-bold text-slate-500">Requested from RHC Rural Node</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleAccept}
              className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider shadow-lg shadow-primary/20 gap-2"
            >
              <Stethoscope className="w-5 h-5" />
              Accept
            </Button>
            <Button 
              variant="outline"
              onClick={handleView}
              className="w-14 h-14 rounded-2xl border-slate-200 hover:bg-slate-50 p-0"
              title="View Queue"
            >
              <ExternalLink className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Abstract Pulse Animation background */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-blue-500/10 blur-3xl animate-pulse rounded-full"></div>
    </div>
  );
}

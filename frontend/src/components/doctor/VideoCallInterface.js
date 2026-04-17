import React, { useState, useEffect, useCallback } from "react";
import { User, Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MonitorOff, Settings, Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { startAgoraCall, endAgoraCall } from "../services/agoraService";
import { dataEngine } from "@/lib/dataEngine";
import { consultationEvents } from "@/lib/consultationEvents";

export default function VideoCallInterface({ 
  isCallActive, 
  isVideoOn, 
  isAudioOn, 
  isScreenSharing,
  callDuration,
  patientName,
  setIsCallActive,
  setIsVideoOn,
  setIsAudioOn,
  setIsScreenSharing,
  setCallDuration
}) {
  const { patientId } = useParams();
  const [remoteJoined, setRemoteJoined] = useState(false);

  const startCall = useCallback(async () => {
    try {
      const channel = patientId === 'P006' ? 'P006' : patientId;
      
      setIsCallActive(true);
      
      // Emit Doctor Ready Event
      consultationEvents.emit({
        patientId,
        name: patientName,
        status: 'doctor_ready',
        source: 'doctor_portal'
      });

      await startAgoraCall(
        channel, 
        "doctor-local-player-view", 
        "doctor-remote-player-view",
        () => setRemoteJoined(true)
      );

      dataEngine.updatePatientStatus(patientId, 'in_consultation', { 
        consultationStatus: 'live' 
      });

    } catch (error) {
      console.error("Doctor Agora join failed:", error);
      setIsCallActive(false);
    }
  }, [patientId, setIsCallActive, patientName]);

  const endCall = useCallback(async () => {
    await endAgoraCall();
    setIsCallActive(false);
    setRemoteJoined(false);
    setCallDuration(0);
  }, [setIsCallActive, setCallDuration]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* PERSISTENT AGORA CONTAINERS (Always in DOM to prevent session reset) */}
        <div className={`absolute inset-0 z-10 ${isCallActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Main Video Feed (Patient/RHC side) */}
            <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 overflow-hidden">
               {/* remote-player container */}
               <div id="doctor-remote-player-view" className="w-full h-full" />
               
               {remoteJoined ? null : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-slate-900/80 backdrop-blur-sm z-10">
                   <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <User className="w-10 h-10 text-slate-500 animate-pulse" />
                   </div>
                   <h4 className="text-white text-lg font-bold">Connecting to clinic unit...</h4>
                   <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Secure P2P Link</p>
                </div>
               )}
            </div>

            {/* Doctor's PIP (Local) - small overlay top-right */}
            <div className="absolute top-6 right-6 w-52 h-36 bg-slate-900 rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden group z-20">
               {/* local-player container */}
               <div id="doctor-local-player-view" className="w-full h-full object-cover" />
               
               {!isVideoOn && (
                 <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-slate-600" />
                 </div>
               )}
               <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[10px] text-white font-bold tracking-tighter uppercase">
                  Specialist Unit (You)
               </div>
            </div>

            {/* Encryption Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-20">
               <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
               <span className="text-[10px] text-white font-black uppercase tracking-widest">clinical Encryption Active</span>
            </div>
        </div>

        {/* Idle State / Placeholder (Shown when call not active) */}
        {!isCallActive && (
          <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center p-12 overflow-hidden z-20">
             <div className="text-center relative z-10 space-y-6 max-w-md">
                <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto relative group">
                   <div className="absolute inset-0 bg-blue-500/20 rounded-[2rem] animate-ping opacity-20"></div>
                   <Video className="w-10 h-10 text-blue-500 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-white text-2xl font-black tracking-tight">Clinic Live Console</h3>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Ready to join the clinical session for {patientName}.
                   </p>
                </div>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-black px-10 rounded-2xl h-14 shadow-xl shadow-primary/20 tracking-wide uppercase transition-all hover:scale-105"
                  onClick={startCall}
                >
                  Initiate Secure Link
                </Button>
             </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      {isCallActive && (
        <div className="bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 px-8 py-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Button
                variant={isAudioOn ? "secondary" : "destructive"}
                size="icon"
                className={`rounded-2xl w-12 h-12 transition-all ${isAudioOn ? 'bg-slate-800' : ''}`}
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5" />}
              </Button>

              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="icon"
                className={`rounded-2xl w-12 h-12 transition-all ${isVideoOn ? 'bg-slate-800' : ''}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5" />}
              </Button>
           </div>

           <Button
             variant="destructive"
             size="icon"
             className="rounded-[1.5rem] w-16 h-16 shadow-2xl shadow-rose-500/30 hover:scale-110 active:scale-95 transition-all"
             onClick={endCall}
           >
             <PhoneOff className="w-7 h-7" />
           </Button>

           <div className="flex items-center gap-4">
              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="icon"
                className={`rounded-2xl w-12 h-12 transition-all ${isScreenSharing ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-800'}`}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5 text-white" />}
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="rounded-2xl w-12 h-12 bg-slate-800"
              >
                <Settings className="w-5 h-5 text-white" />
              </Button>
           </div>
        </div>
      )}
    </div>
  );
}

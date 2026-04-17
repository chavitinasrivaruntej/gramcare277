import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  X, Save, Send, User, Clock, AlertTriangle, 
  FileText, ClipboardList, History, Info, Activity,
  Stethoscope, Pill, MessageSquare, ChevronRight, CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoCallInterface from "./VideoCallInterface";
import { useUnifiedData } from "@/hooks/useUnifiedData";

export default function ConsultationInterfaceSimple() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, completeConsultation } = useUnifiedData();
  
  // States
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("notes");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  // Load patient data from unified store
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.patientId === patientId);
  }, [patients, patientId]);

  // Timer
  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const handleComplete = () => {
    if (!diagnosis) {
      alert("Please enter a diagnosis before completing the session.");
      return;
    }
    const success = completeConsultation(patientId, diagnosis, prescription || "Routine consultation");
    if (success) {
      navigate('/consultation');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedPatient) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-400">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700">Patient Record Syncing...</h2>
          <p className="text-slate-500">Retrieving clinical context from unified server.</p>
          <Button onClick={() => navigate('/consultation')} className="rounded-xl px-8">
            Go to Selection
          </Button>
        </div>
      </div>
    );
  }

  const history = selectedPatient.visitHistory || [];

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Premium Patient Strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 clinical-shadow z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/consultation')}
                className="hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5 text-slate-400" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${
                selectedPatient.priority === 'urgent' || selectedPatient.priority === 'critical' ? 'bg-rose-600' : 'bg-primary'
              }`}>
                {selectedPatient.tokenId?.split('-')[1] || selectedPatient.tokenId}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#1E3A8A]">{selectedPatient.name}</h2>
                  <Badge className={selectedPatient.priority === 'urgent' || selectedPatient.priority === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}>
                    {selectedPatient.priority?.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>ID: {selectedPatient.patientId}</span>
                  <span>|</span>
                  <span>{selectedPatient.age}Y, {selectedPatient.gender}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1 text-blue-500">
                    <Clock className="w-3 h-3" />
                     Session: {isCallActive ? formatDuration(callDuration) : 'Idle'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-4 mr-6">
               <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Status</p>
                  <p className="text-sm font-bold text-emerald-600">Secure clinical Channel</p>
               </div>
               <div className="h-8 w-px bg-slate-200"></div>
               <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Type</p>
                  <p className="text-sm font-bold text-blue-600">{selectedPatient.appointmentType}</p>
               </div>
            </div>
            <Button variant="outline" className="rounded-xl border-blue-100 text-blue-600 font-bold hover:bg-blue-50">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleComplete} className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete clinical Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main clinical Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Left: Video Panel */}
        <div className="w-[45%] flex flex-col p-4 border-r border-slate-200">
           <VideoCallInterface 
            isCallActive={isCallActive}
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            isScreenSharing={isScreenSharing}
            callDuration={callDuration}
            patientName={selectedPatient.name}
            setIsCallActive={setIsCallActive}
            setIsVideoOn={setIsVideoOn}
            setIsAudioOn={setIsAudioOn}
            setIsScreenSharing={setIsScreenSharing}
            setCallDuration={setCallDuration}
          />
          
          {/* Quick Context Card */}
          <div className="mt-4 p-5 bg-white rounded-2xl border border-slate-200 clinical-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Case Background
              </h3>
              {selectedPatient.allergies?.length > 0 && (
                <Badge variant="destructive" className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Allergy: {selectedPatient.allergies.join(', ')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedPatient.complaint}
            </p>
            
            {/* Unified 4-Vitals Row */}
            <div className="grid grid-cols-4 gap-3">
               {[
                 { label: 'Temp', val: selectedPatient.vitals.temperature, icon: Activity },
                 { label: 'BP', val: selectedPatient.vitals.bloodPressure, icon: Activity },
                 { label: 'Pulse', val: selectedPatient.vitals.pulse, icon: Activity },
                 { label: 'SpO2', val: selectedPatient.vitals.oxygenSaturation, icon: Activity }
               ].map((v, i) => (
                 <div key={i} className="vitals-chip text-center p-3 rounded-2xl border border-blue-50 bg-blue-50/10">
                    <p className="text-[9px] uppercase font-black text-slate-400 mb-1 leading-none">{v.label}</p>
                    <p className="text-sm font-black text-blue-600 leading-none">{v.val || 'N/A'}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Workspace Right: clinical Operations (Tabs) */}
        <div className="flex-1 bg-white flex flex-col">
          <Tabs defaultValue="notes" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
            <div className="px-6 border-b border-slate-100 flex items-center justify-between bg-white pt-2">
              <TabsList className="bg-transparent h-12 gap-6">
                {[
                  { id: 'notes', label: 'Clinical Notes', icon: FileText },
                  { id: 'rx', label: 'Prescription', icon: Pill },
                  { id: 'history', label: 'Past Records', icon: History }
                ].map(tab => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    className="h-12 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-1 text-slate-400 data-[state=active]:text-primary font-bold flex gap-2"
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex gap-2">
                 <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Consult Specialists
                 </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <TabsContent value="notes" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-2">
                 <Card className="border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-white border-b border-slate-50 px-5 py-3 flex justify-between items-center">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Objective Observations</h4>
                       <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">Smart Templates</Button>
                    </div>
                    <CardContent className="p-0">
                       <textarea 
                         placeholder="Enter clinical observations, symptoms analysis..."
                         className="w-full min-h-[300px] p-5 text-slate-700 bg-white border-none focus:ring-0 placeholder:text-slate-300 resize-none font-medium leading-relaxed"
                         value={diagnosis}
                         onChange={(e) => setDiagnosis(e.target.value)}
                       />
                    </CardContent>
                 </Card>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl clinical-shadow">
                       <h5 className="text-[10px] uppercase font-black text-slate-400 mb-3">Assessment</h5>
                       <input type="text" placeholder="ICD-10 Code or Description" className="w-full border-none p-0 text-sm font-bold text-[#1E3A8A] focus:ring-0 placeholder:text-slate-300" />
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl clinical-shadow">
                       <h5 className="text-[10px] uppercase font-black text-slate-400 mb-3">Advice</h5>
                       <input type="text" placeholder="Rest, Diet, etc." className="w-full border-none p-0 text-sm font-bold text-[#1E3A8A] focus:ring-0 placeholder:text-slate-300" />
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="rx" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-2">
                 <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
                    <div>
                       <h4 className="text-xl font-black text-[#1E3A8A]">Digital Prescription</h4>
                       <p className="text-sm text-slate-500 font-medium">Standard WHO dosage guidelines applied</p>
                    </div>
                    <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20">Add Medicine</Button>
                 </div>
                 
                 <div className="space-y-3">
                    <textarea 
                      placeholder="Add medicines (e.g., Paracetamol 500mg - 1-0-1 - 3 Days)..."
                      className="w-full min-h-[150px] p-5 text-slate-700 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300 resize-none font-medium leading-relaxed shadow-sm"
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                    />
                 </div>
                 
                 <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-400 font-bold mb-4">Or use AI Assistant to suggest RX based on notes</p>
                    <Button variant="outline" className="rounded-xl border-blue-100 text-blue-600">Analyze Symptoms for RX</Button>
                 </div>
              </TabsContent>

              <TabsContent value="history" className="m-0 space-y-4 animate-in fade-in slide-in-from-right-2">
                 <h4 className="text-sm font-black text-[#1E3A8A] uppercase tracking-wider mb-2">Past Consultations</h4>
                 {history.length > 0 ? history.map((c, i) => (
                    <Card key={i} className="border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                       <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                             <div>
                                <p className="text-xs uppercase font-black text-blue-500">{c.date}</p>
                                <h5 className="font-bold text-slate-800">{c.diagnosis}</h5>
                             </div>
                             <Badge variant="outline" className="text-[10px]">{c.doctor}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                             Prescribed: {c.prescription}
                          </p>
                       </CardContent>
                    </Card>
                 )) : (
                    <div className="text-center py-20 text-slate-400">
                       <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
                       <p className="font-bold">No previous records found for this patient</p>
                    </div>
                 )}
                 
                 <div className="pt-4 flex justify-center">
                    <Button variant="ghost" className="text-blue-600 font-black text-xs uppercase" onClick={() => navigate('/patient-history')}>
                       View Comprehensive Medical Folder
                       <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                 </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

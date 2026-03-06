import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Save, Send, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoCallInterface from "./VideoCallInterface";
import { todayConsultations } from "@/mockDataDoctor";

export default function ConsultationInterfaceSimple() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Patient state
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load patient data
  useEffect(() => {
    if (patientId) {
      const patient = todayConsultations.find(p => p.patientId === patientId);
      if (patient) {
        setSelectedPatient(patient);
      }
    } else {
      const firstWaiting = todayConsultations.find(p => p.status === 'waiting');
      if (firstWaiting) {
        setSelectedPatient(firstWaiting);
      }
    }
  }, [patientId]);

  // Call duration timer
  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveConsultation = () => {
    alert('Consultation saved successfully!');
    navigate('/queue');
  };

  if (!selectedPatient) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Patient Selected</h3>
            <p className="text-muted-foreground mb-6">Please select a patient from the queue to start consultation</p>
            <Button onClick={() => navigate('/queue')}>
              Go to Patient Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/queue')}
            >
              <X className="w-4 h-4 mr-2" />
              Back to Queue
            </Button>
            <div className="h-8 w-px bg-border"></div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedPatient.patientName}</h2>
              <p className="text-sm text-muted-foreground">
                ID: {selectedPatient.patientId} • {selectedPatient.age}Y, {selectedPatient.gender}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isCallActive && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  Call Duration: {formatDuration(callDuration)}
                </span>
              </div>
            )}
            <Button variant="outline" onClick={handleSaveConsultation}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleSaveConsultation}>
              <Send className="w-4 h-4 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Call Component */}
        <VideoCallInterface 
          isCallActive={isCallActive}
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          isScreenSharing={isScreenSharing}
          callDuration={callDuration}
          patientName={selectedPatient.patientName}
          setIsCallActive={setIsCallActive}
          setIsVideoOn={setIsVideoOn}
          setIsAudioOn={setIsAudioOn}
          setIsScreenSharing={setIsScreenSharing}
          setCallDuration={setCallDuration}
        />

        {/* Patient Details - Right Side */}
        <div className="w-1/2 overflow-y-auto p-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Patient Information</h3>
              
              {/* Chief Complaint */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Chief Complaint</h4>
                <p className="text-foreground">{selectedPatient.complaint}</p>
              </div>

              {/* Current Vitals */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Current Vitals</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                    <p className="text-lg font-bold">{selectedPatient.vitals.temperature}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                    <p className="text-lg font-bold">{selectedPatient.vitals.bloodPressure}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Pulse Rate</p>
                    <p className="text-lg font-bold">{selectedPatient.vitals.pulse}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">SpO2</p>
                    <p className="text-lg font-bold">{selectedPatient.vitals.oxygenSaturation}</p>
                  </div>
                </div>
              </div>

              {/* Patient History */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Patient History</h4>
                <p className="text-sm text-foreground">Previous Visits: {selectedPatient.previousVisits}</p>
                {selectedPatient.lastVisit && (
                  <p className="text-sm text-foreground">Last Visit: {selectedPatient.lastVisit}</p>
                )}
              </div>

              {/* Placeholder for full consultation interface */}
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-900 dark:text-green-100">
                  Full consultation interface with prescription writing, medical history, and detailed forms coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

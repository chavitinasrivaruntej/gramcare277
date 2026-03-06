import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MonitorOff,
  Maximize2, Volume2, VolumeX, Camera, Settings, X,
  User, Activity, FileText, Pill, AlertCircle, Clock,
  ChevronDown, ChevronUp, Plus, Trash2, Save, Send
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  todayConsultations, 
  patientMedicalHistory, 
  commonMedicines,
  prescriptionTemplates 
} from "@/mockDataDoctor";

export default function ConsultationInterface() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Patient and consultation states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("vitals");
  const [expandedSections, setExpandedSections] = useState({
    vitals: true,
    history: false,
    prescription: true
  });

  // Consultation form states
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [followUpDate, setFollowUpDate] = useState("");
  const [adviceInstructions, setAdviceInstructions] = useState("");

  // Medicine search
  const [medicineSearch, setMedicineSearch] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  // Load patient data
  useEffect(() => {
    if (patientId) {
      const patient = todayConsultations.find(p => p.patientId === patientId);
      if (patient) {
        setSelectedPatient(patient);
        setChiefComplaint(patient.complaint);
      }
    } else {
      // If no patient selected, pick the first waiting patient
      const firstWaiting = todayConsultations.find(p => p.status === 'waiting');
      if (firstWaiting) {
        setSelectedPatient(firstWaiting);
        setChiefComplaint(firstWaiting.complaint);
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

  // Medicine search filter
  useEffect(() => {
    if (medicineSearch) {
      const filtered = commonMedicines.filter(med => 
        med.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
        med.category.toLowerCase().includes(medicineSearch.toLowerCase())
      );
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines([]);
    }
  }, [medicineSearch]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addMedicine = (medicine) => {
    setPrescriptionMedicines([...prescriptionMedicines, {
      id: Date.now(),
      name: medicine.name,
      dosage: '1-0-1',
      duration: '5 days',
      instructions: 'After meals',
      timing: 'Morning-Afternoon-Night'
    }]);
    setMedicineSearch("");
  };

  const removeMedicine = (id) => {
    setPrescriptionMedicines(prescriptionMedicines.filter(med => med.id !== id));
  };

  const updateMedicine = (id, field, value) => {
    setPrescriptionMedicines(prescriptionMedicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const applyTemplate = (templateId) => {
    const template = prescriptionTemplates.find(t => t.id === templateId);
    if (template) {
      const medicines = template.medicines.map((med, index) => ({
        id: Date.now() + index,
        ...med,
        timing: med.dosage
      }));
      setPrescriptionMedicines([...prescriptionMedicines, ...medicines]);
    }
  };

  const handleSaveConsultation = () => {
    console.log('Saving consultation...', {
      patient: selectedPatient,
      chiefComplaint,
      diagnosis,
      notes,
      prescriptionMedicines,
      labTests,
      followUpDate,
      adviceInstructions
    });
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

  const patientHistory = patientMedicalHistory[selectedPatient.patientId] || {};

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with Patient Info */}
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
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-foreground">{selectedPatient.patientName}</h2>
                <Badge>{selectedPatient.tokenNumber}</Badge>
                {(selectedPatient.priority === 'high' || selectedPatient.priority === 'critical') && (
                  <Badge variant="destructive">Priority</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span>ID: {selectedPatient.patientId}</span>
                <span>•</span>
                <span>{selectedPatient.age}Y, {selectedPatient.gender}</span>
                <span>•</span>
                <span>Check-in: {selectedPatient.checkInTime}</span>
              </div>
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
              Complete Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Video Call */}
        <div className="w-1/2 border-r border-border flex flex-col bg-slate-900">
          {/* Video Area */}
          <div className="flex-1 relative bg-slate-800">
            {/* Main Video (Patient) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isCallActive ? (
                <div className="relative w-full h-full">
                  {/* Simulated Video Feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    {isVideoOn ? (
                      <div className="text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                          <User className="w-16 h-16 text-white" />
                        </div>
                        <p className="text-white text-lg font-medium">{selectedPatient.patientName}</p>
                        <p className="text-slate-300 text-sm">Patient Video</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <VideoOff className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Video Off</p>
                      </div>
                    )}
                  </div>

                  {/* Doctor's Video (Picture-in-Picture) */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-700 rounded-lg border-2 border-white shadow-xl">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-xs">You</p>
                      </div>
                    </div>
                  </div>

                  {/* Call Info Overlay */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-white text-sm font-medium">
                      🔴 Live Consultation
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-2">Call not started</p>
                  <p className="text-slate-500 text-sm mb-6">Click "Start Call" to begin video consultation</p>
                  <Button 
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsCallActive(true)}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Start Video Call
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Video Controls */}
          {isCallActive && (
            <div className="bg-slate-900 border-t border-slate-700 p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isAudioOn ? "secondary" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>

                <Button
                  variant={isVideoOn ? "secondary" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={() => {
                    setIsCallActive(false);
                    setCallDuration(0);
                  }}
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>

                <Button
                  variant={isScreenSharing ? "default" : "secondary"}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full w-14 h-14"
                >
                  <Settings className="w-6 h-6" />
                </Button>
              </div>

              {isScreenSharing && (
                <div className="mt-3 text-center">
                  <Badge className="bg-green-600">
                    <Monitor className="w-3 h-3 mr-1" />
                    Screen Sharing Active
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Patient Details & Consultation Form */}
        <div className="w-1/2 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Chief Complaint */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Chief Complaint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Patient's main complaint..."
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vitals">Vitals & History</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnosis & Notes</TabsTrigger>
                <TabsTrigger value="prescription">Prescription</TabsTrigger>
              </TabsList>

              {/* Vitals & History Tab */}
              <TabsContent value="vitals" className="space-y-4">
                {/* Current Vitals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Vitals</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Weight</p>
                        <p className="text-lg font-bold">{selectedPatient.vitals.weight}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical History */}
                {patientHistory.allergies && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Medical History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {patientHistory.allergies && patientHistory.allergies.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-red-600 mb-1">⚠️ Allergies</p>
                          <p className="text-sm">{patientHistory.allergies.join(', ')}</p>
                        </div>
                      )}
                      {patientHistory.chronicConditions && patientHistory.chronicConditions.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Chronic Conditions</p>
                          <p className="text-sm">{patientHistory.chronicConditions.join(', ')}</p>
                        </div>
                      )}
                      {patientHistory.currentMedications && patientHistory.currentMedications.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Current Medications</p>
                          <p className="text-sm">{patientHistory.currentMedications.join(', ')}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Blood Group</p>
                          <p className="text-sm font-medium">{patientHistory.bloodGroup || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Smoking</p>
                          <p className="text-sm font-medium">{patientHistory.smokingStatus || 'N/A'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Previous Consultations */}
                {patientHistory.consultationHistory && patientHistory.consultationHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Previous Consultations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patientHistory.consultationHistory.map((consultation, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold">{consultation.date}</p>
                              <Badge variant="outline">{consultation.doctor}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              <span className="font-semibold">Diagnosis:</span> {consultation.diagnosis}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {consultation.prescription}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Diagnosis & Notes Tab */}
              <TabsContent value="diagnosis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diagnosis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Enter diagnosis..."
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Detailed consultation notes, observations, examination findings..."
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Advice & Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={adviceInstructions}
                      onChange={(e) => setAdviceInstructions(e.target.value)}
                      placeholder="Lifestyle advice, dietary restrictions, precautions..."
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prescription Tab */}
              <TabsContent value="prescription" className="space-y-4">
                {/* Prescription Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {prescriptionTemplates.map(template => (
                        <Button 
                          key={template.id}
                          variant="outline" 
                          size="sm"
                          onClick={() => applyTemplate(template.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {template.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Add Medicine */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Medicine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Input 
                        value={medicineSearch}
                        onChange={(e) => setMedicineSearch(e.target.value)}
                        placeholder="Search medicine by name or category..."
                      />
                      {filteredMedicines.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredMedicines.map(med => (
                            <div 
                              key={med.id}
                              className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                              onClick={() => addMedicine(med)}
                            >
                              <p className="font-medium text-sm">{med.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">{med.category}</p>
                                <Badge variant="outline" className="text-xs">
                                  Stock: {med.stock}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Prescription List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Prescription ({prescriptionMedicines.length} medicines)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {prescriptionMedicines.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No medicines added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {prescriptionMedicines.map((med, index) => (
                          <div key={med.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-foreground mb-1">
                                  {index + 1}. {med.name}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeMedicine(med.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Dosage</Label>
                                <Input 
                                  value={med.dosage}
                                  onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                                  placeholder="1-0-1"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Duration</Label>
                                <Input 
                                  value={med.duration}
                                  onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)}
                                  placeholder="5 days"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs">Instructions</Label>
                              <Input 
                                value={med.instructions}
                                onChange={(e) => updateMedicine(med.id, 'instructions', e.target.value)}
                                placeholder="After meals, Before sleep, etc."
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Follow-up */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label>Follow-up Date</Label>
                        <Input 
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

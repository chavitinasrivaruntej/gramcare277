import { useState } from "react";
import { 
  Search, User, Activity, FileText, Calendar, 
  AlertCircle, Pill, TrendingUp, ChevronDown, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { patientMedicalHistory, todayConsultations } from "@/mockDataDoctor";

export default function PatientHistoryDoctor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Get all patients with history
  const patientsWithHistory = todayConsultations.filter(
    p => patientMedicalHistory[p.patientId]
  );

  const filteredPatients = patientsWithHistory.filter(patient =>
    (patient?.patientName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (patient?.patientId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1E3A8A] dark:text-blue-400 mb-1" style={{fontFamily: 'Manrope'}}>
          Patient Medical Records
        </h1>
        <p className="text-sm font-medium text-blue-600/70 dark:text-blue-300/70">
          View complete medical history and consultation records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Select a patient to view history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.patientId}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPatient?.patientId === patient.patientId
                        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                        : 'hover:border-primary/50 hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {patient.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground mb-1">
                          {patient.patientName}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          ID: {patient.patientId}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{patient.age}Y</span>
                          <span>•</span>
                          <span>{patient.gender}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-extrabold text-[#1E3A8A] dark:text-blue-400 mb-2">
                        {selectedPatient.patientName}
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Patient ID</p>
                          <p className="font-medium">{selectedPatient.patientId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p className="font-medium">{selectedPatient.age} Years</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gender</p>
                          <p className="font-medium">{selectedPatient.gender}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Blood Group</p>
                          <p className="font-medium">
                            {patientMedicalHistory[selectedPatient.patientId]?.bloodGroup || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Overview */}
              {patientMedicalHistory[selectedPatient.patientId] && (
                <>
                  {/* Allergies & Warnings */}
                  {patientMedicalHistory[selectedPatient.patientId].allergies?.length > 0 && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-rose-600">
                          <AlertCircle className="w-5 h-5" />
                          Allergies & Important Warnings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {patientMedicalHistory[selectedPatient.patientId].allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="text-sm">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Chronic Conditions */}
                  {patientMedicalHistory[selectedPatient.patientId].chronicConditions?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5 text-amber-600" />
                          Chronic Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {patientMedicalHistory[selectedPatient.patientId].chronicConditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-sm bg-amber-50 text-amber-700 border-amber-200 font-medium">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Current Medications */}
                  {patientMedicalHistory[selectedPatient.patientId].currentMedications?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Pill className="w-5 h-5 text-blue-600" />
                          Current Medications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {patientMedicalHistory[selectedPatient.patientId].currentMedications.map((medication, index) => (
                            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm">
                              <p className="font-semibold text-sm text-[#1E3A8A] dark:text-blue-300">{medication}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Medical Background */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Medical Background</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Smoking Status</p>
                          <p className="font-medium">
                            {patientMedicalHistory[selectedPatient.patientId].smokingStatus || 'N/A'}
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Alcohol Consumption</p>
                          <p className="font-medium">
                            {patientMedicalHistory[selectedPatient.patientId].alcoholStatus || 'N/A'}
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Family History</p>
                          <p className="font-medium">
                            {patientMedicalHistory[selectedPatient.patientId].familyHistory || 'None reported'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Past Surgeries */}
                  {patientMedicalHistory[selectedPatient.patientId].pastSurgeries?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Past Surgeries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {patientMedicalHistory[selectedPatient.patientId].pastSurgeries.map((surgery, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <p className="font-medium text-sm">{surgery}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Consultation History */}
                  {patientMedicalHistory[selectedPatient.patientId].consultationHistory?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          Consultation History ({patientMedicalHistory[selectedPatient.patientId].consultationHistory.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {patientMedicalHistory[selectedPatient.patientId].consultationHistory.map((consultation, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <p className="font-semibold text-foreground">{consultation.date}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{consultation.doctor}</p>
                                </div>
                                <Badge variant="outline">Visit {patientMedicalHistory[selectedPatient.patientId].consultationHistory.length - index}</Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">Diagnosis</p>
                                  <p className="text-sm">{consultation.diagnosis}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">Prescription</p>
                                  <p className="text-sm text-muted-foreground">{consultation.prescription}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Patient Selected</h3>
                <p className="text-muted-foreground">
                  Select a patient from the list to view their medical history
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

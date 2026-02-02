import { useState } from 'react';
import { Search, FileText, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { medicalHistory } from '../mockData';

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredHistory = medicalHistory.filter(record =>
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
          Medical History
        </h1>
        <p className="text-muted-foreground">View and manage patient medical records</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name or diagnosis..."
            className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="search-medical-history"
          />
        </div>
      </div>

      {/* Medical Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHistory.map((record, index) => (
          <div
            key={record.id}
            data-testid={`medical-record-${index}`}
            className="bg-card rounded-xl border border-border shadow-sm p-6 card-hover animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Patient Info Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground" style={{fontFamily: 'Manrope'}}>
                    {record.patientName}
                  </h3>
                  <p className="text-sm text-muted-foreground">ID: {record.patientId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{record.date}</span>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Diagnosis</h4>
              </div>
              <p className="text-foreground bg-accent/50 rounded-lg p-3">
                {record.diagnosis}
              </p>
            </div>

            {/* Treatment */}
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">Treatment Prescribed</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {record.treatment}
              </p>
            </div>

            {/* Notes */}
            {record.notes && (
              <div className="mb-4">
                <h4 className="font-semibold text-foreground mb-2">Clinical Notes</h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{record.notes}"
                </p>
              </div>
            )}

            {/* Next Visit */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Next Visit: <span className="font-medium text-foreground">{record.nextVisit}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button 
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                data-testid={`view-details-btn-${index}`}
              >
                View Full History
              </button>
              <button 
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                data-testid={`print-record-btn-${index}`}
              >
                Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2" style={{fontFamily: 'Manrope'}}>
            No Records Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-bold text-foreground mb-4" style={{fontFamily: 'Manrope'}}>
          Records Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Records</p>
            <p className="text-2xl font-bold text-foreground">{medicalHistory.length}</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Unique Patients</p>
            <p className="text-2xl font-bold text-foreground">
              {new Set(medicalHistory.map(r => r.patientId)).size}
            </p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Upcoming Follow-ups</p>
            <p className="text-2xl font-bold text-foreground">
              {medicalHistory.filter(r => new Date(r.nextVisit) > new Date()).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

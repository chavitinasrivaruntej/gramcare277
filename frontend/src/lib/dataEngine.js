
const STORAGE_KEY = 'gramcare_unified_clinical_data';

// Initial data merged from mock sources
const initialData = [
  {
    patientId: 'P006',
    tokenId: 'T-106',
    name: 'Lakshmi Bai',
    age: 71,
    gender: 'Female',
    phone: '9876543215',
    village: 'Vansda',
    bloodGroup: 'O+',
    complaint: 'Chest pain and breathlessness',
    doctorAssigned: 'Dr. Amit Verma',
    appointmentType: 'Virtual',
    status: 'urgent',
    priority: 'critical',
    appointmentTime: '2026-04-17T23:15:00.000Z',
    checkInTime: '09:45 AM',
    vitals: {
      temperature: '98.8°F',
      bloodPressure: '170/100',
      pulse: '84 bpm',
      oxygenSaturation: '96%',
      weight: '58 kg',
      height: '152 cm'
    },
    visitHistory: [],
    allergies: ['Dust'],
    chronicConditions: ['Heart disease', 'Hypertension'],
    consultationStatus: null, // requested, doctor_ready, live, completed
    notes: ''
  },
  {
    patientId: 'P001',
    tokenId: 'T-101',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    village: 'Dharampur',
    bloodGroup: 'B+',
    complaint: 'Fever and body ache for 3 days',
    doctorAssigned: 'Dr. Amit Verma',
    appointmentType: 'Emergency',
    status: 'urgent',
    priority: 'critical',
    appointmentTime: '2026-04-17T22:45:00.000Z',
    checkInTime: '08:30 AM',
    vitals: {
      temperature: '101.2°F',
      bloodPressure: '130/85',
      pulse: '88 bpm',
      oxygenSaturation: '97%',
      weight: '72 kg',
      height: '170 cm'
    },
    visitHistory: [
      { date: '2026-01-15', doctor: 'Dr. Priya Singh', diagnosis: 'Viral fever', prescription: 'Paracetamol 500mg, Cetirizine 10mg' }
    ],
    allergies: ['Penicillin'],
    chronicConditions: [],
    notes: ''
  },
  {
    patientId: 'P002',
    tokenId: 'T-102',
    name: 'Sunita Devi',
    age: 62,
    gender: 'Female',
    phone: '9876543211',
    village: 'Vansda',
    bloodGroup: 'O+',
    complaint: 'Seasonal allergies and mild cough',
    doctorAssigned: 'Dr. Amit Verma',
    appointmentType: 'Follow-up',
    status: 'waiting',
    priority: 'high',
    appointmentTime: '2026-04-17T22:55:00.000Z',
    checkInTime: '08:45 AM',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '160/95',
      pulse: '92 bpm',
      oxygenSaturation: '94%',
      weight: '65 kg',
      height: '155 cm'
    },
    visitHistory: [
      { date: '2026-02-18', doctor: 'Dr. Amit Verma', diagnosis: 'Hypertension - controlled', prescription: 'Amlodipine 5mg, Atenolol 25mg' }
    ],
    allergies: [],
    chronicConditions: ['Hypertension', 'Osteoarthritis'],
    notes: ''
  },
  {
    patientId: 'P005',
    tokenId: 'T-105',
    name: 'Vikram Patel',
    age: 58,
    gender: 'Male',
    phone: '9876543214',
    village: 'Dharampur',
    bloodGroup: 'B-',
    complaint: 'Diabetes follow-up, blood sugar management',
    doctorAssigned: 'Dr. Amit Verma',
    appointmentType: 'Scheduled',
    status: 'in_progress',
    priority: 'normal',
    appointmentTime: '2026-04-17T22:40:00.000Z',
    checkInTime: '09:30 AM',
    vitals: {
      temperature: '98.4°F',
      bloodPressure: '135/88',
      pulse: '76 bpm',
      oxygenSaturation: '98%',
      weight: '78 kg',
      height: '172 cm'
    },
    visitHistory: [
      { date: '2026-01-30', doctor: 'Dr. Amit Verma', diagnosis: 'Type 2 Diabetes - Follow-up', prescription: 'Metformin 500mg, Glimepiride 1mg' }
    ],
    allergies: [],
    chronicConditions: ['Type 2 Diabetes', 'Mild Hypertension'],
    notes: ''
  },
  {
    patientId: 'P008',
    tokenId: 'T-108',
    name: 'Priya Reddy',
    age: 29,
    gender: 'Female',
    phone: '9876543217',
    village: 'Subir',
    bloodGroup: 'B+',
    complaint: 'Severe headache',
    doctorAssigned: 'Dr. Amit Verma',
    appointmentType: 'Scheduled',
    status: 'scheduled',
    priority: 'normal',
    appointmentTime: '2026-04-17T23:30:00.000Z',
    checkInTime: '10:15 AM',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '118/76',
      pulse: '68 bpm',
      oxygenSaturation: '99%',
      weight: '60 kg',
      height: '165 cm'
    },
    visitHistory: [],
    allergies: [],
    chronicConditions: [],
    notes: ''
  }
];

export const dataEngine = {
  getPatients: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Demo sync: ensure Lakshmi Bai (P006) is always urgent for this demo case
        const p006 = parsed.find(p => p.patientId === 'P006');
        if (p006) {
           const isActive = p006.status === 'in_progress' || p006.status === 'in-progress' || p006.status === 'urgent';
           const isUpcoming = p006.status === 'scheduled' || p006.status === 'waiting';
           p006.status = 'urgent';
           p006.priority = 'critical';
           p006.complaint = 'Chest pain and breathlessness';
           localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error('DataEngine: Parse error', e);
        return initialData;
      }
    }
    // Initialize if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  },

  savePatients: (patients) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    // Dispatch event for cross-tab sync
    window.dispatchEvent(new Event('storage'));
  },

  updatePatientStatus: (id, status, extraData = {}) => {
    const patients = dataEngine.getPatients();
    const index = patients.findIndex(p => p.patientId === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], status, ...extraData };
      dataEngine.savePatients(patients);
      return true;
    }
    return false;
  },

  completeConsultation: (id, diagnosis, prescription) => {
    const patients = dataEngine.getPatients();
    const index = patients.findIndex(p => p.patientId === id);
    if (index !== -1) {
      const historyItem = {
        date: new Date().toISOString().split('T')[0],
        doctor: 'Dr. Amit Verma',
        diagnosis,
        prescription
      };
      
      patients[index] = {
        ...patients[index],
        status: 'completed',
        visitHistory: [historyItem, ...(patients[index].visitHistory || [])],
        lastVisit: historyItem.date
      };
      
      dataEngine.savePatients(patients);
      return true;
    }
    return false;
  },

  registerPatient: (patientData) => {
    const patients = dataEngine.getPatients();
    const newPatient = {
      ...patientData,
      patientId: `P${String(patients.length + 1).padStart(3, '0')}`,
      tokenId: `T-${String(patients.length + 100).padStart(3, '0')}`,
      status: 'waiting',
      visitHistory: [],
      notes: ''
    };
    patients.push(newPatient);
    dataEngine.savePatients(patients);
    return newPatient;
  }
};

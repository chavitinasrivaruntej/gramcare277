// Mock data for Doctor Portal

export const doctorProfile = {
  id: 'D001',
  name: 'Dr. Amit Verma',
  specialization: 'General Medicine',
  experience: '12 years',
  qualification: 'MBBS, MD',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ6MzR8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkb2N0b3IlMjBtYWxlfGVufDB8fHx8MTc3MDA0MDIyNHww&ixlib=rb-4.1.0&q=85',
  phone: '+91 98765 43210',
  email: 'dr.amit@gramcare.in',
  registrationNo: 'MCI-12345',
  languages: ['Hindi', 'English', 'Gujarati']
};

export const todayConsultations = [
  {
    id: 'C001',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    tokenNumber: 'T-101',
    status: 'waiting',
    checkInTime: '08:30 AM',
    scheduledTime: '09:00 AM',
    appointmentType: 'Emergency',
    priority: 'critical',
    complaint: 'Fever and body ache for 3 days',
    vitals: {
      temperature: '101.2°F',
      bloodPressure: '130/85',
      pulse: '88 bpm',
      oxygenSaturation: '97%',
      weight: '72 kg'
    },
    previousVisits: 2,
    lastVisit: '2026-01-15',
    allergies: ['Penicillin']
  },
  {
    id: 'C002',
    patientId: 'P002',
    patientName: 'Sunita Devi',
    age: 62,
    gender: 'Female',
    tokenNumber: 'T-102',
    status: 'waiting',
    checkInTime: '08:45 AM',
    scheduledTime: '09:15 AM',
    appointmentType: 'Follow-up',
    priority: 'high',
    complaint: 'Chest pain and breathlessness',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '160/95',
      pulse: '92 bpm',
      oxygenSaturation: '94%',
      weight: '65 kg'
    },
    previousVisits: 8,
    lastVisit: '2026-02-18',
    allergies: []
  },
  {
    id: 'C003',
    patientId: 'P005',
    patientName: 'Vikram Patel',
    age: 58,
    gender: 'Male',
    tokenNumber: 'T-105',
    status: 'in-progress',
    checkInTime: '09:30 AM',
    scheduledTime: '10:00 AM',
    appointmentType: 'Scheduled',
    priority: 'normal',
    complaint: 'Diabetes follow-up, blood sugar management',
    vitals: {
      temperature: '98.4°F',
      bloodPressure: '135/88',
      pulse: '76 bpm',
      oxygenSaturation: '98%',
      weight: '78 kg'
    },
    previousVisits: 15,
    lastVisit: '2026-01-30',
    allergies: []
  },
  {
    id: 'C004',
    patientId: 'P006',
    patientName: 'Lakshmi Bai',
    age: 71,
    gender: 'Female',
    tokenNumber: 'T-106',
    status: 'waiting',
    checkInTime: '09:45 AM',
    scheduledTime: '10:15 AM',
    appointmentType: 'Virtual',
    priority: 'high',
    complaint: 'High blood pressure, dizziness',
    vitals: {
      temperature: '98.8°F',
      bloodPressure: '170/100',
      pulse: '84 bpm',
      oxygenSaturation: '96%',
      weight: '58 kg'
    },
    previousVisits: 12,
    lastVisit: '2026-02-10',
    allergies: ['Dust']
  },
  {
    id: 'C005',
    patientId: 'P004',
    patientName: 'Meera Sharma',
    age: 34,
    gender: 'Female',
    tokenNumber: 'T-104',
    status: 'waiting',
    checkInTime: '09:15 AM',
    scheduledTime: '10:30 AM',
    appointmentType: 'Scheduled',
    priority: 'normal',
    complaint: 'Pregnancy checkup - 24 weeks',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '120/78',
      pulse: '80 bpm',
      oxygenSaturation: '99%',
      weight: '62 kg'
    },
    previousVisits: 5,
    lastVisit: '2026-01-25',
    allergies: []
  },
  {
    id: 'C006',
    patientId: 'P007',
    patientName: 'Ramesh Yadav',
    age: 42,
    gender: 'Male',
    tokenNumber: 'T-107',
    status: 'waiting',
    checkInTime: '10:00 AM',
    scheduledTime: '11:00 AM',
    appointmentType: 'New Patient',
    priority: 'normal',
    complaint: 'Skin rash on arms and legs',
    vitals: {
      temperature: '98.4°F',
      bloodPressure: '125/82',
      pulse: '74 bpm',
      oxygenSaturation: '98%',
      weight: '70 kg'
    },
    previousVisits: 1,
    lastVisit: '2025-12-20',
    allergies: ['Latex']
  },
  {
    id: 'C007',
    patientId: 'P003',
    patientName: 'Arjun Singh',
    age: 28,
    gender: 'Male',
    tokenNumber: 'T-103',
    status: 'completed',
    checkInTime: '09:00 AM',
    scheduledTime: '09:30 AM',
    appointmentType: 'Follow-up',
    completedTime: '09:25 AM',
    priority: 'normal',
    complaint: 'Minor cut, dressing required',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '118/76',
      pulse: '72 bpm',
      oxygenSaturation: '99%',
      weight: '68 kg'
    },
    previousVisits: 0,
    lastVisit: null,
    allergies: []
  }
];

export const prescriptionTemplates = [
  {
    id: 'PT001',
    name: 'Common Cold & Fever',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '1-0-1', duration: '3 days', instructions: 'After meals' },
      { name: 'Cetirizine 10mg', dosage: '0-0-1', duration: '5 days', instructions: 'Before sleep' }
    ]
  },
  {
    id: 'PT002',
    name: 'Hypertension Management',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1-0-0', duration: '30 days', instructions: 'Morning, after breakfast' },
      { name: 'Atenolol 25mg', dosage: '0-0-1', duration: '30 days', instructions: 'After dinner' }
    ]
  },
  {
    id: 'PT003',
    name: 'Diabetes Type 2',
    medicines: [
      { name: 'Metformin 500mg', dosage: '1-0-1', duration: '30 days', instructions: 'After meals' },
      { name: 'Glimepiride 1mg', dosage: '1-0-0', duration: '30 days', instructions: 'Before breakfast' }
    ]
  }
];

export const commonMedicines = [
  { id: 'M001', name: 'Paracetamol 500mg', category: 'Antipyretic', stock: 500 },
  { id: 'M002', name: 'Paracetamol 650mg', category: 'Antipyretic', stock: 300 },
  { id: 'M003', name: 'Ibuprofen 400mg', category: 'NSAID', stock: 200 },
  { id: 'M004', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 150 },
  { id: 'M005', name: 'Azithromycin 500mg', category: 'Antibiotic', stock: 100 },
  { id: 'M006', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 400 },
  { id: 'M007', name: 'Amlodipine 5mg', category: 'Antihypertensive', stock: 250 },
  { id: 'M008', name: 'Atenolol 25mg', category: 'Antihypertensive', stock: 200 },
  { id: 'M009', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 300 },
  { id: 'M010', name: 'Glimepiride 1mg', category: 'Antidiabetic', stock: 180 },
  { id: 'M011', name: 'Omeprazole 20mg', category: 'Antacid', stock: 220 },
  { id: 'M012', name: 'Vitamin B-Complex', category: 'Supplement', stock: 350 },
  { id: 'M013', name: 'Calcium + Vitamin D3', category: 'Supplement', stock: 280 },
  { id: 'M014', name: 'Cough Syrup (Salbutamol)', category: 'Respiratory', stock: 120 },
  { id: 'M015', name: 'Aspirin 75mg', category: 'Antiplatelet', stock: 400 }
];

export const doctorStats = {
  todayPatients: 12,
  completed: 3,
  inQueue: 6,
  criticalCases: 2,
  avgConsultationTime: '15 min',
  totalConsultationsMonth: 248
};

export const upcomingAppointments = [
  {
    id: 'A001',
    patientName: 'Kavita Sharma',
    time: '11:00 AM',
    type: 'Follow-up',
    condition: 'Hypertension'
  },
  {
    id: 'A002',
    patientName: 'Suresh Patel',
    time: '11:30 AM',
    type: 'New Patient',
    condition: 'General Checkup'
  },
  {
    id: 'A003',
    patientName: 'Anita Desai',
    time: '12:00 PM',
    type: 'Follow-up',
    condition: 'Diabetes'
  }
];

export const recentPrescriptions = [
  {
    id: 'RX001',
    patientName: 'Arjun Singh',
    date: '2026-02-25',
    time: '09:25 AM',
    medicines: 2,
    diagnosis: 'Minor laceration'
  },
  {
    id: 'RX002',
    patientName: 'Priya Verma',
    date: '2026-02-24',
    time: '04:15 PM',
    medicines: 3,
    diagnosis: 'Upper respiratory infection'
  },
  {
    id: 'RX003',
    patientName: 'Mohan Kumar',
    date: '2026-02-24',
    time: '03:45 PM',
    medicines: 4,
    diagnosis: 'Type 2 Diabetes - Follow-up'
  }
];

// Patient medical history for consultation view
export const patientMedicalHistory = {
  'P001': {
    allergies: ['Penicillin'],
    chronicConditions: [],
    pastSurgeries: [],
    currentMedications: [],
    familyHistory: 'Father - Diabetes',
    smokingStatus: 'Non-smoker',
    alcoholStatus: 'Occasional',
    bloodGroup: 'B+',
    consultationHistory: [
      {
        date: '2026-01-15',
        doctor: 'Dr. Priya Singh',
        diagnosis: 'Viral fever',
        prescription: 'Paracetamol 500mg, Cetirizine 10mg'
      },
      {
        date: '2025-11-20',
        doctor: 'Dr. Amit Verma',
        diagnosis: 'Seasonal allergies',
        prescription: 'Cetirizine 10mg'
      }
    ]
  },
  'P002': {
    allergies: [],
    chronicConditions: ['Hypertension', 'Osteoarthritis'],
    pastSurgeries: ['Cataract surgery (2020)'],
    currentMedications: ['Amlodipine 5mg', 'Calcium supplements'],
    familyHistory: 'Mother - Hypertension, Sister - Heart disease',
    smokingStatus: 'Non-smoker',
    alcoholStatus: 'Never',
    bloodGroup: 'O+',
    consultationHistory: [
      {
        date: '2026-02-18',
        doctor: 'Dr. Amit Verma',
        diagnosis: 'Hypertension - controlled',
        prescription: 'Amlodipine 5mg, Atenolol 25mg'
      },
      {
        date: '2026-01-20',
        doctor: 'Dr. Amit Verma',
        diagnosis: 'Joint pain',
        prescription: 'Ibuprofen 400mg, Calcium + Vit D3'
      }
    ]
  },
  'P005': {
    allergies: [],
    chronicConditions: ['Type 2 Diabetes', 'Mild Hypertension'],
    pastSurgeries: [],
    currentMedications: ['Metformin 500mg', 'Glimepiride 1mg', 'Amlodipine 5mg'],
    familyHistory: 'Father - Diabetes, Mother - Hypertension',
    smokingStatus: 'Ex-smoker (quit 5 years ago)',
    alcoholStatus: 'Never',
    bloodGroup: 'A+',
    consultationHistory: [
      {
        date: '2026-01-30',
        doctor: 'Dr. Amit Verma',
        diagnosis: 'Type 2 Diabetes - Follow-up',
        prescription: 'Metformin 500mg, Glimepiride 1mg'
      },
      {
        date: '2026-01-15',
        doctor: 'Dr. Amit Verma',
        diagnosis: 'Diabetes management',
        prescription: 'Metformin 500mg, Glimepiride 1mg, diet counseling'
      }
    ]
  }
};

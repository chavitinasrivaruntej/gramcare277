// High-quality mock data for GramCare Dashboard

export const patientQueue = [
  {
    id: 'P001',
    name: 'Rajesh Kumar',
    age: 45,
    tokenNumber: 'T-101',
    status: 'waiting',
    checkInTime: '08:30 AM',
    priority: 'normal',
    complaint: 'Fever and body ache'
  },
  {
    id: 'P002',
    name: 'Sunita Devi',
    age: 62,
    tokenNumber: 'T-102',
    status: 'critical',
    checkInTime: '08:45 AM',
    priority: 'high',
    complaint: 'Chest pain and breathlessness'
  },
  {
    id: 'P003',
    name: 'Arjun Singh',
    age: 28,
    tokenNumber: 'T-103',
    status: 'completed',
    checkInTime: '09:00 AM',
    priority: 'normal',
    complaint: 'Minor cut, dressing required'
  },
  {
    id: 'P004',
    name: 'Meera Sharma',
    age: 34,
    tokenNumber: 'T-104',
    status: 'waiting',
    checkInTime: '09:15 AM',
    priority: 'normal',
    complaint: 'Pregnancy checkup'
  },
  {
    id: 'P005',
    name: 'Vikram Patel',
    age: 58,
    tokenNumber: 'T-105',
    status: 'in-consultation',
    checkInTime: '09:30 AM',
    priority: 'normal',
    complaint: 'Diabetes follow-up'
  },
  {
    id: 'P006',
    name: 'Lakshmi Bai',
    age: 71,
    tokenNumber: 'T-106',
    status: 'critical',
    checkInTime: '09:45 AM',
    priority: 'high',
    complaint: 'High blood pressure, dizziness'
  },
  {
    id: 'P007',
    name: 'Ramesh Yadav',
    age: 42,
    tokenNumber: 'T-107',
    status: 'waiting',
    checkInTime: '10:00 AM',
    priority: 'normal',
    complaint: 'Skin rash'
  }
];

export const quickStats = {
  patientsToday: 24,
  inQueue: 4,
  completed: 12,
  critical: 2
};

export const recentVitals = [
  {
    patientId: 'P005',
    patientName: 'Vikram Patel',
    timestamp: '09:35 AM',
    bloodPressure: '142/88',
    heartRate: 78,
    temperature: 98.4,
    spo2: 96,
    weight: 72
  },
  {
    patientId: 'P003',
    patientName: 'Arjun Singh',
    timestamp: '09:10 AM',
    bloodPressure: '118/76',
    heartRate: 72,
    temperature: 98.2,
    spo2: 98,
    weight: 68
  }
];

export const medicineInventory = [
  {
    id: 'M001',
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    stock: 450,
    minStock: 200,
    expiryDate: '2026-08-15',
    status: 'adequate'
  },
  {
    id: 'M002',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    stock: 85,
    minStock: 100,
    expiryDate: '2025-12-20',
    status: 'low'
  },
  {
    id: 'M003',
    name: 'Metformin 500mg',
    category: 'Antidiabetic',
    stock: 320,
    minStock: 150,
    expiryDate: '2026-03-10',
    status: 'adequate'
  },
  {
    id: 'M004',
    name: 'Amlodipine 5mg',
    category: 'Antihypertensive',
    stock: 42,
    minStock: 100,
    expiryDate: '2025-09-30',
    status: 'critical'
  },
  {
    id: 'M005',
    name: 'ORS Sachets',
    category: 'Rehydration',
    stock: 280,
    minStock: 150,
    expiryDate: '2027-01-15',
    status: 'adequate'
  },
  {
    id: 'M006',
    name: 'Iron + Folic Acid',
    category: 'Supplement',
    stock: 68,
    minStock: 120,
    expiryDate: '2026-05-22',
    status: 'low'
  },
  {
    id: 'M007',
    name: 'Ibuprofen 400mg',
    category: 'Analgesic',
    stock: 195,
    minStock: 100,
    expiryDate: '2026-11-08',
    status: 'adequate'
  },
  {
    id: 'M008',
    name: 'Cetrizine 10mg',
    category: 'Antihistamine',
    stock: 15,
    minStock: 80,
    expiryDate: '2025-07-14',
    status: 'critical'
  }
];

export const appointments = [
  {
    id: 'A001',
    patientName: 'Radha Krishnan',
    date: '2025-01-15',
    time: '10:00 AM',
    type: 'Follow-up',
    doctor: 'Dr. Sharma',
    status: 'scheduled'
  },
  {
    id: 'A002',
    patientName: 'Suresh Babu',
    date: '2025-01-15',
    time: '11:30 AM',
    type: 'New Consultation',
    doctor: 'Dr. Sharma',
    status: 'scheduled'
  },
  {
    id: 'A003',
    patientName: 'Anita Verma',
    date: '2025-01-15',
    time: '02:00 PM',
    type: 'Vaccination',
    doctor: 'Nurse Priya',
    status: 'scheduled'
  },
  {
    id: 'A004',
    patientName: 'Mohan Lal',
    date: '2025-01-16',
    time: '09:00 AM',
    type: 'Blood Test',
    doctor: 'Lab Technician',
    status: 'scheduled'
  },
  {
    id: 'A005',
    patientName: 'Geeta Rani',
    date: '2025-01-16',
    time: '10:30 AM',
    type: 'Prenatal Checkup',
    doctor: 'Dr. Malini',
    status: 'scheduled'
  }
];

export const medicalHistory = [
  {
    id: 'H001',
    patientId: 'P005',
    patientName: 'Vikram Patel',
    date: '2025-01-10',
    diagnosis: 'Type 2 Diabetes Mellitus',
    treatment: 'Metformin 500mg BD, Diet control',
    nextVisit: '2025-02-10',
    notes: 'Blood sugar levels improving. Continue current medication.'
  },
  {
    id: 'H002',
    patientId: 'P002',
    patientName: 'Sunita Devi',
    date: '2025-01-08',
    diagnosis: 'Hypertension Grade 2',
    treatment: 'Amlodipine 5mg OD, Low salt diet',
    nextVisit: '2025-01-22',
    notes: 'BP: 160/95. Advised regular monitoring.'
  },
  {
    id: 'H003',
    patientId: 'P004',
    patientName: 'Meera Sharma',
    date: '2024-12-15',
    diagnosis: 'Pregnancy - 2nd Trimester',
    treatment: 'Iron + Folic Acid, Calcium supplements',
    nextVisit: '2025-01-15',
    notes: 'Normal fetal development. All vitals stable.'
  },
  {
    id: 'H004',
    patientId: 'P006',
    patientName: 'Lakshmi Bai',
    date: '2024-12-20',
    diagnosis: 'Osteoarthritis, Hypertension',
    treatment: 'Paracetamol PRN, Amlodipine 5mg',
    nextVisit: '2025-01-20',
    notes: 'Joint pain managed. BP within acceptable range.'
  }
];

export const emergencyContacts = [
  {
    name: 'Dr. Rajiv Sharma',
    role: 'District Medical Officer',
    phone: '+91-9876543210'
  },
  {
    name: 'Ambulance Service',
    role: 'Emergency Transport',
    phone: '108'
  },
  {
    name: 'Nearest Hospital',
    role: 'District Hospital Referral',
    phone: '+91-9876543211'
  }
];

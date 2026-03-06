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

// Dynamic function to get today's stats from appointments
export const getQuickStats = (appointments) => {
  const today = new Date('2026-02-06').toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  
  return {
    patientsToday: todayAppointments.length,
    inQueue: todayAppointments.filter(a => a.status === 'scheduled').length,
    completed: todayAppointments.filter(a => a.status === 'completed').length,
    critical: todayAppointments.filter(a => a.priority === 'high' && a.status !== 'completed').length
  };
};

export const quickStats = {
  patientsToday: 12,
  inQueue: 7,
  completed: 5,
  critical: 0
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
    manufacturer: 'Sun Pharma',
    batchNumber: 'PAR-2024-001',
    unit: 'Tablets'
  },
  {
    id: 'M002',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    stock: 85,
    minStock: 100,
    expiryDate: '2025-12-20',
    manufacturer: 'Cipla',
    batchNumber: 'AMX-2024-045',
    unit: 'Capsules'
  },
  {
    id: 'M003',
    name: 'Metformin 500mg',
    category: 'Antidiabetic',
    stock: 320,
    minStock: 150,
    expiryDate: '2026-03-10',
    manufacturer: 'Dr. Reddy\'s',
    batchNumber: 'MET-2024-089',
    unit: 'Tablets'
  },
  {
    id: 'M004',
    name: 'Amlodipine 5mg',
    category: 'Antihypertensive',
    stock: 42,
    minStock: 100,
    expiryDate: '2025-09-30',
    manufacturer: 'Lupin',
    batchNumber: 'AML-2024-023',
    unit: 'Tablets'
  },
  {
    id: 'M005',
    name: 'ORS Sachets',
    category: 'Rehydration',
    stock: 280,
    minStock: 150,
    expiryDate: '2027-01-15',
    manufacturer: 'Electral',
    batchNumber: 'ORS-2024-156',
    unit: 'Sachets'
  },
  {
    id: 'M006',
    name: 'Iron + Folic Acid',
    category: 'Supplement',
    stock: 68,
    minStock: 120,
    expiryDate: '2026-05-22',
    manufacturer: 'Zydus',
    batchNumber: 'IFA-2024-078',
    unit: 'Tablets'
  },
  {
    id: 'M007',
    name: 'Ibuprofen 400mg',
    category: 'Analgesic',
    stock: 195,
    minStock: 100,
    expiryDate: '2026-11-08',
    manufacturer: 'Cipla',
    batchNumber: 'IBU-2024-034',
    unit: 'Tablets'
  },
  {
    id: 'M008',
    name: 'Cetirizine 10mg',
    category: 'Antihistamine',
    stock: 15,
    minStock: 80,
    expiryDate: '2025-07-14',
    manufacturer: 'Sun Pharma',
    batchNumber: 'CET-2024-091',
    unit: 'Tablets'
  },
  {
    id: 'M009',
    name: 'Omeprazole 20mg',
    category: 'Antacid',
    stock: 3,
    minStock: 80,
    expiryDate: '2025-07-18',
    manufacturer: 'Zydus',
    batchNumber: 'OME-2024-078',
    unit: 'Capsules'
  },
  {
    id: 'M010',
    name: 'Aspirin 75mg',
    category: 'Antiplatelet',
    stock: 220,
    minStock: 150,
    expiryDate: '2025-11-25',
    manufacturer: 'Bayer',
    batchNumber: 'ASP-2024-112',
    unit: 'Tablets'
  }
];

// Function to get stock status based on your logic
export const getStockStatus = (currentStock, minRequired) => {
  if (currentStock < minRequired) {
    return 'critical'; // Less than minimum required - RED
  } else if (currentStock < minRequired + 10) {
    return 'low'; // Between minimum and minimum+10 - YELLOW (within 10 units)
  } else {
    return 'adequate'; // More than 10 units above minimum - GREEN
  }
};

// Function to calculate inventory stats dynamically
export const getInventoryStats = (medicines) => {
  const stats = {
    total: medicines.length,
    critical: 0,
    low: 0,
    adequate: 0
  };

  medicines.forEach(medicine => {
    const status = getStockStatus(medicine.stock, medicine.minStock);
    if (status === 'critical') stats.critical++;
    else if (status === 'low') stats.low++;
    else stats.adequate++;
  });

  return stats;
};

// PATIENTS DATABASE
export const patientsDatabase = [
  {
    id: 'P001',
    name: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    village: 'Dharampur',
    bloodGroup: 'B+',
    medicalHistory: 'Diabetes Type 2',
    allergies: 'None',
    registeredDate: '2024-12-01',
    vitals: {
      bloodPressure: '140/90',
      heartRate: '78',
      temperature: '98.4',
      weight: '72',
      height: '168',
      oxygenSaturation: '97'
    }
  },
  {
    id: 'P002',
    name: 'Sunita Devi',
    age: 62,
    gender: 'Female',
    phone: '9876543211',
    village: 'Vansda',
    bloodGroup: 'O+',
    medicalHistory: 'Hypertension',
    allergies: 'Penicillin',
    registeredDate: '2024-11-15',
    vitals: {
      bloodPressure: '150/95',
      heartRate: '82',
      temperature: '98.2',
      weight: '65',
      height: '155',
      oxygenSaturation: '96'
    }
  },
  {
    id: 'P003',
    name: 'Arjun Singh',
    age: 28,
    gender: 'Male',
    phone: '9876543212',
    village: 'Dharampur',
    bloodGroup: 'A+',
    medicalHistory: 'None',
    allergies: 'None',
    registeredDate: '2025-01-10',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6',
      weight: '70',
      height: '175',
      oxygenSaturation: '99'
    }
  },
  {
    id: 'P004',
    name: 'Meera Sharma',
    age: 34,
    gender: 'Female',
    phone: '9876543213',
    village: 'Subir',
    bloodGroup: 'AB+',
    medicalHistory: 'Pregnancy - 2nd trimester',
    allergies: 'None',
    registeredDate: '2024-10-20',
    vitals: {
      bloodPressure: '115/75',
      heartRate: '76',
      temperature: '98.4',
      weight: '68',
      height: '162',
      oxygenSaturation: '98'
    }
  },
  {
    id: 'P005',
    name: 'Vikram Patel',
    age: 58,
    gender: 'Male',
    phone: '9876543214',
    village: 'Dharampur',
    bloodGroup: 'B-',
    medicalHistory: 'Hypothyroidism',
    allergies: 'None',
    registeredDate: '2024-09-05',
    vitals: {
      bloodPressure: '130/85',
      heartRate: '74',
      temperature: '98.3',
      weight: '78',
      height: '172',
      oxygenSaturation: '97'
    }
  },
  {
    id: 'P006',
    name: 'Lakshmi Bai',
    age: 71,
    gender: 'Female',
    phone: '9876543215',
    village: 'Vansda',
    bloodGroup: 'O+',
    medicalHistory: 'Heart disease, Hypertension',
    allergies: 'Aspirin',
    registeredDate: '2024-08-12',
    vitals: {
      bloodPressure: '160/100',
      heartRate: '88',
      temperature: '98.1',
      weight: '58',
      height: '152',
      oxygenSaturation: '94'
    }
  },
  {
    id: 'P007',
    name: 'Ramesh Yadav',
    age: 42,
    gender: 'Male',
    phone: '9876543216',
    village: 'Dharampur',
    bloodGroup: 'A+',
    medicalHistory: 'None',
    allergies: 'None',
    registeredDate: '2025-01-14',
    vitals: {
      bloodPressure: '122/78',
      heartRate: '70',
      temperature: '98.5',
      weight: '75',
      height: '170',
      oxygenSaturation: '98'
    }
  },
  {
    id: 'P008',
    name: 'Priya Reddy',
    age: 29,
    gender: 'Female',
    phone: '9876543217',
    village: 'Subir',
    bloodGroup: 'B+',
    medicalHistory: 'None',
    allergies: 'None',
    registeredDate: '2024-12-20',
    vitals: {
      bloodPressure: '118/76',
      heartRate: '68',
      temperature: '98.6',
      weight: '60',
      height: '165',
      oxygenSaturation: '99'
    }
  },
  {
    id: 'P009',
    name: 'Suresh Babu',
    age: 55,
    gender: 'Male',
    phone: '9876543218',
    village: 'Vansda',
    bloodGroup: 'O-',
    medicalHistory: 'Hypertension, Diabetes',
    allergies: 'None',
    registeredDate: '2024-07-30',
    vitals: {
      bloodPressure: '145/92',
      heartRate: '80',
      temperature: '98.3',
      weight: '82',
      height: '169',
      oxygenSaturation: '96'
    }
  },
  {
    id: 'P010',
    name: 'Anita Verma',
    age: 38,
    gender: 'Female',
    phone: '9876543219',
    village: 'Dharampur',
    bloodGroup: 'AB+',
    medicalHistory: 'IBS',
    allergies: 'Lactose',
    registeredDate: '2024-11-28',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.4',
      weight: '62',
      height: '160',
      oxygenSaturation: '98'
    }
  },
  {
    id: 'P011',
    name: 'Mohan Lal',
    age: 67,
    gender: 'Male',
    phone: '9876543220',
    village: 'Subir',
    bloodGroup: 'A-',
    medicalHistory: 'Diabetes, Arthritis',
    allergies: 'None',
    registeredDate: '2024-06-15',
    vitals: {
      bloodPressure: '138/88',
      heartRate: '76',
      temperature: '98.2',
      weight: '68',
      height: '166',
      oxygenSaturation: '95'
    }
  },
  {
    id: 'P012',
    name: 'Geeta Rani',
    age: 44,
    gender: 'Female',
    phone: '9876543221',
    village: 'Dharampur',
    bloodGroup: 'B+',
    medicalHistory: 'Osteoarthritis',
    allergies: 'None',
    registeredDate: '2024-10-10',
    vitals: {
      bloodPressure: '125/82',
      heartRate: '74',
      temperature: '98.5',
      weight: '66',
      height: '158',
      oxygenSaturation: '97'
    }
  }
];

// Get today's date and generate realistic appointment times  
const today = new Date('2026-02-06');
const todayStr = today.toISOString().split('T')[0];

export const appointments = [
  // 5 COMPLETED Appointments (Morning slots)
  {
    id: 'A001',
    patientName: 'Ramesh Kumar',
    patientId: 'P001',
    age: 45,
    date: todayStr,
    time: '08:00 AM',
    scheduledTime: new Date(today.setHours(8, 0, 0, 0)),
    type: 'Follow-up',
    complaint: 'Diabetes checkup',
    doctor: 'Dr. Sharma',
    status: 'completed',
    duration: '15 mins',
    completedAt: '08:15 AM',
    consultationSummary: {
      chiefComplaint: 'Diabetes checkup - routine follow-up',
      symptoms: 'Mild fatigue, increased thirst, no major issues reported',
      vitalsRecorded: {
        bloodPressure: '140/90',
        bloodSugar: '145 mg/dL (Fasting)',
        weight: '72 kg',
        pulse: '78 bpm'
      },
      diagnosis: 'Type 2 Diabetes Mellitus - Under control',
      doctorNotes: 'Patient is managing well. Blood sugar levels are within acceptable range. Continue current medication. Advised to maintain diet control and regular exercise. Increase water intake.',
      followUpDate: '2026-03-05',
      followUpReason: 'Routine diabetes monitoring'
    },
    prescription: {
      medicines: [
        {
          name: 'Metformin 500mg',
          dosage: '1 tablet',
          frequency: 'Twice daily',
          timing: 'After breakfast and dinner',
          duration: '30 days',
          instructions: 'Take with food'
        },
        {
          name: 'Glimepiride 2mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'Before breakfast',
          duration: '30 days',
          instructions: 'Take 30 minutes before meal'
        }
      ],
      labTests: ['HbA1c test after 3 months'],
      dietaryAdvice: 'Avoid sugar and refined carbs. Include more vegetables and whole grains. Drink 8-10 glasses of water daily.',
      generalInstructions: 'Monitor blood sugar weekly. Maintain exercise routine - 30 minutes walking daily.'
    }
  },
  {
    id: 'A002',
    patientName: 'Sunita Devi',
    patientId: 'P002',
    age: 62,
    date: todayStr,
    time: '08:30 AM',
    scheduledTime: new Date(today.setHours(8, 30, 0, 0)),
    type: 'New Consultation',
    complaint: 'High blood pressure',
    doctor: 'Dr. Sharma',
    status: 'completed',
    duration: '20 mins',
    completedAt: '08:50 AM',
    consultationSummary: {
      chiefComplaint: 'Elevated blood pressure, headaches',
      symptoms: 'Persistent headaches for 1 week, dizziness, neck pain. Patient reports feeling anxious.',
      vitalsRecorded: {
        bloodPressure: '160/100',
        pulse: '88 bpm',
        weight: '65 kg',
        temperature: '98.2°F'
      },
      diagnosis: 'Stage 2 Hypertension (Newly diagnosed)',
      doctorNotes: 'Patient has significantly elevated BP. Started on antihypertensive medication. Advised lifestyle modifications including low salt diet, stress management, and daily walking. Monitor BP daily for 1 week. IMPORTANT: Patient has Penicillin allergy - noted in records.',
      followUpDate: '2026-02-19',
      followUpReason: 'BP monitoring and medication adjustment'
    },
    prescription: {
      medicines: [
        {
          name: 'Amlodipine 5mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'Morning after breakfast',
          duration: '30 days',
          instructions: 'Take at same time every day'
        },
        {
          name: 'Aspirin 75mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'Night after dinner',
          duration: '30 days',
          instructions: 'Take with water'
        }
      ],
      labTests: ['ECG', 'Lipid profile', 'Kidney function test'],
      dietaryAdvice: 'Reduce salt intake to less than 5g per day. Avoid pickles, papad, processed foods. Include potassium-rich foods like bananas.',
      generalInstructions: 'Monitor BP daily at same time. Keep BP diary. Walk 30 minutes daily. Reduce stress through meditation or yoga.'
    }
  },
  {
    id: 'A003',
    patientName: 'Arjun Singh',
    patientId: 'P003',
    age: 28,
    date: todayStr,
    time: '09:00 AM',
    scheduledTime: new Date(today.setHours(9, 0, 0, 0)),
    type: 'General Checkup',
    complaint: 'Fever and body ache',
    doctor: 'Dr. Malini',
    status: 'completed',
    duration: '12 mins',
    completedAt: '09:12 AM',
    consultationSummary: {
      chiefComplaint: 'Fever (3 days), body ache, weakness',
      symptoms: 'Low-grade fever (99-101°F) for 3 days, generalized body ache, mild headache, loss of appetite. No cough or breathing difficulty.',
      vitalsRecorded: {
        temperature: '100.4°F',
        bloodPressure: '120/80',
        pulse: '82 bpm',
        oxygenSaturation: '98%'
      },
      diagnosis: 'Viral Fever (likely seasonal viral infection)',
      doctorNotes: 'Common viral fever. No danger signs. Patient is young and healthy. Symptomatic treatment prescribed. Advised plenty of rest and fluids. Should recover in 3-4 days. Return if fever persists beyond 5 days or if breathing difficulty develops.',
      followUpDate: '2026-02-10',
      followUpReason: 'Only if symptoms worsen or persist'
    },
    prescription: {
      medicines: [
        {
          name: 'Paracetamol 500mg',
          dosage: '1 tablet',
          frequency: 'Three times daily',
          timing: 'After meals (breakfast, lunch, dinner)',
          duration: '5 days',
          instructions: 'Take only if fever is above 100°F'
        },
        {
          name: 'Cetirizine 10mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'At bedtime',
          duration: '3 days',
          instructions: 'For body ache relief'
        }
      ],
      labTests: [],
      dietaryAdvice: 'Drink plenty of fluids - water, ORS, coconut water. Light, easily digestible food. Avoid oily and spicy food.',
      generalInstructions: 'Complete rest for 3 days. Steam inhalation twice daily. Return immediately if fever goes above 103°F or if breathing problems occur.'
    }
  },
  {
    id: 'A004',
    patientName: 'Meera Sharma',
    patientId: 'P004',
    age: 34,
    date: todayStr,
    time: '09:30 AM',
    scheduledTime: new Date(today.setHours(9, 30, 0, 0)),
    type: 'Prenatal Checkup',
    complaint: 'Routine pregnancy checkup',
    doctor: 'Dr. Malini',
    status: 'completed',
    duration: '25 mins',
    completedAt: '09:55 AM',
    consultationSummary: {
      chiefComplaint: '20 weeks pregnant - routine antenatal checkup',
      symptoms: 'Mild nausea (improved), good appetite, baby movements felt. No bleeding or pain. Some ankle swelling in evening.',
      vitalsRecorded: {
        bloodPressure: '115/75',
        weight: '68 kg',
        pulse: '76 bpm',
        hemoglobin: '10.5 g/dL'
      },
      diagnosis: 'Pregnancy - 20 weeks, progressing normally. Mild anemia detected.',
      doctorNotes: 'Pregnancy progressing well. Fetal movements present. BP normal. Mild anemia needs correction - started on iron supplements. Ankle swelling is normal. Ultrasound scheduled for anatomy scan. Diet counseling provided.',
      followUpDate: '2026-03-05',
      followUpReason: 'Next routine antenatal checkup'
    },
    prescription: {
      medicines: [
        {
          name: 'Iron + Folic Acid',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'After lunch',
          duration: '30 days',
          instructions: 'Take with orange juice for better absorption. May cause dark stools (normal)'
        },
        {
          name: 'Calcium 500mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'At bedtime',
          duration: '30 days',
          instructions: 'Take with milk'
        }
      ],
      labTests: ['Anomaly scan (ultrasound) at 20-22 weeks', 'Repeat hemoglobin after 1 month'],
      dietaryAdvice: 'Protein-rich diet - dal, milk, eggs. Iron-rich foods - spinach, jaggery, dates. Small frequent meals. Adequate hydration.',
      generalInstructions: 'Continue regular walks. Elevate legs while resting to reduce swelling. Count baby movements daily. Attend antenatal classes.'
    }
  },
  {
    id: 'A005',
    patientName: 'Vikram Patel',
    patientId: 'P005',
    age: 58,
    date: todayStr,
    time: '10:00 AM',
    scheduledTime: new Date(today.setHours(10, 0, 0, 0)),
    type: 'Follow-up',
    complaint: 'Thyroid monitoring',
    doctor: 'Dr. Sharma',
    status: 'completed',
    duration: '18 mins',
    completedAt: '10:18 AM',
    consultationSummary: {
      chiefComplaint: 'Hypothyroidism follow-up - on treatment for 6 months',
      symptoms: 'Feeling much better. Energy levels improved. No more cold intolerance. Weight stable.',
      vitalsRecorded: {
        bloodPressure: '130/85',
        pulse: '74 bpm',
        weight: '78 kg',
        TSH: '3.2 mIU/L (Normal range: 0.5-5.0)'
      },
      diagnosis: 'Hypothyroidism - Well controlled on current medication',
      doctorNotes: 'TSH levels are now in normal range. Patient responding well to Thyroxine. Symptoms have resolved. Continue same dose. Regular monitoring required as this is a lifelong condition.',
      followUpDate: '2026-05-05',
      followUpReason: 'Routine thyroid monitoring - TSH check'
    },
    prescription: {
      medicines: [
        {
          name: 'Thyroxine 50mcg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          timing: 'Early morning empty stomach',
          duration: '90 days',
          instructions: 'Take 30 minutes before breakfast. Do not take with milk or calcium'
        }
      ],
      labTests: ['TSH level after 3 months'],
      dietaryAdvice: 'Ensure adequate iodine intake - use iodized salt. Include seafood if available. Avoid excessive soy products.',
      generalInstructions: 'Take medication at same time daily. Never skip doses. Regular follow-up important for monitoring.'
    }
  },
  
  // 2 ACTIVE Appointments (Time Up - Should start now)
  {
    id: 'A006',
    patientName: 'Lakshmi Bai',
    patientId: 'P006',
    age: 71,
    date: todayStr,
    time: '10:30 AM',
    scheduledTime: new Date(today.setHours(10, 30, 0, 0)),
    type: 'Emergency',
    complaint: 'Chest pain and breathlessness',
    doctor: 'Dr. Sharma',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'A007',
    patientName: 'Ramesh Yadav',
    patientId: 'P007',
    age: 42,
    date: todayStr,
    time: '11:00 AM',
    scheduledTime: new Date(today.setHours(11, 0, 0, 0)),
    type: 'New Consultation',
    complaint: 'Skin rash and itching',
    doctor: 'Dr. Malini',
    status: 'active',
    priority: 'normal'
  },
  
  // 5 UPCOMING Appointments (Afternoon/Evening)
  {
    id: 'A008',
    patientName: 'Priya Reddy',
    patientId: 'P008',
    age: 29,
    date: todayStr,
    time: '02:00 PM',
    scheduledTime: new Date(today.setHours(14, 0, 0, 0)),
    type: 'Vaccination',
    complaint: 'Child vaccination',
    doctor: 'Nurse Priya',
    status: 'scheduled',
    priority: 'normal'
  },
  {
    id: 'A009',
    patientName: 'Suresh Babu',
    patientId: 'P009',
    age: 55,
    date: todayStr,
    time: '03:00 PM',
    scheduledTime: new Date(today.setHours(15, 0, 0, 0)),
    type: 'Follow-up',
    complaint: 'Blood pressure monitoring',
    doctor: 'Dr. Sharma',
    status: 'scheduled',
    priority: 'normal'
  },
  {
    id: 'A010',
    patientName: 'Anita Verma',
    patientId: 'P010',
    age: 38,
    date: todayStr,
    time: '04:00 PM',
    scheduledTime: new Date(today.setHours(16, 0, 0, 0)),
    type: 'General Checkup',
    complaint: 'Stomach pain',
    doctor: 'Dr. Malini',
    status: 'scheduled',
    priority: 'normal'
  },
  {
    id: 'A011',
    patientName: 'Mohan Lal',
    patientId: 'P011',
    age: 67,
    date: todayStr,
    time: '05:00 PM',
    scheduledTime: new Date(today.setHours(17, 0, 0, 0)),
    type: 'Follow-up',
    complaint: 'Diabetes and BP checkup',
    doctor: 'Dr. Sharma',
    status: 'scheduled',
    priority: 'normal'
  },
  {
    id: 'A012',
    patientName: 'Geeta Rani',
    patientId: 'P012',
    age: 44,
    date: todayStr,
    time: '05:30 PM',
    scheduledTime: new Date(today.setHours(17, 30, 0, 0)),
    type: 'New Consultation',
    complaint: 'Joint pain',
    doctor: 'Dr. Sharma',
    status: 'scheduled',
    priority: 'normal'
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

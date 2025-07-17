export interface User {
  id: string;
  email: string;
  name: string;
  role: 'medecin' | 'infirmier' | 'admin';
  specialty?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  assignedDoctor: string;
  assignedNurse: string;
  status: 'suivi-chronique' | 'aigu' | 'termine';
  room?: string;
  lastConsultation?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  prescription?: string;
  followUp?: string;
  documents?: string[];
}

export interface VitalSigns {
  id: string;
  patientId: string;
  nurseId: string;
  date: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
  consciousness: string;
  mobility: string;
  nutrition: string;
  medicationsAdministered: string[];
  notes: string;
  anomalyDetected: boolean;
}

export interface Document {
  id: string;
  patientId: string;
  name: string;
  type: 'analysis' | 'radiology' | 'prescription' | 'report' | 'other';
  url: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: Medication[];
  instructions: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'confirme' | 'annule' | 'reporte';
  notes?: string;
}
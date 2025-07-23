export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'medecin' | 'infirmier' | 'admin';
  specialty?: string;
  is_active: boolean;
  token?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  address: string;
  blood_type: string;
  allergies?: string[]; // JSON nullable
  medical_history?: string[]; // JSON nullable
  assigned_doctor_id?: number | null;
  assigned_nurse_id?: number | null;
  status: 'suivi-chronique' | 'aigu' | 'termine';
  room?: string | null;
  last_consultation?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: number;
  patient_id: number;
  doctor_id: number;
  consultation_date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  recommendations?: string;
  prescription?: string;
  follow_up?: string;
  documents?: number[]; // IDs des documents associés
  created_at: string;
  updated_at: string;
}

export interface VitalSigns {
  id: number;
  patient_id: number;
  nurse_id: number;
  measurement_date: string;
  temperature: number;
  blood_pressure: string;
  heart_rate: number;
  oxygen_saturation: number;
  consciousness: string;
  mobility: string;
  nutrition: string;
  medications_administered?: string[]; // nullable JSON
  notes?: string;
  anomaly_detected: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  patient_id: number;
  name: string;
  type: 'analysis' | 'radiology' | 'prescription' | 'report' | 'other';
  file_path: string;
  mime_type: string;
  file_size: number;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  prescription_date: string;
  medications: Medication[]; // stocké en JSON
  instructions: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'confirme' | 'annule' | 'reporte';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DataContextType {
  patients: Patient[];
  consultations: Consultation[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  documents: Document[];
  vitalSigns: VitalSigns[];
  refreshData: () => void;
  fetchAppointments: () => Promise<Appointment[]>;
  fetchVitalSigns: () => Promise<VitalSigns[]>;
  // ajoute ici d'autres fetch si nécessaire
}
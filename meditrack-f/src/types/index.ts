export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'medecin' | 'infirmier' | 'admin';
  specialty?: string;
  is_active: boolean;
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
}

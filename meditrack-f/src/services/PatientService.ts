import { Patient } from '../types';
import api from './api';

interface ApiPatient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  address: string;
  blood_type: string;
  allergies: string[];
  medical_history: string[];
  assigned_doctor_id: number;
  assigned_nurse_id: number;
  status: 'suivi-chronique' | 'aigu' | 'termine';
  room: string | null;
  last_consultation: string | null;
}

interface ApiResponse {
  success: boolean;
  data: ApiPatient[];
  message: string;
}

const transformPatient = (apiPatient: ApiPatient): Patient => ({
  id: String(apiPatient.id),
  firstName: apiPatient.first_name,
  lastName: apiPatient.last_name,
  dateOfBirth: apiPatient.date_of_birth,
  gender: apiPatient.gender,
  phone: apiPatient.phone,
  email: apiPatient.email,
  address: apiPatient.address,
  bloodType: apiPatient.blood_type,
  allergies: apiPatient.allergies,
  medicalHistory: apiPatient.medical_history,
  assignedDoctor: String(apiPatient.assigned_doctor_id),
  assignedNurse: String(apiPatient.assigned_nurse_id),
  status: apiPatient.status,
  room: apiPatient.room || undefined,
  lastConsultation: apiPatient.last_consultation || undefined,
});

export const PatientService = {
  getAll: async () => {
    const response = await api.get<ApiResponse>('/api/patients');
    return {
      ...response,
      data: response.data.data.map(transformPatient)
    };
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: ApiPatient }>(`/api/patients/${id}`);
    return {
      ...response,
      data: transformPatient(response.data.data)
    };
  },
  create: (patient: Patient) => api.post<Patient>('/api/patients', patient),
  update: (id: string, patient: Partial<Patient>) => api.put<Patient>(`/api/patients/${id}`, patient),
  delete: (id: string) => api.delete(`/api/patients/${id}`),
};

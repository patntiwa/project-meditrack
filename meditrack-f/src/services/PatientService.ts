import { Patient } from '../types';
import api from './api';

export const PatientService = {
  getAll: () => api.get<Patient[]>('/api/patients'),
  getById: (id: string) => api.get<Patient>(`/api/patients/${id}`),
  create: (patient: Patient) => api.post<Patient>('/api/patients', patient),
  update: (id: string, patient: Partial<Patient>) => api.put<Patient>(`/api/patients/${id}`, patient),
  delete: (id: string) => api.delete(`/api/patients/${id}`),
};

import { Consultation } from '../types';
import api from './api';

export const ConsultationService = {
  getAll: () => api.get<Consultation[]>('/api/consultations'),
  getById: (id: string) => api.get<Consultation>(`/api/consultations/${id}`),
  create: (consultation: Consultation) => api.post<Consultation>('/api/consultations', consultation),
  update: (id: string, consultation: Partial<Consultation>) => api.put<Consultation>(`/api/consultations/${id}`, consultation),
  delete: (id: string) => api.delete(`/api/consultations/${id}`),
  getToday: () => api.get<Consultation[]>('/api/consultations-today'),
  getThisMonth: () => api.get<Consultation[]>('/api/consultations-month'),
};

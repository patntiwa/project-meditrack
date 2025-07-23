import { VitalSigns } from '../types';
import api from './api';

export const VitalSignsService = {
  getAll: () => api.get<VitalSigns[]>('/api/vital-signs'),
  getById: (id: string) => api.get<VitalSigns>(`/api/vital-signs/${id}`),
  create: (vitalSigns: VitalSigns) => api.post<VitalSigns>('/api/vital-signs', vitalSigns),
  update: (id: string, vitalSigns: Partial<VitalSigns>) => api.put<VitalSigns>(`/api/vital-signs/${id}`, vitalSigns),
  delete: (id: string) => api.delete(`/api/vital-signs/${id}`),
  getTodayByPatient: (patientId: string) => api.get<VitalSigns[]>(`/api/patients/${patientId}/vital-signs/today`),
  getAlerts: () => api.get<VitalSigns[]>('/api/vital-signs-alerts'),
};

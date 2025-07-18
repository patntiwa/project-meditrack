import api from '../api';

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export const getTodayAppointments = async () => {
  const response = await api.get('/api/dashboard/today-appointments');
  return response.data;
};

export const getVitalAlerts = async () => {
  const response = await api.get('/api/vital-signs-alerts');
  return response.data;
};

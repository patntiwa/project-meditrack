import { useEffect, useState } from 'react';
import { Appointment } from '../types';
import * as AppointmentService from '../services/AppointmentService';
import { toast } from 'react-toastify';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await AppointmentService.getAll();
      setAppointments(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des rendez-vous :', err);
      toast.error("Erreur lors du chargement des rendez-vous.");
      setError(err?.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
};

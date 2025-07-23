import { useEffect, useState } from 'react';
import { Consultation } from '../types';
import * as ConsultationService from '../services/ConsultationService';
import { toast } from 'react-toastify';

export const useConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const data = await ConsultationService.getAll();
      setConsultations(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || "Erreur lors du chargement des consultations.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  return { consultations, loading, error, refetch: fetchConsultations };
};

import { useEffect, useState } from 'react';
import { Prescription } from '../types';
import * as PrescriptionService from '../services/PrescriptionService';
import { toast } from 'react-toastify';

export const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await PrescriptionService.getAll();
      setPrescriptions(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || "Erreur lors du chargement des prescriptions.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return { prescriptions, loading, error, refetch: fetchPrescriptions };
};

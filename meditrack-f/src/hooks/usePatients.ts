import { useEffect, useState } from 'react';
import { Patient } from '../types';
import * as PatientService from '../services/PatientService';
import { toast } from 'react-toastify';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await PatientService.getAll();
      setPatients(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || "Erreur lors du chargement des patients.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, loading, error, refetch: fetchPatients };
};

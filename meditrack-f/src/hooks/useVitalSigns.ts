import { useEffect, useState } from 'react';
import { VitalSigns } from '../types';
import * as VitalSignsService from '../services/VitalSignsService';
import { toast } from 'react-toastify';

export const useVitalSigns = () => {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVitalSigns = async () => {
    setLoading(true);
    try {
      const data = await VitalSignsService.getAll();
      setVitalSigns(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || "Erreur lors du chargement des signes vitaux.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitalSigns();
  }, []);

  return { vitalSigns, loading, error, refetch: fetchVitalSigns };
};

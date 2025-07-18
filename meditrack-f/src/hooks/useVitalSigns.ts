import { useState, useEffect } from 'react';
import { VitalSigns } from '../types';
import { VitalSignsService } from '../services/VitalSignsService';
import { useApiState } from './useApiState';

export function useVitalSigns() {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const { isLoading, error, setIsLoading, setError } = useApiState();

  useEffect(() => {
    const fetchVitalSigns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await VitalSignsService.getAll();
        setVitalSigns(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching vital signs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitalSigns();
  }, [setIsLoading, setError]);

  const addVitalSigns = async (vitalSigns: VitalSigns) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VitalSignsService.create(vitalSigns);
      setVitalSigns(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding vital signs');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVitalSigns = async (id: string, vitalSigns: Partial<VitalSigns>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VitalSignsService.update(id, vitalSigns);
      setVitalSigns(prev => prev.map(vs => vs.id === id ? response.data : vs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating vital signs');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVitalSigns = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await VitalSignsService.delete(id);
      setVitalSigns(prev => prev.filter(vs => vs.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting vital signs');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientTodayVitalSigns = async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VitalSignsService.getTodayByPatient(patientId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching patient vital signs');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getVitalSignsAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VitalSignsService.getAlerts();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching vital signs alerts');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vitalSigns,
    isLoading,
    error,
    addVitalSigns,
    updateVitalSigns,
    deleteVitalSigns,
    getPatientTodayVitalSigns,
    getVitalSignsAlerts,
  };
}

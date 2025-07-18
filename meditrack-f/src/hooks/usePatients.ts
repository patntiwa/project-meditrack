import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { PatientService } from '../services/PatientService';
import { useApiState } from './useApiState';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading, error, setIsLoading, setError } = useApiState();

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await PatientService.getAll();
        setPatients(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching patients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [setIsLoading, setError]);

  const addPatient = async (patient: Patient) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await PatientService.create(patient);
      setPatients(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding patient');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (id: string, patient: Partial<Patient>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await PatientService.update(id, patient);
      setPatients(prev => prev.map(p => p.id === id ? response.data : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating patient');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await PatientService.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting patient');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    patients,
    isLoading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
  };
}

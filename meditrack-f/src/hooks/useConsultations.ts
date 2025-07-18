import { useState, useEffect } from 'react';
import { Consultation } from '../types';
import { ConsultationService } from '../services/ConsultationService';
import { useApiState } from './useApiState';

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const { isLoading, error, setIsLoading, setError } = useApiState();

  useEffect(() => {
    const fetchConsultations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ConsultationService.getAll();
        setConsultations(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching consultations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [setIsLoading, setError]);

  const addConsultation = async (consultation: Consultation) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ConsultationService.create(consultation);
      setConsultations(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding consultation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsultation = async (id: string, consultation: Partial<Consultation>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ConsultationService.update(id, consultation);
      setConsultations(prev => prev.map(c => c.id === id ? response.data : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating consultation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConsultation = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await ConsultationService.delete(id);
      setConsultations(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting consultation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayConsultations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ConsultationService.getToday();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching today\'s consultations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthConsultations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ConsultationService.getThisMonth();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching month\'s consultations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    consultations,
    isLoading,
    error,
    addConsultation,
    updateConsultation,
    deleteConsultation,
    getTodayConsultations,
    getMonthConsultations,
  };
}

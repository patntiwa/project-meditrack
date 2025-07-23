// src/hooks/useCareSchedules.ts
import { useEffect, useState } from 'react';

export interface CareSchedule {
  id: number;
  time: string;
  task: string;
  status: 'pending' | 'completed';
}

export const useCareSchedules = () => {
  const [careSchedules, setCareSchedules] = useState<CareSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMockSchedules = async () => {
    try {
      setLoading(true);

      // Données temporaires – à remplacer par API
      const mockData: CareSchedule[] = [
        { id: 1, time: '08:00', task: 'Prise de constantes - Tous les patients', status: 'pending' },
        { id: 2, time: '12:00', task: 'Distribution médicaments', status: 'completed' },
        { id: 3, time: '16:00', task: 'Pansements - Chambre 205', status: 'pending' },
        { id: 4, time: '20:00', task: 'Contrôle nocturne', status: 'pending' }
      ];

      setCareSchedules(mockData);
    } catch (err) {
      setError('Erreur lors du chargement du planning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockSchedules();
  }, []);

  const markCompleted = (id: number) => {
    setCareSchedules(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: 'completed' } : task
      )
    );
  };

  const markPending = (id: number) => {
    setCareSchedules(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: 'pending' } : task
      )
    );
  };

  return {
    careSchedules,
    loading,
    error,
    markCompleted,
    markPending,
    refetch: fetchMockSchedules
  };
};

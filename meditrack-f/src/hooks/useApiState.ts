import { useState } from 'react';

export interface UseApiStateResult {
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useApiState(): UseApiStateResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    isLoading,
    error,
    setIsLoading,
    setError,
  };
}

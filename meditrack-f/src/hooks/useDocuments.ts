import { useEffect, useState } from 'react';
import { Document } from '../types';
import * as DocumentService from '../services/DocumentService';
import { toast } from 'react-toastify';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await DocumentService.getAll();
      setDocuments(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || "Erreur lors du chargement des documents.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, error, refetch: fetchDocuments };
};

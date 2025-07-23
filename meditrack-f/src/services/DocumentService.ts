import api from './api';
import { Document } from '../types';

const base = '/documents';

export const getAll = async (): Promise<Document[]> => {
  try {
    const response = await api.get(base);
    return response.data.data;
  } catch {
    throw new Error("Impossible de récupérer les documents.");
  }
};

export const getById = async (id: number): Promise<Document> => {
  try {
    const response = await api.get(`${base}/${id}`);
    return response.data.data;
  } catch {
    throw new Error(`Impossible de récupérer le document #${id}.`);
  }
};

export const create = async (data: Partial<Document>): Promise<Document> => {
  try {
    const response = await api.post(base, data);
    return response.data.data;
  } catch {
    throw new Error("Échec de l’enregistrement du document.");
  }
};

export const update = async (id: number, data: Partial<Document>): Promise<Document> => {
  try {
    const response = await api.put(`${base}/${id}`, data);
    return response.data.data;
  } catch {
    throw new Error(`Échec de la mise à jour du document #${id}.`);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${id}`);
  } catch {
    throw new Error(`Échec de la suppression du document #${id}.`);
  }
};

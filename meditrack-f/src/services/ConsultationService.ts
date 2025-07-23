import api from './api';
import { Consultation } from '../types';

const base = '/consultations';

export const getAll = async (): Promise<Consultation[]> => {
  try {
    const response = await api.get(base);
    return response.data.data;
  } catch {
    throw new Error("Impossible de récupérer les consultations.");
  }
};

export const getById = async (id: number): Promise<Consultation> => {
  try {
    const response = await api.get(`${base}/${id}`);
    return response.data.data;
  } catch {
    throw new Error(`Impossible de récupérer la consultation #${id}.`);
  }
};

export const create = async (data: Partial<Consultation>): Promise<Consultation> => {
  try {
    const response = await api.post(base, data);
    return response.data.data;
  } catch {
    throw new Error("Échec de l'enregistrement de la consultation.");
  }
};

export const update = async (id: number, data: Partial<Consultation>): Promise<Consultation> => {
  try {
    const response = await api.put(`${base}/${id}`, data);
    return response.data.data;
  } catch {
    throw new Error(`Échec de la mise à jour de la consultation #${id}.`);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${id}`);
  } catch {
    throw new Error(`Échec de la suppression de la consultation #${id}.`);
  }
};

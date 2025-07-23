import api from './api';
import { Prescription } from '../types';

const base = '/prescriptions';

export const getAll = async (): Promise<Prescription[]> => {
  try {
    const response = await api.get(base);
    return response.data.data;
  } catch {
    throw new Error("Impossible de récupérer les prescriptions.");
  }
};

export const getById = async (id: number): Promise<Prescription> => {
  try {
    const response = await api.get(`${base}/${id}`);
    return response.data.data;
  } catch {
    throw new Error(`Impossible de récupérer la prescription #${id}.`);
  }
};

export const create = async (data: Partial<Prescription>): Promise<Prescription> => {
  try {
    const response = await api.post(base, data);
    return response.data.data;
  } catch {
    throw new Error("Échec de l'enregistrement de la prescription.");
  }
};

export const update = async (id: number, data: Partial<Prescription>): Promise<Prescription> => {
  try {
    const response = await api.put(`${base}/${id}`, data);
    return response.data.data;
  } catch {
    throw new Error(`Échec de la mise à jour de la prescription #${id}.`);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${id}`);
  } catch {
    throw new Error(`Échec de la suppression de la prescription #${id}.`);
  }
};

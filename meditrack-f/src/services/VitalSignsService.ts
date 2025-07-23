import api from './api';
import { VitalSigns } from '../types';

const base = '/vital-signs';

export const getAll = async (): Promise<VitalSigns[]> => {
  try {
    const response = await api.get(base);
    return response.data.data;
  } catch {
    throw new Error("Impossible de récupérer les signes vitaux.");
  }
};

export const getById = async (id: number): Promise<VitalSigns> => {
  try {
    const response = await api.get(`${base}/${id}`);
    return response.data.data;
  } catch {
    throw new Error(`Impossible de récupérer le signe vital #${id}.`);
  }
};

export const create = async (data: Partial<VitalSigns>): Promise<VitalSigns> => {
  try {
    const response = await api.post(base, data);
    return response.data.data;
  } catch {
    throw new Error("Échec de l’enregistrement du signe vital.");
  }
};

export const update = async (id: number, data: Partial<VitalSigns>): Promise<VitalSigns> => {
  try {
    const response = await api.put(`${base}/${id}`, data);
    return response.data.data;
  } catch {
    throw new Error(`Échec de la mise à jour du signe vital #${id}.`);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${id}`);
  } catch {
    throw new Error(`Échec de la suppression du signe vital #${id}.`);
  }
};

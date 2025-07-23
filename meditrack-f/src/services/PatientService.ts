import api from './api';
import { Patient } from '../types';

const base = '/patients';

export const getAll = async (): Promise<Patient[]> => {
  try {
    const response = await api.get(base);
    return response.data.data;
  } catch {
    throw new Error("Impossible de récupérer la liste des patients.");
  }
};

export const getById = async (id: number): Promise<Patient> => {
  try {
    const response = await api.get(`${base}/${id}`);
    return response.data.data;
  } catch {
    throw new Error(`Impossible de récupérer le patient #${id}.`);
  }
};

export const create = async (data: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await api.post(base, data);
    return response.data.data;
  } catch {
    throw new Error("Échec de l'enregistrement du patient.");
  }
};

export const update = async (id: number, data: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await api.put(`${base}/${id}`, data);
    return response.data.data;
  } catch {
    throw new Error(`Échec de la mise à jour du patient #${id}.`);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${id}`);
  } catch {
    throw new Error(`Échec de la suppression du patient #${id}.`);
  }
};

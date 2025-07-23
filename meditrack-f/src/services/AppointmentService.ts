import api from './api';
import { Appointment } from '../types';

const base = '/appointments';

export const getAll = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get(base);
    return response.data.data;
  } catch {
    throw new Error("Impossible de récupérer les rendez-vous.");
  }
};

export const getById = async (id: number): Promise<Appointment> => {
  try {
    const response = await api.get(`${base}/${id}`);
    return response.data.data;
  } catch {
    throw new Error(`Impossible de récupérer le rendez-vous #${id}.`);
  }
};

export const create = async (data: Partial<Appointment>): Promise<Appointment> => {
  try {
    const response = await api.post(base, data);
    return response.data.data;
  } catch {
    throw new Error("Échec de la création du rendez-vous.");
  }
};

export const update = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
  try {
    const response = await api.put(`${base}/${id}`, data);
    return response.data.data;
  } catch {
    throw new Error(`Échec de la mise à jour du rendez-vous #${id}.`);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await api.delete(`${base}/${id}`);
  } catch {
    throw new Error(`Échec de la suppression du rendez-vous #${id}.`);
  }
};

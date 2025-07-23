import api from './api';
import { User } from '../types';

interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export const updateProfile = async (data: UpdateProfilePayload): Promise<User> => {
  const response = await api.put('/user/profile', data);
  return response.data;
};

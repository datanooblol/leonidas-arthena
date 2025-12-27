import { api } from '../api';
import { LoginRequest, RegisterRequest } from '@/types';

export const authService = {
  login: async (data: LoginRequest) => {
    return await api.post('/auth/login', data);
  },

  register: async (data: RegisterRequest) => {
    return await api.post('/auth/register', data);
  },
};
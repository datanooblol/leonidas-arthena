import { api } from '../api';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export const userService = {
  login: (data: LoginRequest): Promise<AuthResponse> => 
    api.post('/user/login', data),
    
  register: (data: RegisterRequest): Promise<AuthResponse> => 
    api.post('/user/register', data),
};
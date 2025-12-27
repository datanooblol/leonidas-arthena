import { api } from '../api';
import { Task, CreateTaskRequest } from '@/types';

export const taskService = {
  createByExecution: (executionId: string, data: CreateTaskRequest): Promise<any> => 
    api.post(`/task/execution/${executionId}`, data),
    
  getByExecution: (executionId: string): Promise<Task[]> => 
    api.get(`/task/execution/${executionId}`),
    
  getById: (id: string): Promise<Task> => 
    api.get(`/task/${id}`),
    
  delete: (id: string): Promise<any> => 
    api.delete(`/task/${id}`),
};
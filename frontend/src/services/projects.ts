import { api } from '../api';
import { Project, ProjectApiResponse, CreateProjectRequest, UpdateProjectRequest } from '@/types';

export const projectService = {
  getAll: (): Promise<ProjectApiResponse[]> => 
    api.get('/project'),
    
  create: (data: CreateProjectRequest): Promise<any> => 
    api.post('/project', data),
    
  getById: (id: string): Promise<ProjectApiResponse> => 
    api.get(`/project/${id}`),
    
  update: (id: string, data: UpdateProjectRequest): Promise<ProjectApiResponse> => 
    api.put(`/project/${id}`, data),
    
  delete: (id: string): Promise<void> => 
    api.delete(`/project/${id}`),
};
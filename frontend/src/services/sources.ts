import { api } from '../api';
import { Source, CreateSourceRequest, UpdateSourceNameRequest, UpdateSourceSelectionRequest } from '@/types';

export const sourceService = {
  createByProject: (projectId: string, data: CreateSourceRequest): Promise<{source_id: string}> => 
    api.post(`/source/project/${projectId}`, data),
    
  getByProject: (projectId: string): Promise<any[]> => 
    api.get(`/source/project/${projectId}`),
    
  getById: (id: string): Promise<any> => 
    api.get(`/source/${id}`),
    
  delete: (id: string): Promise<void> => 
    api.delete(`/source/${id}`),
    
  updateName: (id: string, sourceName: string): Promise<any> => 
    api.patch(`/source/source-name/${id}`, sourceName),
    
  updateSelection: (id: string, data: UpdateSourceSelectionRequest): Promise<any> => 
    api.patch(`/source/selected/${id}?is_selected=${data.is_selected}`),
    
  getSelectedByProject: (projectId: string): Promise<any[]> => 
    api.get(`/source/project/${projectId}/selected`),
    
  uploadFile: (projectId: string, file: FormData): Promise<{source_id: string}> => {
    // Override content-type for file upload
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/source/project/${projectId}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: file,
    }).then(res => res.json());
  },
};
import { api } from '../api';
import { Reference, CreateReferenceRequest, UpdateReferenceRequest } from '@/types';

export const referenceService = {
  createByConversation: (conversationId: string, data: CreateReferenceRequest): Promise<any> => 
    api.post(`/reference/conversation/${conversationId}`, data),
    
  getByConversation: (conversationId: string): Promise<Reference[]> => 
    api.get(`/reference/conversation/${conversationId}`),
    
  getById: (id: string): Promise<Reference> => 
    api.get(`/reference/${id}`),
    
  update: (id: string, data: UpdateReferenceRequest): Promise<any> => 
    api.put(`/reference/${id}`, data),
    
  delete: (id: string): Promise<any> => 
    api.delete(`/reference/${id}`),
};
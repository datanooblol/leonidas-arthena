import { api } from '../api';
import { Conversation, CreateConversationRequest, UpdateConversationRequest } from '@/types';

export const conversationService = {
  getByChatSession: (chatSessionId: string): Promise<Conversation[]> => 
    api.get(`/conversation/chat-session/${chatSessionId}`),
    
  createByChatSession: (chatSessionId: string, data: CreateConversationRequest): Promise<any> => 
    api.post(`/conversation/chat-session/${chatSessionId}`, data),
    
  getById: (id: string): Promise<Conversation> => 
    api.get(`/conversation/${id}`),
    
  update: (id: string, data: UpdateConversationRequest): Promise<any> => 
    api.put(`/conversation/${id}`, data),
    
  delete: (id: string): Promise<any> => 
    api.delete(`/conversation/${id}`),
};
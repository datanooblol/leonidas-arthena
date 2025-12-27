import { api } from '../api';
import { ChatSession, CreateChatSessionRequest, UpdateChatSessionNameRequest } from '@/types';

export const chatSessionService = {
  createByProject: (projectId: string, data: CreateChatSessionRequest): Promise<any> => 
    api.post(`/chat-session/project/${projectId}`, data),
    
  getByProject: (projectId: string): Promise<ChatSession[]> => 
    api.get(`/chat-session/project/${projectId}`),
    
  getById: (id: string): Promise<ChatSession> => 
    api.get(`/chat-session/${id}`),
    
  updateName: (id: string, sessionName: string): Promise<any> => 
    api.patch(`/chat-session/session-name/${id}?session_name=${encodeURIComponent(sessionName)}`),
    
  clearConversations: (id: string): Promise<any> => 
    api.delete(`/chat-session/${id}/conversations`),
};
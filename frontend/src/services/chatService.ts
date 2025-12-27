import { chatApi, agentApi } from '../chatApi';
import { ChatRequest, ChatResponse } from '@/types';

export const chatService = {
  sendMessage: (data: ChatRequest): Promise<ChatResponse> => 
    chatApi.post('/chat', data),
    
  regenerateResponse: (data: ChatRequest): Promise<ChatResponse> => 
    chatApi.post('/regenerate', data),
    
  editAndRegenerate: (convoId: string, data: ChatRequest): Promise<ChatResponse> => 
    chatApi.patch(`/chat/${convoId}`, data),
    
  healthCheck: (): Promise<{ status: string; message: string }> => 
    chatApi.get('/health'),
};

export const llmService = {
  getAvailableModels: (): Promise<string[]> => 
    agentApi.get('/llm/'),
};

export const visualizeService = {
  createChart: (convoId: string): Promise<any> => 
    chatApi.get(`/visualize/${convoId}`),
};
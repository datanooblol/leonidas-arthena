import { api } from '../api';
import { AgentExecution, CreateAgentExecutionRequest, UpdateExecutionStatusRequest, UpdateExecutionTasksCountRequest } from '@/types';

export const agentExecutionService = {
  createByConversation: (conversationId: string, data?: CreateAgentExecutionRequest): Promise<AgentExecution> => 
    api.post(`/execution/conversation/${conversationId}`, data),
    
  getById: (id: string): Promise<AgentExecution> => 
    api.get(`/execution/${id}`),
    
  delete: (id: string): Promise<void> => 
    api.delete(`/execution/${id}`),
    
  updateStatus: (id: string, status: string): Promise<any> => 
    api.patch(`/execution/${id}/status?status=${status}`),
    
  updateTasksCount: (id: string): Promise<any> => 
    api.patch(`/execution/${id}/tasks-count`),
};
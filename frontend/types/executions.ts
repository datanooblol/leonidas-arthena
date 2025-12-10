export interface AgentExecution {
  id: number;
  conversationId: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  executionId: number;
  name: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentExecutionRequest {
  // No additional fields needed
}

export interface UpdateExecutionStatusRequest {
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface UpdateExecutionTasksCountRequest {
  tasksCount: number;
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
}
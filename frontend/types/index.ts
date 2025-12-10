// Export all types from domain-specific files
export * from './auth';
export * from './projects';
export * from './sources';
export * from './chats';
export * from './references';
export * from './executions';
export * from './api';

// Legacy types for backward compatibility (will be removed later)
export type Role = 'user' | 'assistant';

export interface Message {
  id: number;
  role: Role;
  content: string;
}

export interface Chat {
  id: number;
  projectId: number;
  title: string;
  messages: Message[];
  createdAt: Date;
}
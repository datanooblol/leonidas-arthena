// Export all types from domain-specific files
export * from './auth';
export * from './projects';
export * from './sources';
export * from './chats';
export * from './references';
export * from './executions';
export * from './api';
export * from './metadata';

// Legacy types for backward compatibility (will be removed later)
export type Role = 'user' | 'assistant';

export interface Message {
  id: number;
  role: Role;
  content: string;
  references?: ChatReference[];
}

export interface Chat {
  id: string;
  projectId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
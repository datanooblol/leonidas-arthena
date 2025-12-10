export interface ChatSession {
  id: number;
  projectId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  chatSessionId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatSessionRequest {
  name?: string;
}

export interface UpdateChatSessionNameRequest {
  name: string;
}

export interface CreateConversationRequest {
  role: 'user' | 'assistant';
  content: string;
}

export interface UpdateConversationRequest {
  content: string;
}
export interface ChatSession {
  id: string;
  projectId: string;
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
  chat_session_id: string;
  session_name: string;
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
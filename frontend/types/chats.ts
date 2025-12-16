export interface ChatSession {
  id: string;
  projectId: string;
  name: string;
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

export interface ChatRequest {
  project_id: string;
  chat_session_id: string;
  model_id: string;
  content: string;
  talk_to_data?: boolean;
}

export interface ChatReference {
  reference_id: string;
  type: string;
}

export interface ChatResponse {
  model_id: string;
  role: string;
  content: string;
  references?: ChatReference[];
}

export interface SQLData {
  type: 'sql_data';
  content: {
    columns: string[];
    data: any[][];
  };
}

export interface Conversation {
  created_at: string;
  updated_at: string;
  convo_id: string;
  chat_session_id: string;
  role: 'user' | 'assistant';
  content: string;
  references?: ChatReference[];
}
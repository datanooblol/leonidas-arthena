export interface Reference {
  id: number;
  conversationId: number;
  sourceId: number;
  content: string;
  startIndex?: number;
  endIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferenceRequest {
  sourceId: number;
  content: string;
  startIndex?: number;
  endIndex?: number;
}

export interface UpdateReferenceRequest {
  content?: string;
  startIndex?: number;
  endIndex?: number;
}
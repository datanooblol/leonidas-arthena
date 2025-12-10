export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Metadata {
  id: number;
  sourceId: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMetadataRequest {
  key: string;
  value: string;
}
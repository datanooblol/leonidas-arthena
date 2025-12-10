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

export interface FieldMetadata {
  created_at: string;
  updated_at: string;
  field_id: string;
  source_id: string;
  field_name: string;
  data_type: string;
  input_type: 'id' | 'input' | 'reject';
  description: string;
  sample_values?: string[] | null;
}

export interface MetadataInfo {
  created_at: string;
  updated_at: string;
  metadata_id: string;
  source_id: string;
  table_name: string;
  description: string;
}

export interface MetadataResponse {
  metadata: MetadataInfo;
  fields: FieldMetadata[];
}
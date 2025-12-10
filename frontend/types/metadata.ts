export interface MetadataField {
  created_at: string;
  updated_at: string;
  field_id: string;
  source_id: string;
  field_name: string;
  data_type: string;
  input_type: 'id' | 'input' | 'reject';
  description: string;
  sample_values: string[] | null;
}

export interface Metadata {
  created_at: string;
  updated_at: string;
  metadata_id: string;
  source_id: string;
  table_name: string;
  description: string;
}

export interface MetadataRequest {
  metadata: Metadata;
  fields: MetadataField[];
}

export interface UpdateMetadataRequest extends MetadataRequest {}
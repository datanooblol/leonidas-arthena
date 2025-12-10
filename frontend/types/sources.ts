export interface Source {
  id: string;
  projectId: string;
  title: string;
  type: 'pdf' | 'website' | 'text' | 'file' | 'csv';
  content?: string;
  date: string;
}

export interface CreateSourceRequest {
  source_name: string;
  source_type: 'csv';
  size: number;
  source_path: Record<string, any>;
}

export interface UpdateSourceNameRequest {
  source_name: string;
}

export interface UpdateSourceSelectionRequest {
  is_selected: boolean;
}
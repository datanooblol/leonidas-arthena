export interface Project {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectApiResponse {
  created_at: string;
  updated_at: string;
  project_id: string;
  user_id: string;
  project_name: string;
  project_description: string;
}

export interface CreateProjectRequest {
  project_name: string;
  project_description: string;
}

export interface UpdateProjectRequest {
  project_name?: string;
  project_description?: string;
}
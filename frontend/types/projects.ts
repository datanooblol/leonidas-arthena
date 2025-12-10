export interface Project {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  project_name: string;
  project_description: string;
}

export interface UpdateProjectRequest {
  project_name?: string;
  project_description?: string;
}
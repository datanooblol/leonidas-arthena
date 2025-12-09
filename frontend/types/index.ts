export type Role = 'user' | 'assistant';

export interface Message {
  id: number;
  role: Role;
  content: string;
}

export interface Chat {
  id: number;
  projectId: number; // ✅ เพิ่มบรรทัดนี้
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Source {
  id: number;
  projectId: number; // ✅ เพิ่มบรรทัดนี้
  type: 'pdf' | 'website' | 'text';
  title: string;
  date: string;
  content: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
  lastVisited: number;
  sourceCount: number;
  chatCount: number;
}

export interface User {
  name: string;
  email: string;
}
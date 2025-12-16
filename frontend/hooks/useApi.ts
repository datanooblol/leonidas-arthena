import { useState, useEffect } from 'react';
import { projectService } from '@/lib/services/projects';
import { sourceService } from '@/lib/services/sources';
import { chatSessionService } from '@/lib/services/chat_session';
import { conversationService } from '@/lib/services/conversations';
import { Project, Source, ChatSession, Conversation, ProjectApiResponse } from '@/types';

export const useApi = (projectId?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll();
      const projects = data.map(item => ({
        id: item.project_id,
        title: item.project_name,
        description: item.project_description,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      setProjects(projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Load sources by project
  const loadSources = async (projectId: string) => {
    setIsLoading(true);
    try {
      const data = await sourceService.getByProject(projectId);
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sources');
    } finally {
      setIsLoading(false);
    }
  };

  // Load chat sessions by project
  const loadChatSessions = async (projectId: string) => {
    setIsLoading(true);
    try {
      const data = await chatSessionService.getByProject(projectId);
      setChatSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat sessions');
    } finally {
      setIsLoading(false);
    }
  };

  // Load conversations by chat session
  const loadConversations = async (chatSessionId: string) => {
    setIsLoading(true);
    try {
      const data = await conversationService.getByChatSession(chatSessionId);
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load data when projectId changes
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadSources(projectId);
      loadChatSessions(projectId);
    }
  }, [projectId]);

  return {
    projects,
    sources,
    chatSessions,
    conversations,
    isLoading,
    error,
    loadProjects,
    loadSources,
    loadChatSessions,
    loadConversations,
    setProjects,
    setSources,
    setChatSessions,
    setConversations,
  };
};
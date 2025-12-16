import { useState, useEffect, useMemo } from 'react';
import { Project, Chat, Source, Message } from '@/types';
import { projectService } from '@/lib/services/projects';
import { sourceService } from '@/lib/services/sources';
import { chatSessionService } from '@/lib/services/chat_session';
import { conversationService } from '@/lib/services/conversations';
import { chatService, llmService } from '@/lib/services/chatService';

export const useNotebookApp = (currentProjectId?: string) => {
  
  // --- Global State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState({ id: 1, name: 'User', email: 'user@example.com' });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [allSources, setAllSources] = useState<Source[]>([]);

  // --- Local UI State ---
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeSourceIds, setActiveSourceIds] = useState<string[]>([]);
  const [isSourceMode, setIsSourceMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');

  // =========================================
  // LOAD DATA
  // =========================================
  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await projectService.getAll();
        setProjects(projectsData.map(p => ({
          id: p.project_id,
          title: p.project_name,
          description: p.project_description,
          createdAt: p.created_at,
          updatedAt: 'Recently',
          lastVisited: Date.now(),
          sourceCount: 0,
          chatCount: 0
        })));
        
        if (currentProjectId) {
          const [projectData, sourcesData, chatsData] = await Promise.all([
            projectService.getById(currentProjectId),
            sourceService.getByProject(currentProjectId),
            chatSessionService.getByProject(currentProjectId)
          ]);
          
          setCurrentProject({
            id: projectData.project_id,
            title: projectData.project_name,
            description: projectData.project_description,
            createdAt: projectData.created_at,
            updatedAt: projectData.updated_at
          });
          
          setAllSources(sourcesData.map(s => ({
            id: s.source_id || '0',
            projectId: currentProjectId,
            type: s.source_type === 'CSV' ? 'csv' : 'text',
            title: s.source_name,
            date: 'Recently',
            content: 'Source content'
          })));
          
          setActiveSourceIds(sourcesData.filter(s => s.is_selected).map(s => s.source_id || '0'));
          
          setAllChats(chatsData.map(c => ({
            id: c.chat_session_id,
            projectId: currentProjectId,
            title: c.session_name,
            messages: [],
            createdAt: new Date(c.created_at || new Date())
          })));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        // Load available models
        try {
          const models = await llmService.getAvailableModels();
          setAvailableModels(models);
          if (models.length > 0 && !models.includes(selectedModel)) {
            setSelectedModel(models[0]);
          }
        } catch (error) {
          console.error('Failed to load models:', error);
          setAvailableModels(['gpt-4']); // fallback
        }
        
        setIsInitialized(true);
      }
    };
    
    loadData();
  }, [currentProjectId]);

  // Load conversations when chat is selected
  useEffect(() => {
    const loadConversations = async () => {
      if (!activeChatId) return;
      
      try {
        const conversations = await conversationService.getByChatSession(activeChatId);
        const messages: Message[] = conversations.map(c => ({
          id: c.convo_id,
          created_at: c.created_at,
          updated_at: c.updated_at,
          convo_id: c.convo_id,
          chat_session_id: c.chat_session_id,
          role: c.role as 'user' | 'assistant',
          content: c.content,
          references: c.references
        }));
        
        setAllChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages }
            : chat
        ));
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };
    
    loadConversations();
  }, [activeChatId]);



  // =========================================
  // COMPUTE & FILTER DATA
  // =========================================
  const projectsWithStats = useMemo(() => {
    return projects.map(p => ({
      ...p,
      chatCount: allChats.filter(c => c.projectId === p.id).length,
      sourceCount: allSources.filter(s => s.projectId === p.id).length
    }));
  }, [projects, allChats, allSources]);

  const chats = useMemo(() => {
    if (!currentProjectId) return [];
    return allChats.filter(c => c.projectId === currentProjectId);
  }, [allChats, currentProjectId]);

  const sources = useMemo(() => {
    if (!currentProjectId) return [];
    return allSources.filter(s => s.projectId === currentProjectId);
  }, [allSources, currentProjectId]);

  // =========================================
  // ACTIONS
  // =========================================
  
  const createProject = async (title: string, description: string) => {
    try {
      const response = await projectService.create({
        project_name: title,
        project_description: description
      });
      
      const newProject: Project = {
        id: response.project_id,
        title,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: 'Just now'
      };
      
      setProjects(prev => [newProject, ...prev]);
      return response.project_id;
    } catch (error) {
      console.error('Failed to create project:', error);
      return '';
    }
  };

  const updateProject = async (id: string, updates: { title?: string; description?: string }) => {
    try {
      const currentProject = projects.find(p => p.id === id);
      if (!currentProject) return;
      
      const updateData = {
        project_name: updates.title ?? currentProject.title,
        project_description: updates.description ?? currentProject.description
      };
      
      await projectService.update(id, updateData);
      
      setProjects(prev => prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              ...(updates.title !== undefined && { title: updates.title }),
              ...(updates.description !== undefined && { description: updates.description })
            }
          : p
      ));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const renameProject = (id: string, newTitle: string) => {
    updateProject(id, { title: newTitle });
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setAllChats(prev => prev.filter(c => c.projectId !== id));
      setAllSources(prev => prev.filter(s => s.projectId !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const updateProjectLastVisited = (id: string) => {
    setProjects(prev => {
        const target = prev.find(p => p.id === id);
        if (!target) return prev;
        const updatedProject = { ...target, lastVisited: Date.now() };
        return [updatedProject, ...prev.filter(p => p.id !== id)];
    });
  };

  const addSource = async (newSourceData: Omit<Source, 'projectId'>) => {
    if (!currentProjectId) return;
    
    try {
      const response = await sourceService.createByProject(currentProjectId, {
        source_name: newSourceData.title,
        source_type: 'csv',
        size: 0,
        source_path: {}
      });
      
      const newSource: Source = {
        id: response.source_id,
        projectId: currentProjectId,
        type: newSourceData.type,
        title: newSourceData.title,
        date: 'Just now',
        content: newSourceData.content
      };
      
      setAllSources(prev => [newSource, ...prev]);
      setActiveSourceIds(prev => [newSource.id, ...prev]);
    } catch (error) {
      console.error('Failed to add source:', error);
    }
  };

  const renameSource = async (id: string, newTitle: string) => {
    try {
      await sourceService.updateName(id, newTitle);
      setAllSources(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    } catch (error) {
      console.error('Failed to rename source:', error);
    }
  };

  const deleteSource = async (id: string) => {
    try {
      await sourceService.delete(id);
      setAllSources(prev => prev.filter(s => s.id !== id));
      setActiveSourceIds(prev => prev.filter(sid => sid !== id));
    } catch (error) {
      console.error('Failed to delete source:', error);
    }
  };

  const toggleSourceSelection = async (id: string, isSelected: boolean) => {
    try {
      await sourceService.updateSelection(id, { is_selected: isSelected });
      if (isSelected) {
        setActiveSourceIds(prev => [...prev, id]);
      } else {
        setActiveSourceIds(prev => prev.filter(sid => sid !== id));
      }
    } catch (error) {
      console.error('Failed to update source selection:', error);
    }
  };

  // --- Chat Actions ---

  const sendChatMessage = async (userText: string, currentChatId: string) => {
    if (!currentProjectId) return;
    
    // Add user message immediately
    const userMessage: Message = {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      convo_id: Date.now().toString(),
      chat_session_id: currentChatId,
      role: 'user',
      content: userText
    };
    
    setAllChats(prev => {
      const chatIndex = prev.findIndex(c => c.id === currentChatId);
      if (chatIndex === -1) return prev;
      
      const chat = prev[chatIndex];
      const updatedChat = { ...chat, messages: [...chat.messages, userMessage] };
      
      const otherChats = prev.filter(c => c.id !== currentChatId);
      return [updatedChat, ...otherChats];
    });
    
    setIsLoading(true);
    try {
      const chatRequest = {
        project_id: currentProjectId,
        chat_session_id: currentChatId,
        model_id: selectedModel,
        content: userText,
        talk_to_data: isSourceMode
      };
      
      await chatService.sendMessage(chatRequest);
      
      // Reload conversations from memory service
      const conversations = await conversationService.getByChatSession(currentChatId);
      const messages: Message[] = conversations.map((c, index) => ({
        id: index,
        role: c.role as 'user' | 'assistant',
        convo_id: c.convo_id,
        content: c.content,
        references: c.references,
        created_at: c.created_at,
        updated_at: c.updated_at,
        chat_session_id: c.chat_session_id
      }));


      
      setAllChats(prev => {
        const chatIndex = prev.findIndex(c => c.id === currentChatId);
        if (chatIndex === -1) return prev;
        
        const chat = prev[chatIndex];
        const updatedChat = { ...chat, messages };
        
        const otherChats = prev.filter(c => c.id !== currentChatId);
        return [updatedChat, ...otherChats];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!currentProjectId) return;
    
    try {
      const response = await chatSessionService.createByProject(currentProjectId, {
        chat_session_id: '',
        session_name: 'New Chat'
      });
      
      const newChat: Chat = {
        id: response.chat_session_id,
        projectId: currentProjectId,
        title: 'New Chat',
        messages: [],
        createdAt: new Date()
      };
      
      setAllChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatId || !text.trim()) return;
    
    // Update title if first message
    setAllChats(prev => {
      const chatIndex = prev.findIndex(c => c.id === activeChatId);
      if (chatIndex === -1) return prev;
      
      const chat = prev[chatIndex];
      const updatedTitle = chat.messages.length === 0 ? text.slice(0, 30) : chat.title;
      const updatedChat = { ...chat, title: updatedTitle };
      
      const otherChats = prev.filter(c => c.id !== activeChatId);
      return [updatedChat, ...otherChats];
    });

    await sendChatMessage(text, activeChatId);
  };

  const handleEditMessage = async (msgId: number, newContent: string) => {
    if (!activeChatId) return;

    // For now, just send new message (edit functionality can be enhanced later)
    await sendChatMessage(newContent, activeChatId);
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      //console.log('Calling API to rename chat:', { chatId, newTitle });
      await chatSessionService.updateName(chatId, newTitle);
      setAllChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
      //console.log('Chat renamed successfully');
    } catch (error) {
      //console.error('Failed to rename chat:', error);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setAllChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const handleClearChat = async (chatId: string) => {
    try {
      await chatSessionService.clearConversations(chatId);
      setAllChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, messages: [] } : c
      ));
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return {
    projects: projectsWithStats, user, setUser, currentProject,
    chats, sources,
    activeChatId, setActiveChatId,
    activeSourceIds, setActiveSourceIds,
    isSourceMode, setIsSourceMode,
    isLoading, isInitialized,
    createProject, updateProject, renameProject, deleteProject, updateProjectLastVisited,
    createNewChat, handleSendMessage, handleEditMessage, handleRenameChat, handleDeleteChat, handleClearChat,
    addSource, renameSource, deleteSource, toggleSourceSelection,
    clearAllData,
    availableModels,
    selectedModel,
    setSelectedModel
  };
};
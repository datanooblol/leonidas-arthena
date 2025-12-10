import { useState, useEffect, useMemo } from 'react';
import { Project, Chat, Source, Message } from '@/types';
import { projectService } from '@/lib/services/projects';
import { sourceService } from '@/lib/services/sources';
import { chatSessionService } from '@/lib/services/chat_session';
import { conversationService } from '@/lib/services/conversations';

export const useNotebookApp = (currentProjectId?: string) => {
  
  // --- Global State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com' });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [allSources, setAllSources] = useState<Source[]>([]);

  // --- Local UI State ---
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeSourceIds, setActiveSourceIds] = useState<string[]>([]);
  const [isSourceMode, setIsSourceMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
            id: c.chat_session_id || '0',
            projectId: currentProjectId,
            title: c.session_name,
            messages: [],
            createdAt: new Date()
          })));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadData();
  }, [currentProjectId]);



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
        updatedAt: 'Just now',
        lastVisited: Date.now(),
        sourceCount: 0,
        chatCount: 0
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

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setAllChats(prev => prev.filter(c => c.projectId !== id));
    setAllSources(prev => prev.filter(s => s.projectId !== id));
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
      await sourceService.updateName(id, { source_name: newTitle });
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

  const simulateAIResponse = (userText: string, currentChatId: string) => {
    setIsLoading(true);
    setTimeout(() => {
        const aiMsg: Message = { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: `AI Answer regarding "${userText}" using ${isSourceMode ? activeSourceIds.length + ' sources' : 'general knowledge'}.` 
        };
        
        setAllChats(prev => {
            const chatIndex = prev.findIndex(c => c.id === currentChatId);
            if (chatIndex === -1) return prev;

            const chat = prev[chatIndex];
            const updatedChat = { ...chat, messages: [...chat.messages, aiMsg] };
            
            // ✅ ย้ายแชทที่ AI ตอบล่าสุดมาไว้บนสุด
            const otherChats = prev.filter(c => c.id !== currentChatId);
            return [updatedChat, ...otherChats];
        });
        
        setIsLoading(false);
    }, 1000);
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

  const handleSendMessage = (text: string) => {
    if (!activeChatId || !text.trim()) return;
    
    const newMessage: Message = { id: Date.now(), role: 'user', content: text };
    setIsLoading(true);

    setAllChats(prev => {
        const chatIndex = prev.findIndex(c => c.id === activeChatId);
        if (chatIndex === -1) return prev;

        const chat = prev[chatIndex];
        const updatedTitle = chat.messages.length === 0 ? text.slice(0, 30) : chat.title;
        const updatedChat = { ...chat, title: updatedTitle, messages: [...chat.messages, newMessage] };
        
        // ✅ ย้ายแชทที่เพิ่งส่งข้อความมาไว้บนสุด
        const otherChats = prev.filter(c => c.id !== activeChatId);
        return [updatedChat, ...otherChats];
    });

    simulateAIResponse(text, activeChatId);
  };

  const handleEditMessage = (msgId: number, newContent: string) => {
    if (!activeChatId) return;

    setAllChats(prev => {
        const chatIndex = prev.findIndex(c => c.id === activeChatId);
        if (chatIndex === -1) return prev;
        const chat = prev[chatIndex];

        const msgIndex = chat.messages.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return prev;

        const newMessages = chat.messages.slice(0, msgIndex);
        newMessages.push({ ...chat.messages[msgIndex], content: newContent });

        const updatedChat = { ...chat, messages: newMessages };

        // ✅ ย้ายแชทที่มีการแก้ไขมาไว้บนสุด
        const otherChats = prev.filter(c => c.id !== activeChatId);
        return [updatedChat, ...otherChats];
    });

    simulateAIResponse(newContent, activeChatId);
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
    createNewChat, handleSendMessage, handleEditMessage, handleRenameChat, handleDeleteChat,
    addSource, renameSource, deleteSource, toggleSourceSelection,
    clearAllData
  };
};
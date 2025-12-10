import { useState, useEffect, useMemo } from 'react';
import { Project, Chat, Source, Message } from '@/types';
import { projectService } from '@/lib/services/projects';
import { sourceService } from '@/lib/services/sources';
import { chatSessionService } from '@/lib/services/chat_session';
import { conversationService } from '@/lib/services/conversations';

export const useNotebookApp = (currentProjectId?: number) => {
  
  // --- Global State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com' });
  
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [allSources, setAllSources] = useState<Source[]>([]);

  // --- Local UI State ---
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [activeSourceIds, setActiveSourceIds] = useState<number[]>([]);
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
          id: parseInt(p.project_id || '0'),
          title: p.project_name,
          description: p.project_description,
          updatedAt: 'Recently',
          lastVisited: Date.now(),
          sourceCount: 0,
          chatCount: 0
        })));
        
        if (currentProjectId) {
          const [sourcesData, chatsData] = await Promise.all([
            sourceService.getByProject(currentProjectId),
            chatSessionService.getByProject(currentProjectId)
          ]);
          
          setAllSources(sourcesData.map(s => ({
            id: parseInt(s.source_id || '0'),
            projectId: currentProjectId,
            type: s.source_type === 'CSV' ? 'csv' : 'text',
            title: s.source_name,
            date: 'Recently',
            content: 'Source content'
          })));
          
          setAllChats(chatsData.map(c => ({
            id: parseInt(c.chat_session_id || '0'),
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
        id: parseInt(response.project_id),
        title,
        description,
        updatedAt: 'Just now',
        lastVisited: Date.now(),
        sourceCount: 0,
        chatCount: 0
      };
      
      setProjects(prev => [newProject, ...prev]);
      return parseInt(response.project_id);
    } catch (error) {
      console.error('Failed to create project:', error);
      return 0;
    }
  };

  const renameProject = (id: number, newTitle: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, title: newTitle } : p));
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setAllChats(prev => prev.filter(c => c.projectId !== id));
    setAllSources(prev => prev.filter(s => s.projectId !== id));
  };

  const updateProjectLastVisited = (id: number) => {
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
        source_type: newSourceData.type === 'csv' ? 'CSV' : 'TEXT',
        size: 0,
        source_path: {}
      });
      
      const newSource: Source = {
        id: parseInt(response.source_id),
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

  const renameSource = (id: number, newTitle: string) => {
    setAllSources(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const deleteSource = (id: number) => {
    setAllSources(prev => prev.filter(s => s.id !== id));
    setActiveSourceIds(prev => prev.filter(sid => sid !== id));
  };

  // --- Chat Actions ---

  const simulateAIResponse = (userText: string, currentChatId: number) => {
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
        id: parseInt(response.chat_session_id),
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

  const handleRenameChat = (chatId: number, newTitle: string) => {
    setAllChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
  };

  const handleDeleteChat = (chatId: number) => {
    setAllChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return {
    projects: projectsWithStats, user, setUser,
    chats, sources,
    activeChatId, setActiveChatId,
    activeSourceIds, setActiveSourceIds,
    isSourceMode, setIsSourceMode,
    isLoading, isInitialized,
    createProject, renameProject, deleteProject, updateProjectLastVisited,
    createNewChat, handleSendMessage, handleEditMessage, handleRenameChat, handleDeleteChat,
    addSource, renameSource, deleteSource,
    clearAllData
  };
};
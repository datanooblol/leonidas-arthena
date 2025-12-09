import { useState, useEffect, useMemo } from 'react';
import { Project, Chat, Source, Message } from '@/types';
import { INITIAL_PROJECTS, INITIAL_SOURCES } from '@/lib/constants';

const STORAGE_KEYS = {
  PROJECTS: 'notebook_projects',
  CHATS: 'notebook_chats',
  SOURCES: 'notebook_sources',
  ACTIVE_CHAT: 'notebook_active_chat_id'
};

export const useNotebookApp = (currentProjectId?: number) => {
  
  // --- Global State ---
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [user, setUser] = useState({ name: 'Dev User', email: 'dev@example.com' });
  
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [allSources, setAllSources] = useState<Source[]>(INITIAL_SOURCES);

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
    const loadData = setTimeout(() => {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (savedChats) setAllChats(JSON.parse(savedChats));

      const savedSources = localStorage.getItem(STORAGE_KEYS.SOURCES);
      if (savedSources) setAllSources(JSON.parse(savedSources));
      else setAllSources(INITIAL_SOURCES);

      const savedActiveChat = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT);
      if (savedActiveChat) setActiveChatId(Number(savedActiveChat));

      setIsInitialized(true);
    }, 0);

    return () => clearTimeout(loadData);
  }, []);

  // =========================================
  // SAVE DATA
  // =========================================
  useEffect(() => { if (!isInitialized) return; localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); }, [projects, isInitialized]);
  useEffect(() => { if (!isInitialized) return; localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats)); }, [allChats, isInitialized]);
  useEffect(() => { if (!isInitialized) return; localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(allSources)); }, [allSources, isInitialized]);
  useEffect(() => { if (!isInitialized) return; if (activeChatId) localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT, String(activeChatId)); }, [activeChatId, isInitialized]);

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
  
  const createProject = (title: string, description: string) => {
    const newId = Date.now();
    const newProject: Project = {
      id: newId,
      title,
      description,
      updatedAt: 'Just now',
      lastVisited: Date.now(),
      sourceCount: 0,
      chatCount: 0
    };
    setProjects(prev => [newProject, ...prev]);
    return newId;
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

  const addSource = (newSourceData: Omit<Source, 'projectId'>) => {
      if (!currentProjectId) return;
      const newSource: Source = { ...newSourceData, projectId: currentProjectId };
      setAllSources(prev => [newSource, ...prev]);
      setActiveSourceIds(prev => [newSource.id, ...prev]);
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

  const createNewChat = () => {
    if (!currentProjectId) return;
    const newChat: Chat = { id: Date.now(), projectId: currentProjectId, title: 'New Chat', messages: [], createdAt: new Date() };
    setAllChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
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
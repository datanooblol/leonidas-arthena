'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Files, Bot } from 'lucide-react';

// Direct Imports
import { ProjectTemplate } from '../templates/ProjectTemplate';
import { Navbar } from '../organisms/Navbar';
import { Sidebar } from '../organisms/Sidebar';
import { ChatInterface } from '../organisms/ChatInterface';
import { SourceManager } from '../organisms/SourceManager';
import { SourceViewerModal } from '../organisms/SourceViewerModal';
import { AddSourceModalContent } from '../organisms/AddSourceModalContent';
import { Modal } from '../molecules/Modal';
import { AlertDialog } from '../molecules/AlertDialog';
import { Toast } from '../molecules/Toast';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

// Hooks & Types
import { useNotebookApp } from '@/hooks/useNotebookApp';
import { Source } from '@/types';

interface ProjectWorkspaceProps {
  projectId: number;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId }) => {
  const router = useRouter();
  
  const { 
    user, projects, activeChatId, setActiveChatId, chats, sources, addSource, activeSourceIds, setActiveSourceIds, 
    createNewChat, handleSendMessage, handleEditMessage, handleRenameChat, handleDeleteChat, 
    isSourceMode, setIsSourceMode, isLoading, isInitialized
  } = useNotebookApp(projectId);

  const currentProject = projects.find(p => p.id === projectId);
  
  // =========================================
  // 1. STATES
  // =========================================
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'context'|'history'>('context');
  const [rightTab, setRightTab] = useState<'chat'|'sources'>('sources'); 
  const [input, setInput] = useState('');
  
  // Modal States
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [viewingSource, setViewingSource] = useState<Source | null>(null);
  const [chatToRename, setChatToRename] = useState<{ id: number; title: string } | null>(null);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  
  // Logic States
  const [toast, setToast] = useState({ show: false, message: '' });
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // =========================================
  // 2. EFFECTS
  // =========================================

  // ✅ แก้ไข: ใช้ setTimeout เพื่อแก้ปัญหา setState in effect
  useEffect(() => {
    if (isInitialized && !hasAutoOpened && sources.length === 0) {
      // ย้ายไปทำงานใน Next Tick เพื่อไม่ให้ขัดจังหวะการ Render รอบปัจจุบัน
      const timer = setTimeout(() => {
        setIsAddSourceOpen(true);
        setHasAutoOpened(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, sources.length, hasAutoOpened]);

  // Auto open sidebar on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      // ใช้ setTimeout แบบเดียวกันเพื่อความปลอดภัย
      const timer = setTimeout(() => {
        setIsSidebarOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // =========================================
  // 3. HANDLERS & RENDER
  // =========================================

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ show: true, message: 'Copied to clipboard' });
  };

  return (
    <ProjectTemplate
      navbar={
        <Navbar 
          user={user} 
          title={currentProject ? currentProject.title : "Loading..."} 
          onLogout={() => router.push('/')} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onTitleClick={() => setIsProjectInfoOpen(true)}
        />
      }
      sidebar={
        <Sidebar 
           isOpen={isSidebarOpen} 
           toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
           activeTab={activeTab} setActiveTab={setActiveTab}
           sources={sources} activeSourceIds={activeSourceIds}
           chats={chats} activeChatId={activeChatId}
           onSelectChat={(id) => { 
             setActiveChatId(id); 
             setRightTab('chat'); 
             setInput('');
             if (window.innerWidth < 768) setIsSidebarOpen(false);
           }}
           onCreateChat={() => { createNewChat(); setInput(''); }}
           onRenameChat={(id) => {
             const chat = chats.find(c => c.id === id);
             if (chat) setChatToRename({ id: chat.id, title: chat.title });
           }}
           onDeleteChat={(id) => setChatToDelete(id)}
           onViewSource={setViewingSource}
        />
      }
    >
      {/* Main Content Area */}
      <div className="flex justify-center border-b border-border bg-bg-surface-2 shrink-0">
          <div className="flex w-full max-w-md">
              <button onClick={() => setRightTab('sources')} className={`flex-1 py-3 text-sm font-medium border-b-2 flex gap-2 justify-center transition-colors cursor-pointer ${rightTab === 'sources' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}><Files size={16}/> Sources</button>
              <button onClick={() => setRightTab('chat')} className={`flex-1 py-3 text-sm font-medium border-b-2 flex gap-2 justify-center transition-colors cursor-pointer ${rightTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}><Bot size={16}/> Chat</button>
          </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
          {rightTab === 'chat' ? (
              <ChatInterface 
                activeChat={activeChat}
                input={input} setInput={setInput}
                onSendMessage={() => { handleSendMessage(input); setInput(''); }}
                onEditMessage={handleEditMessage}
                onCopyMessage={handleCopyMessage}
                isSourceMode={isSourceMode}
                toggleSourceMode={() => setIsSourceMode(!isSourceMode)}
                sourceCount={activeSourceIds.length}
                onCreateNewChat={createNewChat}
                isLoading={isLoading}
              />
          ) : (
              <SourceManager 
                sources={sources}
                onOpenModal={() => setIsAddSourceOpen(true)}
                selectedIds={activeSourceIds}
                onToggleSelect={(id) => setActiveSourceIds(prev => prev.includes(id) ? prev.filter(x => x!==id) : [...prev, id])}
                onToggleAll={(ids) => {
                    const allSelected = ids.every(id => activeSourceIds.includes(id));
                    if (allSelected) setActiveSourceIds(prev => prev.filter(id => !ids.includes(id)));
                    else setActiveSourceIds(prev => [...new Set([...prev, ...ids])]);
                }}
                onViewSource={setViewingSource}
              />
          )}
      </div>

      {/* --- Global Modals --- */}
      
      {/* Project Details Modal */}
      <Modal isOpen={isProjectInfoOpen} onClose={() => setIsProjectInfoOpen(false)} title="Project Details">
         <div className="p-6 space-y-4">
            <div>
               <label className="text-xs font-medium text-text-secondary">Project Name</label>
               <p className="text-lg font-medium text-text-main mt-1">{currentProject?.title}</p>
            </div>
            <div>
               <label className="text-xs font-medium text-text-secondary">Description</label>
               <p className="text-sm text-text-main mt-1 leading-relaxed bg-bg-surface-2 p-3 rounded-xl">
                  {currentProject?.description || "No description provided."}
               </p>
            </div>
            <div className="pt-4 flex justify-end">
               <Button onClick={() => setIsProjectInfoOpen(false)}>Close</Button>
            </div>
         </div>
      </Modal>

      {/* Rename Chat Modal */}
      <Modal isOpen={!!chatToRename} onClose={() => setChatToRename(null)} title="Rename Chat">
         <div className="p-6 space-y-4">
            <Input value={chatToRename?.title || ''} onChange={(e) => setChatToRename(prev => prev ? { ...prev, title: e.target.value } : null)} autoFocus />
            <div className="flex justify-end gap-3 mt-6">
               <Button variant="ghost" onClick={() => setChatToRename(null)}>Cancel</Button>
               <Button onClick={() => { if (chatToRename?.title.trim()) { handleRenameChat(chatToRename.id, chatToRename.title); setChatToRename(null); }}}>Save</Button>
            </div>
         </div>
      </Modal>

      {/* Delete Chat Alert */}
      <AlertDialog isOpen={!!chatToDelete} onClose={() => setChatToDelete(null)} onConfirm={() => { if (chatToDelete) { handleDeleteChat(chatToDelete); setChatToDelete(null); }}} title="Delete Chat?" description="This action cannot be undone." confirmText="Delete" isDestructive />

      {/* Add Source Modal */}
      <Modal isOpen={isAddSourceOpen} onClose={() => setIsAddSourceOpen(false)} title="Add sources">
        <AddSourceModalContent onClose={() => setIsAddSourceOpen(false)} onAddSource={addSource} projectId={projectId} />
      </Modal>

      {/* View Source Modal */}
      <SourceViewerModal source={viewingSource} isOpen={!!viewingSource} onClose={() => setViewingSource(null)} />
      
      {/* Toast */}
      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </ProjectTemplate>
  );
};
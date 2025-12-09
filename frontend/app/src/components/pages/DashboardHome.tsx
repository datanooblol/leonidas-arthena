'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';

// Direct Imports
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { Navbar } from '../organisms/Navbar';
import { ProjectCard } from '../molecules/ProjectCard';
import { AlertDialog } from '../molecules/AlertDialog';
import { Modal } from '../molecules/Modal';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { TextArea } from '../atoms/TextArea';

// Hooks
import { useNotebookApp } from '@/hooks/useNotebookApp';

export const DashboardHome: React.FC = () => {
  const router = useRouter();
  
  // ✅ ใช้ Hook แทน useState ธรรมดา
  const { projects, user, createProject, renameProject, deleteProject } = useNotebookApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [renameData, setRenameData] = useState<{ id: number; title: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // -- Handlers --
  const handleCreateProject = () => {
    if (!newTitle.trim()) return;
    
    // ✅ 1. สร้างโปรเจคและรับ ID กลับมา (จาก Hook ที่เราแก้ไป)
    const newProjectId = createProject(newTitle, newDescription);
    
    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setIsCreateModalOpen(false);

    // ✅ 2. นำทางไปโปรเจคใหม่ทันที
    router.push(`/dashboard/${newProjectId}`);
  };

  const handleRenameProject = () => {
    if (renameData && renameData.title.trim()) {
      renameProject(renameData.id, renameData.title);
      setRenameData(null);
    }
  };

  const handleDeleteProject = () => {
    if (deleteId) {
      deleteProject(deleteId);
      setDeleteId(null);
    }
  };

  const handleNavigate = (projectId: number) => {
    router.push(`/dashboard/${projectId}`);
  };

  const filteredProjects = projects
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.lastVisited - a.lastVisited);

  return (
    <DashboardTemplate
      navbar={<Navbar user={user} onLogout={() => router.push('/')} />}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-medium text-text-main">My Notebooks</h2>
            <p className="text-text-secondary text-sm mt-1">Manage your research projects and AI conversations</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>New Notebook</Button>
        </div>
        <div className="w-full md:max-w-md">
          <Input 
            placeholder="Search notebooks..." 
            icon={Search} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <ProjectCard isNewCard onClick={() => setIsCreateModalOpen(true)} />
         {filteredProjects.map((project) => (
           <ProjectCard
             key={project.id}
             project={project}
             onClick={() => handleNavigate(project.id)}
             onRename={() => setRenameData({ id: project.id, title: project.title })}
             onDelete={() => setDeleteId(project.id)}
           />
         ))}
      </div>

      {/* --- Modals --- */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Notebook">
        <div className="p-6 space-y-4">
          <Input 
            label="Title" 
            placeholder="e.g. Thesis Research" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            autoFocus 
          />
          <TextArea 
            label="Description" 
            placeholder="What is this notebook about?" 
            value={newDescription} 
            onChange={(e) => setNewDescription(e.target.value)} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!renameData} onClose={() => setRenameData(null)} title="Rename Notebook">
        <div className="p-6 space-y-4">
          <Input 
            label="Title" 
            value={renameData?.title || ''} 
            onChange={(e) => setRenameData(prev => prev ? { ...prev, title: e.target.value } : null)} 
            autoFocus 
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setRenameData(null)}>Cancel</Button>
            <Button onClick={handleRenameProject}>Save</Button>
          </div>
        </div>
      </Modal>

      <AlertDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDeleteProject} 
        title="Delete Notebook?" 
        description="This action cannot be undone." 
        confirmText="Delete" 
        isDestructive 
      />
    </DashboardTemplate>
  );
};
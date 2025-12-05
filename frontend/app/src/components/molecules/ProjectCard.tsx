import React from 'react';
import { MoreVertical, Edit2, Trash2, Clock, MessageSquare, Files, Plus } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { Project } from '@/types';

interface ProjectCardProps {
  project?: Project;
  onClick: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  isNewCard?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onRename, onDelete, isNewCard }) => {
  
  // --- กรณี 1: การ์ดสร้างโปรเจคใหม่ (New Notebook) ---
  if (isNewCard) {
    return (
      <div 
        onClick={onClick}
        className="h-64 rounded-2xl border border-dashed border-border bg-bg-element/30 hover:bg-bg-element/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group hover:border-primary/50"
      >
        <div className="p-4 rounded-full bg-bg-element group-hover:bg-primary transition-colors mb-3 shadow-sm">
          <Plus className="w-6 h-6 text-text-secondary group-hover:text-white transition-colors" />
        </div>
        <span className="text-sm text-text-secondary group-hover:text-text-main font-medium">
          New Notebook
        </span>
      </div>
    );
  }

  // --- กรณี 2: การ์ดโปรเจคที่มีอยู่แล้ว ---
  if (!project) return null;

  return (
    <div 
      onClick={onClick}
      className="h-64 rounded-2xl bg-linear-to-br from-bg-surface to-bg-surface-2 border border-border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/30"
    >
      {/* Header: Icon & Menu */}
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
           <span className="text-primary font-bold text-lg">
             {project.title.charAt(0).toUpperCase()}
           </span>
        </div>
        
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown 
            trigger={
              <button className="text-text-secondary hover:text-text-main hover:bg-bg-element p-1 rounded-md transition-colors cursor-pointer">
                <MoreVertical size={16} />
              </button>
            }
            items={[
              { label: 'Rename', icon: Edit2, onClick: onRename || (() => {}) },
              { label: 'Delete', icon: Trash2, danger: true, onClick: onDelete || (() => {}) }
            ]}
          />
        </div>
      </div>
      
      {/* Body: Title & Description */}
      <div className="flex-1 mt-3 mb-2 min-h-0 overflow-hidden">
        <h3 className="font-medium text-lg text-text-main mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Footer: Stats & Time */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-text-secondary mt-auto">
         <div className="flex gap-3">
            <span className="flex items-center gap-1" title="Sources">
              <Files size={12} /> {project.sourceCount}
            </span>
            <span className="flex items-center gap-1" title="Chats">
              <MessageSquare size={12} /> {project.chatCount}
            </span>
         </div>
         <span className="flex items-center gap-1">
           <Clock size={12} /> {project.updatedAt}
         </span>
      </div>
    </div>
  );
};
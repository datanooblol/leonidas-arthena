'use client';
import React from 'react';
import { X, FileText, Link as LinkIcon } from 'lucide-react';
import { Source } from '@/types';

interface SourceViewerModalProps {
  source: Source | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({ source, isOpen, onClose }) => {
  if (!isOpen || !source) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div 
        className="
          bg-bg-surface w-full max-w-3xl h-[85vh] 
          rounded-2xl border border-border shadow-2xl 
          overflow-hidden flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-bg-surface-2 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="p-2 rounded-lg bg-bg-element text-primary shrink-0">
                {source.type === 'pdf' ? <FileText size={20} /> : <LinkIcon size={20} />}
             </div>
             <div className="min-w-0">
                <h3 className="text-lg font-medium text-text-main truncate">
                  {source.title}
                </h3>
                <p className="text-xs text-text-secondary uppercase">
                  {source.type} • {source.date}
                </p>
             </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-main p-2 rounded-full hover:bg-bg-element transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-main custom-scrollbar">
           <div className="max-w-2xl mx-auto prose prose-sm md:prose-base dark:prose-invert">
             <p className="text-text-main leading-relaxed whitespace-pre-wrap">
               {source.content || "No content preview available."}
             </p>
             
             <div className="my-8 h-px bg-border"></div>
             
             <p className="text-text-secondary text-sm italic">
               End of source preview.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};
'use client';
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div 
        className="bg-bg-surface w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:px-6 border-b border-border shrink-0 bg-bg-surface">
          <h3 className="text-lg font-medium text-text-main line-clamp-1">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-main transition-colors rounded-full p-1.5 hover:bg-bg-element cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
'use client';
import React, { useState, useRef } from 'react';
import { Upload, UploadCloud, Link as LinkIcon, FileText } from 'lucide-react';
import { Source } from '@/types';
import { sourceService } from '@/lib/services/sources';

interface AddSourceModalContentProps {
  onClose: () => void;
  projectId: string;
  onAddSource: (source: Source) => void;
}

export const AddSourceModalContent: React.FC<AddSourceModalContentProps> = ({ onClose, projectId, onAddSource }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const fileType = file.type.includes('pdf') ? 'pdf' : 'text';
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await sourceService.uploadFile(projectId, formData);
      
      const newSource: Source = {
        id: response.source_id,
        projectId: projectId,
        type: fileType,
        title: file.name,
        date: 'Just now',
        content: `Uploaded file: ${file.name}`
      };

      onAddSource(newSource);
      onClose();
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  // ... (Code ส่วน Drag & Drop เหมือนเดิม ไม่ต้องแก้) ...
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFile(files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ... (UI ส่วนเดิม) ... */}
      <div className="px-6 pt-4 pb-2 shrink-0">
        <p className="text-sm text-text-secondary">Sources let NotebookAI base its responses on the information that matters most to you.</p>
      </div>

      <div className="p-6 pt-2 flex-1 flex flex-col gap-4 overflow-y-auto">
         {/* ... Drag Area ... */}
         <div 
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={triggerFileSelect}
            className={`flex-1 min-h-[180px] border border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group relative overflow-hidden ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-bg-surface-2 hover:bg-bg-element'}`}
         >
           <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf,.txt,.md,.csv" />
           <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors z-10 ${isDragging ? 'bg-primary/10' : 'bg-bg-element group-hover:bg-bg-element-hover'}`}>
             <Upload size={24} className={`transition-colors ${isDragging ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`} />
           </div>
           <div className="text-center z-10 pointer-events-none">
             <p className="text-text-main font-medium text-lg">{isDragging ? 'Drop file here' : 'Upload sources'}</p>
             <p className="text-sm text-text-secondary mt-1">Drag & drop or <span className="text-primary font-medium underline">choose file</span> to upload</p>
           </div>
         </div>

         {/* ... Buttons ... */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
           <button className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-border hover:bg-bg-element transition text-text-main text-sm font-medium bg-bg-surface-2 cursor-pointer"><UploadCloud size={18} className="text-primary" /> Google Drive</button>
           <button className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-border hover:bg-bg-element transition text-text-main text-sm font-medium bg-bg-surface-2 cursor-pointer"><LinkIcon size={18} className="text-primary" /> Link</button>
           <button 
             onClick={() => {
               onAddSource({ 
                   id: Date.now().toString(), 
                   projectId: projectId,
                   type: 'text', 
                   title: 'New Text Source', 
                   date: 'Just now', 
                   content: 'This is a new text source content.' 
               });
               onClose();
             }}
             className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-border hover:bg-bg-element transition text-text-main text-sm font-medium bg-bg-surface-2 cursor-pointer"
           >
             <FileText size={18} className="text-primary" /> Paste text
           </button>
         </div>
      </div>
      
      {/* ... Footer ... */}
      <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-bg-surface-2 shrink-0">
         <span className="text-xs text-text-secondary">Source limit</span>
         <div className="flex items-center gap-3">
           <div className="w-32 h-1 bg-bg-element rounded-full overflow-hidden"><div className="w-[4%] h-full bg-primary"></div></div>
           <span className="text-xs text-text-secondary font-medium">0 / 50</span>
         </div>
      </div>
    </div>
  );
};
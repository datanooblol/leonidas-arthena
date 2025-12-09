'use client';
import React, { useState } from 'react';
import { Plus, Search, Filter, Files, FileText, Link as LinkIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Checkbox } from '../atoms/Checkbox';
import { Dropdown } from '../molecules/Dropdown'; // ✅ Import Dropdown
import { Source } from '@/types';

interface SourceManagerProps {
  sources: Source[];
  onOpenModal: () => void;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleAll: (ids: number[]) => void;
  onViewSource: (source: Source) => void;
  
  // ✅ รับ Props สำหรับจัดการ Source เพิ่ม
  onRenameSource: (id: number) => void;
  onDeleteSource: (id: number) => void;
}

export const SourceManager: React.FC<SourceManagerProps> = ({ 
  sources, 
  onOpenModal, 
  selectedIds, 
  onToggleSelect, 
  onToggleAll, 
  onViewSource,
  onRenameSource,
  onDeleteSource
}) => {
  const [search, setSearch] = useState('');
  
  const filteredSources = sources.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
  const isAllSelected = filteredSources.length > 0 && filteredSources.every(s => selectedIds.includes(s.id));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-main">
      
      {/* Header Section */}
      <div className="p-4 md:p-6 pb-2 shrink-0 space-y-4">
          <Button 
            fullWidth 
            variant="outline" 
            className="border-dashed h-12 text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5"
            onClick={onOpenModal}
          >
            <Plus size={18} className="mr-2" /> Add sources
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex-1">
               <Input 
                 placeholder="Search sources..." 
                 icon={Search} 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <Button variant="icon" title="Filter">
              <Filter size={18} />
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2 border-b border-border pb-2">
            <div className="flex items-center gap-2">
               <Checkbox checked={isAllSelected} onChange={() => onToggleAll(filteredSources.map(s => s.id))} />
               <span className="text-xs font-medium text-text-secondary">Select all sources</span>
            </div>
          </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-1 custom-scrollbar">
          {filteredSources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-text-secondary">
               <Files size={48} strokeWidth={1} className="mb-2 opacity-50" />
               <p className="text-sm">No sources found.</p>
            </div>
          ) : (
            filteredSources.map(source => (
               <div 
                 key={source.id} 
                 onClick={() => onViewSource(source)}
                 className="group flex items-center justify-between p-3 rounded-xl hover:bg-bg-element transition-colors cursor-pointer relative pr-8"
               >
                 <div className="flex items-center gap-3 min-w-0 flex-1">
                     {/* Checkbox (Click propagation stop) */}
                     <div onClick={(e) => e.stopPropagation()}>
                       <Checkbox 
                          checked={selectedIds.includes(source.id)} 
                          onChange={() => onToggleSelect(source.id)} 
                       />
                     </div>

                     <div className="w-8 h-8 rounded bg-bg-element group-hover:bg-bg-surface flex items-center justify-center text-primary shrink-0 transition-colors">
                        {source.type === 'pdf' ? <FileText size={16} /> : <LinkIcon size={16} />}
                     </div>
                     <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-text-main truncate">{source.title}</h4>
                        <p className="text-xs text-text-secondary uppercase">{source.type} • {source.date}</p>
                     </div>
                 </div>

                 {/* ✅ Dropdown Menu for Source Actions */}
                 <div onClick={(e) => e.stopPropagation()} className="ml-2">
                    <Dropdown 
                      align="right"
                      trigger={
                        <button className="p-1.5 rounded-md text-text-secondary hover:text-text-main hover:bg-bg-surface transition-colors">
                           <MoreVertical size={16} />
                        </button>
                      }
                      items={[
                        { label: 'Rename', icon: Edit2, onClick: () => onRenameSource(source.id) },
                        { label: 'Delete', icon: Trash2, danger: true, onClick: () => onDeleteSource(source.id) }
                      ]}
                    />
                 </div>
               </div>
            ))
          )}
      </div>
      
      {/* Footer Section */}
      <div className="px-4 md:px-6 py-3 border-t border-border bg-bg-surface-2 flex justify-between items-center text-xs text-text-secondary shrink-0">
         <span>{sources.length} sources uploaded</span>
         <div className="flex items-center gap-3">
            <span>Limit: 50</span>
            <div className="w-16 h-1.5 bg-bg-element rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary" 
                    style={{ width: `${Math.min((sources.length / 50) * 100, 100)}%` }} 
                />
            </div>
         </div>
      </div>
    </div>
  );
};
'use client';
import React from "react";
import { Menu, Plus, MessageSquare, Edit2, Trash2, Files, Eye, RotateCcw } from "lucide-react";
import { Button } from "../atoms/Button";
import { Chat, Source } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  toggleOpen: () => void;
  activeTab: "context" | "history";
  setActiveTab: (tab: "context" | "history") => void;
  sources: Source[];
  activeSourceIds: number[];
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onCreateChat: () => void;
  onDeleteChat: (id: number) => void;
  onRenameChat: (id: number) => void;
  onClearChat: (id: number) => void;
  onViewSource?: (source: Source) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, toggleOpen, activeTab, setActiveTab, sources, activeSourceIds, chats, activeChatId,
  onSelectChat, onCreateChat, onDeleteChat, onRenameChat, onClearChat, onViewSource
}) => {
  const activeSourcesList = sources.filter((s) => activeSourceIds.includes(s.id));

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleOpen}
      />

      <aside className={`
        flex flex-col border-r border-border bg-bg-surface
        transition-all duration-300 ease-in-out z-30
        
        /* Mobile: Fixed Drawer */
        fixed left-0 top-16 bottom-0 w-[280px]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}

        /* Desktop: Relative Collapsible */
        md:relative md:translate-x-0 md:top-0 md:bottom-auto md:h-full
        ${isOpen ? "md:w-80" : "md:w-[60px]"}
      `}>
        
        {/* --- Header --- */}
        <div className={`flex items-center border-b border-border h-14 shrink-0 ${isOpen ? "px-0" : "justify-center"}`}>
          {/* Toggle Button */}
          <button onClick={toggleOpen} className="w-[60px] h-full hidden md:flex items-center justify-center text-text-secondary hover:text-text-main hover:bg-bg-element transition-colors cursor-pointer shrink-0">
            <Menu size={20}/>
          </button>

          {/* Tabs Section */}
          <div className={`flex flex-1 overflow-hidden transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            {isOpen && (
              <div className="flex w-full">
                {/* ✅ 1. เพิ่ม w-1/2 และ text-center เพื่อให้กว้างเท่ากัน */}
                <button 
                  onClick={() => setActiveTab("context")} 
                  className={`
                    flex-1 w-1/2 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap text-center
                    ${activeTab === "context" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-main"}
                  `}
                >
                  Context ({activeSourcesList.length})
                </button>
                {/* ✅ 2. เปลี่ยน History -> Chats */}
                <button 
                  onClick={() => setActiveTab("history")} 
                  className={`
                    flex-1 w-1/2 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap text-center
                    ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-main"}
                  `}
                >
                  Chats
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- Content List --- */}
        <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${!isOpen ? "hidden md:hidden" : ""}`}>
          {activeTab === "context" ? (
            <div className="space-y-2">
              {activeSourcesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-text-secondary opacity-70 text-center">
                  <Files size={32} className="mb-3 opacity-50" />
                  <p className="text-sm font-medium">No sources selected</p>
                  <p className="text-xs mt-1">Go to the &quot;Sources&quot; tab to select documents.</p>
                </div>
              ) : (
                activeSourcesList.map((source) => (
                  <div
                    key={source.id}
                    onClick={() => onViewSource && onViewSource(source)}
                    className="p-3 rounded-xl border flex gap-3 items-center bg-bg-main border-primary shadow-sm cursor-pointer hover:bg-bg-element transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1 text-text-main">{source.title}</h4>
                      <p className="text-[10px] uppercase font-bold text-text-secondary mt-0.5 tracking-wide">{source.type}</p>
                    </div>
                    <Eye size={16} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button fullWidth onClick={onCreateChat} icon={Plus} variant="outline" className="mb-4 border-dashed h-10">New Chat</Button>
              {chats.map((chat, index) => (
                <div key={chat.id || `chat-${index}`} onClick={() => onSelectChat(chat.id)} className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between group transition-all ${activeChatId === chat.id ? "bg-primary/10 border-primary" : "bg-bg-main border-border hover:border-text-secondary"}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className={activeChatId === chat.id ? "text-primary" : "text-text-secondary"} />
                    <span className={`text-sm font-medium truncate ${activeChatId === chat.id ? "text-text-main" : "text-text-secondary"}`}>{chat.title}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); onRenameChat(chat.id); }} className="p-1.5 hover:bg-bg-element rounded text-text-secondary hover:text-text-main transition-colors cursor-pointer"><Edit2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onClearChat(chat.id); }} className="p-1.5 hover:bg-bg-element rounded text-text-secondary hover:text-warning transition-colors cursor-pointer"><RotateCcw size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} className="p-1.5 hover:bg-bg-element rounded text-text-secondary hover:text-danger transition-colors cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
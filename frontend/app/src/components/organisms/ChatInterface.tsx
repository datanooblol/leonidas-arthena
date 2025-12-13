'use client';
import React, { useRef, useEffect, useState } from "react";
import { ChatMessage } from "../molecules/ChatMessage";
import { Button } from "../atoms/Button";
import {
  Sparkles,
  ArrowDown,
  Bot,
  CheckCircle2,
  Plus,
  Send,
} from "lucide-react";
import { Chat, ChatReference } from "@/types";

interface ChatInterfaceProps {
  activeChat: Chat | null;
  input: string;
  setInput: (val: string) => void;
  onSendMessage: () => void;
  onEditMessage: (id: number, content: string) => void;
  onCopyMessage: (content: string) => void;
  onReferenceClick?: (reference: ChatReference) => void;
  isSourceMode: boolean;
  toggleSourceMode: () => void;
  sourceCount: number;
  onCreateNewChat: () => void;
  isLoading: boolean;
  availableModels: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  activeChat,
  input,
  setInput,
  onSendMessage,
  onEditMessage,
  onCopyMessage,
  onReferenceClick,
  isSourceMode,
  toggleSourceMode,
  sourceCount,
  onCreateNewChat,
  isLoading,
  availableModels,
  selectedModel,
  onModelChange,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Auto Resize Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (activeChat && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }

  }, [activeChat?.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAboveBottom = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBottom(isAboveBottom);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- EMPTY STATE ---
  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center animate-fade-in">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-tr from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6">
          <Sparkles size={32} className="text-primary md:w-10 md:h-10" />
        </div>
        <h2 className="text-xl md:text-2xl font-medium text-text-main mb-2">
          Select or Start a Chat
        </h2>
        <p className="text-text-secondary mb-8 max-w-sm text-sm md:text-base">
          Choose a notebook from the sidebar to continue your work, or start a
          new conversation to explore new ideas.
        </p>
        <Button onClick={onCreateNewChat} icon={Plus} size="lg">
          Start New Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-bg-main">
      
      {/* Message List */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar"
      >
        {activeChat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
            <Bot size={48} className="text-text-secondary" />
            <p className="text-text-secondary text-sm md:text-base">
              Ask anything to get started...
            </p>
          </div>
        ) : (
          <>
            {activeChat.messages.map((msg, index) => (
              <ChatMessage 
                key={msg.id || `msg-${index}`} 
                msg={msg} 
                onCopy={onCopyMessage} 
                onEdit={onEditMessage}
                onReferenceClick={onReferenceClick}
                isLatestUserMessage={
                    msg.role === 'user' && 
                    msg.id === activeChat.messages.filter(m => m.role === 'user').pop()?.id
                }
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 max-w-3xl mx-auto justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 shrink-0 flex items-center justify-center mt-1">
                   <Bot size={16} className="text-white animate-pulse" />
                </div>
                <div className="flex items-center gap-1 p-3">
                   <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Scroll Button */}
      {showScrollBottom && (
        <div className="absolute bottom-45 right-1/2 translate-x-1/2 z-10 animate-fade-in">
          <button
            onClick={scrollToBottom}
            className="p-2 bg-bg-surface border border-border rounded-full shadow-lg text-text-secondary hover:text-text-main hover:bg-bg-element transition-all cursor-pointer"
          >
            <ArrowDown size={18} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto w-full shrink-0">
        <div className="relative bg-input-bg rounded-3xl border border-border shadow-sm focus-within:shadow-md transition-all flex flex-col">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask NotebookAI..."
            className="
              w-full bg-transparent border-none rounded-3xl 
              px-4 py-3 md:px-6 md:py-4 
              text-text-main placeholder-text-secondary 
              outline-none resize-none 
              min-h-[50px] md:min-h-14 max-h-[200px]
              text-sm md:text-base
            "
            rows={1}
          />

          <div className="flex items-center justify-between px-3 pb-2 md:px-4 md:pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSourceMode}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer
                  ${isSourceMode
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-text-secondary border-transparent hover:bg-bg-element"
                  }
                `}
              >
                <CheckCircle2
                  size={14}
                  className={isSourceMode ? "fill-primary" : ""}
                />
                {sourceCount} Sources
              </button>
              
              <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="px-2 py-1 text-xs bg-bg-element border border-border rounded text-text-main cursor-pointer"
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onSendMessage}
              disabled={!input.trim()}
              className={`
                p-2 rounded-full transition-all cursor-pointer
                ${input.trim()
                  ? "bg-text-main text-bg-main hover:opacity-90"
                  : "bg-bg-element text-text-secondary cursor-not-allowed"
                }
              `}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-text-secondary mt-2 md:mt-3">
          NotebookAI may display inaccurate info, so double-check its responses.
        </p>
      </div>
    </div>
  );
};
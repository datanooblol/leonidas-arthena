"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Files, BotMessageSquare } from "lucide-react";

// Direct Imports
import { ProjectTemplate } from "../templates/ProjectTemplate";
import { Navbar } from "../organisms/Navbar";
import { Sidebar } from "../organisms/Sidebar";
import { ChatInterface } from "../organisms/ChatInterface";
import { SourceManager } from "../organisms/SourceManager";
import { SourceViewerModal } from "../organisms/SourceViewerModal";
import { AddSourceModalContent } from "../organisms/AddSourceModalContent";
import { Modal } from "../molecules/Modal";
import { AlertDialog } from "../molecules/AlertDialog";
import { Toast } from "../molecules/Toast";
import { FullPageLoader } from "../molecules/FullPageLoader";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

import { useNotebookApp } from "@/hooks/useNotebookApp";
import { Source } from "@/types";

interface ProjectWorkspaceProps {
  projectId: string;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  projectId,
}) => {
  const router = useRouter();

  const {
    user,
    projects,
    currentProject,
    activeChatId,
    setActiveChatId,
    chats,
    sources,
    addSource,
    activeSourceIds,
    setActiveSourceIds,
    createNewChat,
    handleSendMessage,
    handleEditMessage,
    handleRenameChat,
    handleDeleteChat,
    handleClearChat,
    isSourceMode,
    setIsSourceMode,
    isLoading,
    isInitialized,
    renameSource,
    deleteSource,
    toggleSourceSelection,
    availableModels,
    selectedModel,
    setSelectedModel,
  } = useNotebookApp(projectId);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"context" | "history">("context");
  const [rightTab, setRightTab] = useState<"chat" | "sources">("sources");
  const [input, setInput] = useState("");

  // Modal States
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [viewingSource, setViewingSource] = useState<Source | null>(null);
  const [chatToRename, setChatToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [sourceToRename, setSourceToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Effects
  useEffect(() => {
    if (isInitialized && !hasAutoOpened && sources.length === 0) {
      const timer = setTimeout(() => {
        setIsAddSourceOpen(true);
        setHasAutoOpened(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, sources.length, hasAutoOpened]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const timer = setTimeout(() => {
        setIsSidebarOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ show: true, message: "Copied to clipboard" });
  };

  if (!isInitialized) {
    return <FullPageLoader />;
  }

  return (
    <ProjectTemplate
      navbar={
        <Navbar
          user={user}
          title={currentProject?.title || "Loading..."}
          onLogout={() => router.push("/")}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onTitleClick={() => setIsProjectInfoOpen(true)}
        />
      }
      sidebar={
        <Sidebar
          isOpen={isSidebarOpen}
          toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sources={sources}
          activeSourceIds={activeSourceIds}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setRightTab("chat");
            setInput("");
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onCreateChat={() => {
            createNewChat();
            setInput("");
          }}
          onRenameChat={(id) => {
            const chat = chats.find((c) => c.id === id);
            if (chat) setChatToRename({ id: chat.id, title: chat.title });
          }}
          onDeleteChat={(id) => setChatToDelete(id)}
          onClearChat={handleClearChat}
          onViewSource={setViewingSource}
        />
      }
    >
      {/* ✅ ปรับความสูง h-14 ให้เท่ากับ Sidebar Header */}
      <div className="flex justify-center items-center border-b border-border bg-bg-surface-2 shrink-0 h-14">
        {/* ใช้ h-full เพื่อให้ปุ่มสูงเต็มพื้นที่ */}
        <div className="flex w-full max-w-md h-full">
          <button
            onClick={() => setRightTab("sources")}
            className={`
                  flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition-colors cursor-pointer 
                  ${
                    rightTab === "sources"
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-text-main"
                  }
                `}
          >
            <Files size={16} /> Sources
          </button>
          <button
            onClick={() => setRightTab("chat")}
            className={`
                  flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition-colors cursor-pointer 
                  ${
                    rightTab === "chat"
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-text-main"
                  }
                `}
          >
            <BotMessageSquare size={16} /> Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {rightTab === "chat" ? (
          <ChatInterface
            activeChat={activeChat}
            input={input}
            setInput={setInput}
            onSendMessage={() => {
              handleSendMessage(input);
              setInput("");
            }}
            onEditMessage={handleEditMessage}
            onCopyMessage={handleCopyMessage}
            onReferenceClick={(ref) => console.log('Reference clicked:', ref)}
            isSourceMode={isSourceMode}
            toggleSourceMode={() => {
              console.log('Toggle source mode:', !isSourceMode);
              setIsSourceMode(!isSourceMode);
            }}
            sourceCount={activeSourceIds.length}
            onCreateNewChat={createNewChat}
            isLoading={isLoading}
            availableModels={availableModels}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        ) : (
          <SourceManager
            sources={sources}
            onOpenModal={() => setIsAddSourceOpen(true)}
            selectedIds={activeSourceIds}
            onToggleSelect={(id) => {
              const isSelected = activeSourceIds.includes(id);
              toggleSourceSelection(id, !isSelected);
            }}
            onToggleAll={(ids) => {
              const allSelected = ids.every((id) => activeSourceIds.includes(id));
              ids.forEach(id => toggleSourceSelection(id, !allSelected));
            }}
            onViewSource={setViewingSource}
            onRenameSource={(id) => {
              const s = sources.find((x) => x.id === id);
              if (s) setSourceToRename({ id: s.id, title: s.title });
            }}
            onDeleteSource={(id) => setSourceToDelete(id)}
          />
        )}
      </div>

      <Modal
        isOpen={!!chatToRename}
        onClose={() => setChatToRename(null)}
        title="Rename Chat"
      >
        <div className="p-6 space-y-4">
          <Input
            value={chatToRename?.title || ""}
            onChange={(e) =>
              setChatToRename((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setChatToRename(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (chatToRename?.title.trim()) {
                  //console.log('Renaming chat:', { id: chatToRename.id, newTitle: chatToRename.title });
                  handleRenameChat(chatToRename.id, chatToRename.title);
                  setChatToRename(null);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={!!sourceToRename}
        onClose={() => setSourceToRename(null)}
        title="Rename Source"
      >
        <div className="p-6 space-y-4">
          <Input
            value={sourceToRename?.title || ""}
            onChange={(e) =>
              setSourceToRename((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setSourceToRename(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (sourceToRename?.title.trim()) {
                  renameSource(sourceToRename.id, sourceToRename.title);
                  setSourceToRename(null);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <AlertDialog
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={() => {
          if (chatToDelete) {
            handleDeleteChat(chatToDelete);
            setChatToDelete(null);
          }
        }}
        title="Delete Chat?"
        description="This action cannot be undone."
        confirmText="Delete"
        isDestructive
      />
      <AlertDialog
        isOpen={!!sourceToDelete}
        onClose={() => setSourceToDelete(null)}
        onConfirm={() => {
          if (sourceToDelete) {
            deleteSource(sourceToDelete);
            setSourceToDelete(null);
          }
        }}
        title="Delete Source?"
        description="This source will be permanently deleted."
        confirmText="Delete"
        isDestructive
      />

      <Modal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
        title="Project Details"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary">
              Project Name
            </label>
            <p className="text-lg font-medium text-text-main mt-1">
              {currentProject?.title}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary">
              Description
            </label>
            <p className="text-sm text-text-main mt-1 leading-relaxed bg-bg-surface-2 p-3 rounded-xl border border-border">
              {currentProject?.description || "No description provided."}
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setIsProjectInfoOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        title="Add sources"
      >
        <AddSourceModalContent
          onClose={() => setIsAddSourceOpen(false)}
          onAddSource={addSource}
          projectId={projectId}
        />
      </Modal>
      <SourceViewerModal
        source={viewingSource}
        isOpen={!!viewingSource}
        onClose={() => setViewingSource(null)}
      />
      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </ProjectTemplate>
  );
};

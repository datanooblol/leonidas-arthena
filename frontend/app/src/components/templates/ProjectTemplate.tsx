import React from 'react';

interface ProjectTemplateProps {
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ navbar, sidebar, children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-main transition-colors duration-300">
      {/* Header */}
      {navbar}
      
      {/* Layout: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {sidebar}
        
        {/* Content Area (Chat or Source) */}
        <main className="flex-1 flex flex-col bg-bg-main relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
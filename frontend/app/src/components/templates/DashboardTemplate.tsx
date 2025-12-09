import React from 'react';

interface DashboardTemplateProps {
  navbar: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ navbar, children }) => {
  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-300 flex flex-col">
      {/* Navbar อยู่บนสุดเสมอ */}
      {navbar}
      
      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};
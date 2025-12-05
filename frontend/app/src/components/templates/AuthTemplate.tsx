import React from 'react';

interface AuthTemplateProps {
  children: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 transition-colors duration-300">
      {/* จัดกลางเสมอ และรองรับ Responsive padding */}
      <div className="w-full max-w-[400px]">
        {children}
      </div>
    </div>
  );
};
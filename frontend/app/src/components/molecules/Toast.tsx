'use client';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-6 z-50 pointer-events-none w-auto max-w-sm
        animate-fade-in 

        /* Mobile + Tablet: center */
        left-1/2 -translate-x-1/2

        /* Desktop: left */
        lg:left-6 lg:translate-x-0
      `}
    >
      <div 
        className="
          bg-toast-bg text-toast-text 
          px-4 py-3 rounded-xl shadow-xl 
          flex items-center gap-3 text-sm font-medium 
          border border-white/10 backdrop-blur-sm
        "
      >
        {message}
      </div>
    </div>
  );
};

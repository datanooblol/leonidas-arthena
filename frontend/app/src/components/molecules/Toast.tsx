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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast pointer-events-none w-full max-w-sm px-4 flex justify-center">
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
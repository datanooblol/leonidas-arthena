import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../atoms';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ 
  isOpen, onClose, onConfirm, title, description, 
  confirmText = "Confirm", cancelText = "Cancel", isDestructive = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-bg-surface w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden p-6 mx-4 sm:mx-auto">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-full ${isDestructive ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-main mb-1">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          <Button 
            onClick={() => { onConfirm(); onClose(); }} 
            className={isDestructive ? "bg-danger hover:bg-red-600 text-white border-transparent" : ""}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
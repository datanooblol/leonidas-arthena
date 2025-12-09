import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = "", ...props }) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label className="text-xs font-medium text-text-secondary ml-1">
        {label}
      </label>
    )}
    <textarea 
      className={`
        w-full 
        bg-input-bg border border-border 
        rounded-xl px-4 py-3 
        text-sm text-text-main placeholder-text-secondary 
        outline-none transition-all duration-200 resize-none
        
        /* Hover State */
        hover:border-text-secondary
        
        /* Focus State */
        focus:bg-bg-main focus:border-primary focus:ring-1 focus:ring-primary 
        
        ${className}
      `}
      {...props}
    />
  </div>
);
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className = "", ...props }) => (
  <div className="w-full space-y-1.5 relative">
    {/* Label */}
    {label && (
      <label className="text-xs font-medium text-text-secondary ml-1">
        {label}
      </label>
    )}
    
    <div className="relative">
      {/* Icon */}
      {Icon && (
        <Icon 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" 
        />
      )}
      
      {/* Input Field */}
      <input 
        className={`
          w-full 
          bg-input-bg border border-border 
          rounded-full px-4 py-2.5 
          text-sm text-text-main placeholder-text-secondary 
          outline-none transition-all duration-200
          
          /* Hover State */
          hover:border-text-secondary
          
          /* Focus State */
          focus:bg-bg-main focus:border-primary focus:ring-1 focus:ring-primary 
          
          ${Icon ? 'pl-10' : ''} 
          ${className}
        `}
        {...props}
      />
    </div>
  </div>
);
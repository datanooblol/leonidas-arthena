import React from 'react';
import { Square, CheckSquare } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, className = "" }) => (
  <button 
    onClick={(e) => { 
      e.stopPropagation(); 
      onChange(); 
    }} 
    className={`
      p-0.5 rounded transition-transform duration-200 ease-in-out
      cursor-pointer active:scale-90
      ${checked 
        ? 'text-primary' 
        : 'text-text-secondary hover:text-text-main'
      } 
      ${className}
    `}
  >
    {checked ? (
      <CheckSquare size={20} className="fill-primary/10" />
    ) : (
      <Square size={20} />
    )}
  </button>
);
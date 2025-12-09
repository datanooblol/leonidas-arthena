'use client';
import React, { useState, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu Content */}
      {isOpen && (
        <div 
          className={`
            absolute top-full mt-2 w-48 z-50
            bg-bg-surface border border-border 
            rounded-xl shadow-xl overflow-hidden 
            animate-fade-in
            ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}
          `}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button 
                key={index} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsOpen(false); 
                  item.onClick(); 
                }} 
                className={`
                  w-full text-left px-4 text-sm flex items-center gap-3 transition-colors duration-200 cursor-pointer
                  
                  /* Mobile: Touch target ใหญ่ขึ้น */
                  py-3 
                  /* Desktop: ขนาดปกติ */
                  md:py-2.5 

                  ${item.danger 
                    ? 'text-danger hover:bg-danger/10 active:bg-danger/20' 
                    : 'text-text-main hover:bg-bg-element active:bg-bg-element-hover'
                  }
                `}
              >
                {item.icon && <item.icon size={16} />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
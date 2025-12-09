import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'icon' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  fullWidth?: boolean;
  danger?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon, 
  fullWidth = false, 
  danger, 
  ...props 
}) => {
  // เพิ่ม cursor-pointer และ active:scale-95 เพื่อความรู้สึกตอบสนองเวลากด
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-95";
  
  const activeVariant = danger && variant === 'primary' ? 'danger' : variant;

  const variants = {
    // Tailwind v4 Syntax
    primary: "bg-primary text-bg-main hover:bg-primary-hover hover:text-white shadow-md border border-transparent",
    secondary: "bg-bg-element text-text-main hover:bg-bg-element-hover border border-transparent",
    ghost: "bg-transparent hover:bg-bg-element text-text-main border border-transparent",
    outline: "border border-border text-primary hover:bg-bg-element",
    icon: "bg-transparent hover:bg-bg-element text-text-secondary hover:text-text-main p-2 rounded-full",
    danger: "bg-danger text-white hover:opacity-90 shadow-md border border-transparent"
  };

  const sizes = {
    // ปรับความสูงเล็กน้อยเพื่อให้ Touch Target ดีขึ้น
    xs: "h-7 px-3 text-xs",
    sm: "h-9 px-4 text-xs",
    md: "h-10 px-6 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10 shrink-0"
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[activeVariant]} 
        ${activeVariant !== 'icon' ? sizes[size] : sizes.icon} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'xs' ? 14 : 18} className={children ? "mr-2" : ""} />}
      {children}
    </button>
  );
};
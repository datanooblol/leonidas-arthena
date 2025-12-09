'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserCircle, Settings, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { Dropdown } from '../molecules/Dropdown';
import { Button } from '../atoms/Button';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/types';

interface NavbarProps {
  user: User | null;
  title?: string;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  onTitleClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, title, onLogout, onToggleSidebar, onTitleClick }) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);

  // ✅ แก้ไข: ใช้ setTimeout เพื่อแก้ปัญหา setState synchronously in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleHomeClick = () => {
    router.push('/dashboard');
  };

  return (
    <nav className="h-16 border-b border-border bg-bg-main flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 transition-colors duration-300">
      
      {/* Left Side */}
      <div className="flex items-center gap-3 md:gap-4">
        
        {/* Mobile Hamburger Menu */}
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-main hover:bg-bg-element rounded-md transition-colors cursor-pointer"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Logo */}
        <div 
          onClick={handleHomeClick} 
          className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="rounded-lg overflow-hidden shrink-0">
            <Image 
              src="/leonidasArthenaLogo.png" 
              alt="Logo" 
              width={100} 
              height={100} 
              className="w-14 h-14 object-contain" 
              priority 
            />
          </div>
          <span className="font-medium text-lg text-text-main tracking-tight">
            Arthena
          </span>
        </div>
        
        {/* Title Separator & Title */}
        {title && (
          <>
            <div className="h-6 w-px bg-border hidden md:block" />
            <span 
              onClick={onTitleClick}
              className={`
                font-medium text-text-main text-sm md:text-base line-clamp-1 max-w-[200px] sm:max-w-md hidden md:block
                ${onTitleClick ? 'cursor-pointer hover:text-primary transition-colors' : ''} 
              `}
            >
              {title}
            </span>
          </>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="icon" onClick={toggleTheme} title="Switch Theme">
          {/* Check mounted before rendering icon to avoid hydration mismatch */}
          {!mounted ? (
            <Moon size={20} /> 
          ) : isDarkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </Button>
        
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-transparent sm:border-border">
            <Dropdown 
              align="right" 
              trigger={
                <div className="w-9 h-9 rounded-full bg-bg-element flex items-center justify-center cursor-pointer hover:ring-2 ring-primary transition-all">
                  <UserCircle className="w-6 h-6 text-text-main" />
                </div>
              } 
              items={[
                { label: 'Settings', icon: Settings, onClick: () => {} },
                { label: 'Log out', icon: LogOut, onClick: onLogout, danger: true }
              ]} 
            />
          </div>
        )}
      </div>
    </nav>
  );
};
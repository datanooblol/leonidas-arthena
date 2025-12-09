"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Atom,
  UserCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { Dropdown } from "../molecules/Dropdown";
import { Button } from "../atoms/Button";
import { User } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  user: User | null;
  title?: string;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  onTitleClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  title,
  onLogout,
  onToggleSidebar,
  onTitleClick,
}) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleHomeClick = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="h-16 border-b border-border bg-bg-main flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 transition-colors duration-300">
      {/* Left Side */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* ✅ แก้ไข: เช็ค onToggleSidebar ก่อนแสดงปุ่ม (จะแสดงเฉพาะหน้า Project) */}
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
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="bg-linear-to-tr from-blue-500 to-purple-500 p-1.5 rounded-lg">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-lg text-text-main tracking-tight">
            NotebookAI
          </span>
        </div>

        {/* Title */}
        {title && (
          <>
            <div className="h-6 w-px bg-border hidden md:block"></div>
            <span
              onClick={onTitleClick}
              className={`
                font-medium text-text-main text-sm md:text-base line-clamp-1 max-w-[200px] sm:max-w-md hidden md:block
                ${
                  onTitleClick
                    ? "cursor-pointer hover:text-primary transition-colors"
                    : ""
                } 
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
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
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
                { label: "Settings", icon: Settings, onClick: () => {} },
                {
                  label: "Log out",
                  icon: LogOut,
                  onClick: onLogout,
                  danger: true,
                },
              ]}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

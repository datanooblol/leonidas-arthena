'use client';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export const FullPageLoader: React.FC = () => {
  // ✅ 1. Lazy Initialization: อ่านค่าจาก LocalStorage ทันทีที่เริ่ม Render
  const [theme] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return undefined;
  });

  return (
    <div 
      className="min-h-screen w-full bg-bg-main flex flex-col items-center justify-center z-50 transition-colors duration-300"
      data-theme={theme}
      suppressHydrationWarning
    >
      <div className="relative">
        {/* Logo Container */}
        <div className="w-24 h-24 bg-linear-to-tr from-blue-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse p-5 border border-border/50">
           {/* ✅ ใช้ img ธรรมดาแทน เพื่อให้แสดงผลใน Preview นี้ได้ (ในโปรเจคจริงใช้ <Image> ได้เลย) */}
           <Image 
             src="/leonidasArthenaLogo.png" 
             alt="Loading..." 
             width={100} 
             height={100} 
             className="w-full h-full object-contain drop-shadow-md"
           />
        </div>
        
        {/* Spinner */}
        <div className="absolute -bottom-3 -right-3 bg-bg-surface rounded-full p-2 shadow-lg border border-border">
           <Loader2 size={24} className="text-primary animate-spin" />
        </div>
      </div>
      
      <h3 className="text-xl font-medium text-text-main mt-4">Arthena is thinking...</h3>
      <p className="text-sm text-text-secondary mt-2">Preparing your workspace</p>
    </div>
  );
};
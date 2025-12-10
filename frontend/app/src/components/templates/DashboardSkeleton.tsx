import React from 'react';
import { Skeleton } from '../atoms/Skeleton';
import { ProjectCardSkeleton } from '../molecules/ProjectCardSkeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-300 flex flex-col">
      {/* Navbar Skeleton */}
      <div className="h-16 border-b border-border bg-bg-main flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            {/* Hamburger (Mobile) */}
            <Skeleton className="w-8 h-8 md:hidden" />
            {/* Logo */}
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-6 w-32 hidden md:block" />
         </div>
         <div className="flex items-center gap-4">
            <Skeleton className="w-9 h-9 rounded-full" /> {/* Avatar */}
         </div>
      </div>
      
      {/* Main Content Skeleton */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />  {/* Title */}
              <Skeleton className="h-4 w-64" />       {/* Subtitle */}
            </div>
            <Skeleton className="h-10 w-32 rounded-full" /> {/* New Project Button */}
          </div>
          <Skeleton className="h-10 w-full md:max-w-md rounded-full" /> {/* Search Input */}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* แสดง Skeleton Card สัก 4 ใบ จำลองการโหลด */}
           <ProjectCardSkeleton />
           <ProjectCardSkeleton />
           <ProjectCardSkeleton />
           <ProjectCardSkeleton />
        </div>
      </main>
    </div>
  );
};
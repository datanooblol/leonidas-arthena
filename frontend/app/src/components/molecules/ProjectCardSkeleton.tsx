import React from 'react';
// Direct Import จากไฟล์ที่เพิ่งสร้าง
import { Skeleton } from '../atoms/Skeleton';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="h-64 rounded-2xl border border-border p-6 flex flex-col justify-between bg-bg-surface/50">
      {/* Header */}
      <div className="flex justify-between items-start">
        <Skeleton className="w-10 h-10 rounded-lg" /> {/* Icon Box */}
        <Skeleton className="w-6 h-6 rounded-md" />   {/* Menu Dots */}
      </div>
      
      {/* Body */}
      <div className="flex-1 mt-6">
        <Skeleton className="h-6 w-3/4 mb-3" />       {/* Title */}
        <Skeleton className="h-4 w-full mb-2" />      {/* Desc Line 1 */}
        <Skeleton className="h-4 w-2/3" />            {/* Desc Line 2 */}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/50 flex justify-between items-center">
         <div className="flex gap-3">
            <Skeleton className="h-4 w-12" />         {/* Stat 1 */}
            <Skeleton className="h-4 w-12" />         {/* Stat 2 */}
         </div>
         <Skeleton className="h-4 w-20" />            {/* Date */}
      </div>
    </div>
  );
};
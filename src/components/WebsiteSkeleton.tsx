import React from 'react';

export const WebsiteSkeleton = React.memo(() => (
  <div className="group relative overflow-hidden">
    <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/40 dark:border-slate-700/60"></div>
    <div className="relative p-4 sm:p-6">
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl skeleton"></div>
        <div className="space-y-2 w-full">
          <div className="h-4 sm:h-5 skeleton rounded-lg w-3/4 mx-auto"></div>
          <div className="h-3 sm:h-4 skeleton rounded w-full"></div>
          <div className="h-3 sm:h-4 skeleton rounded w-5/6 mx-auto"></div>
        </div>
        <div className="h-5 sm:h-6 skeleton rounded w-16 sm:w-20"></div>
      </div>
    </div>
  </div>
));

WebsiteSkeleton.displayName = 'WebsiteSkeleton';
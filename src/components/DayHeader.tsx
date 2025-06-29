import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { DayData } from '../types/website';

interface DayHeaderProps {
  day: DayData;
}

export const DayHeader = React.memo(({ day }: DayHeaderProps) => (
  <div className="mb-4 sm:mb-6">
    <div className="flex items-center justify-between">
      {/* 日期信息 */}
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700/60 rounded-lg">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
            {day.dateString}
          </h2>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {day.dayName}
          </span>
        </div>
      </div>
      
      {/* 资源数量标签 */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/80 dark:bg-blue-900/30 rounded-md border border-blue-200/40 dark:border-blue-800/40">
        <Star className="w-3 h-3 text-amber-500 fill-current" />
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          {day.websites.length}
        </span>
      </div>
    </div>
  </div>
));

DayHeader.displayName = 'DayHeader';
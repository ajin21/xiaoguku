import React from 'react';
import { Globe } from 'lucide-react';
import { Website } from '../types/website';
import { getFirstChar } from '../utils/colorUtils';

interface WebsiteCardProps {
  website: Website;
  index: number;
}

export const WebsiteCard = React.memo(({ website, index }: WebsiteCardProps) => (
  <a
    href={website.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative overflow-hidden card-hover hardware-accelerated"
    style={{
      animationDelay: `${Math.min(index * 0.02, 0.5)}s`
    }}
  >
    {/* 卡片背景 */}
    <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/85 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 group-hover:border-slate-300/80 dark:group-hover:border-slate-600/80 shadow-md group-hover:shadow-xl card-background"></div>
    
    {/* 悬停光晕效果 */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/8 group-hover:to-indigo-500/8 rounded-2xl card-glow"></div>
    
    {/* 卡片内容 */}
    <div className="relative p-5 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col items-center text-center flex-1">
        {/* 图标区域 - 减少发光效果 */}
        <div className="relative mb-4 card-icon-container">
          <div className={`absolute inset-0 bg-gradient-to-br ${website.color} rounded-xl blur-md opacity-15 group-hover:opacity-25 card-icon-glow`}></div>
          <div className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${website.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 card-icon`}>
            <span className="text-white font-bold text-lg sm:text-xl drop-shadow-sm">
              {getFirstChar(website.name)}
            </span>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 flex flex-col justify-center w-full mb-4 card-content">
          {/* 网站名称 */}
          <div className="mb-3">
            <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate w-full text-center card-text">
              {website.name}
            </h3>
          </div>
          
          {/* 网站描述 */}
          <div className="flex-1 flex items-start justify-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 line-clamp-2 text-center w-full card-text">
              {website.description}
            </p>
          </div>
        </div>
        
        {/* 访问指示器 */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 card-text">
          <Globe className="w-3 h-3 group-hover:scale-110 card-icon" />
          <span>点击访问</span>
        </div>
      </div>
    </div>
  </a>
));

WebsiteCard.displayName = 'WebsiteCard';
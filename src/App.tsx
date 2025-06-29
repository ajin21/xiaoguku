import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Loader2, Moon, Sun, Users, ArrowUp, Menu, X } from 'lucide-react';
import { useWebsiteData } from './hooks/useWebsiteData';
import { WebsiteCard } from './components/WebsiteCard';
import { DayHeader } from './components/DayHeader';
import { WebsiteSkeleton } from './components/WebsiteSkeleton';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { daysData, isLoading } = useWebsiteData();

  // 监听滚动显示回到顶部按钮
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > window.innerHeight * 0.5);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 简单的回到顶部功能
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 夜间模式切换
  useEffect(() => {
    const root = document.documentElement;
    
    requestAnimationFrame(() => {
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });
    
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 搜索延迟
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // 清除搜索内容
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // 搜索过滤 - 支持日期搜索
  const filteredData = useMemo(() => {
    let result = daysData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.map(day => {
        // 检查日期是否匹配
        const dateMatches = day.dateString.includes(query) || 
                           day.dayName.includes(query) ||
                           day.date.toISOString().split('T')[0].includes(query);
        
        // 如果日期匹配，返回该天的所有网站
        if (dateMatches) {
          return day;
        }
        
        // 否则只返回匹配的网站
        return {
          ...day,
          websites: day.websites.filter(website => 
            website.name.toLowerCase().includes(query) ||
            website.description.toLowerCase().includes(query)
          )
        };
      }).filter(day => day.websites.length > 0);
    }

    return result;
  }, [daysData, searchQuery]);

  const totalFilteredWebsites = useMemo(() => {
    return filteredData.reduce((total, day) => total + day.websites.length, 0);
  }, [filteredData]);

  const totalWebsites = useMemo(() => {
    return daysData.reduce((total, day) => total + day.websites.length, 0);
  }, [daysData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-300">
        {/* 头部骨架屏 */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-700/50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 skeleton rounded-2xl"></div>
                <div className="h-6 sm:h-8 skeleton rounded-lg w-24 sm:w-32"></div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:block w-72 h-10 skeleton rounded-xl"></div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 skeleton rounded-xl"></div>
                <div className="hidden sm:block w-24 h-10 skeleton rounded-xl"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }, (_, i) => (
              <WebsiteSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden transition-colors duration-200">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/2 to-indigo-400/2 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/2 to-pink-400/2 rounded-full blur-3xl"></div>
      </div>

      {/* 头部 */}
      <header className="relative overflow-hidden sticky top-0 z-50">
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-700/50 transition-colors duration-200"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            {/* 左侧：Logo + 网站统计 */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-200"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15 5L12 8L9 5L12 2Z"/>
                    <path d="M2 12L5 15L8 12L5 9L2 12Z"/>
                    <path d="M16 12L19 15L22 12L19 9L16 12Z"/>
                    <path d="M12 16L15 19L12 22L9 19L12 16Z"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold gradient-text">
                  小古资源库
                </h1>
                <span className="text-slate-400 dark:text-slate-500 text-lg sm:text-2xl font-light">-</span>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  已收录 {totalWebsites} 个优质资源
                </p>
              </div>
            </div>
            
            {/* 右侧：搜索框 + 暗黑模式 + 资源社群 */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* 移动端搜索按钮 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden relative group p-2 bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/60 rounded-xl button-hover shadow-sm focus-optimized transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>

              {/* 桌面端搜索框 */}
              <div className="hidden sm:flex items-center">
                <div className="relative search-container">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                    {isSearching && (
                      <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin z-10" />
                    )}
                    <input
                      type="text"
                      placeholder="搜索资源或日期..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-12 py-3 w-64 lg:w-72 bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 shadow-sm search-input focus-optimized transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* 夜间模式切换 */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative group p-2 sm:p-3 bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/60 rounded-xl button-hover shadow-sm focus-optimized transition-colors duration-200"
                title={isDarkMode ? '切换到日间模式' : '切换到夜间模式'}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                )}
              </button>

              {/* 资源社群按钮 */}
              <a
                href="https://link3.cc/xiaoguku"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block relative group overflow-hidden button-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium text-xs sm:text-sm">资源社群</span>
                </div>
              </a>
            </div>
          </div>

          {/* 移动端搜索框 */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-4 space-y-3 animate-fadeIn">
              {/* 搜索框 */}
              <div className="relative search-container">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin z-10" />
                  )}
                  <input
                    type="text"
                    placeholder="搜索资源或日期..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 py-3 w-full bg-white/60 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 shadow-sm search-input focus-optimized transition-colors duration-200"
                  />
                </div>
              </div>

              {/* 移动端资源社群按钮 */}
              <a
                href="https://link3.cc/xiaoguku"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group overflow-hidden button-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">加入资源社群</span>
                </div>
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* 搜索结果提示 */}
        {searchQuery && (
          <div className="mb-6 sm:mb-8 relative group animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-indigo-500/3 rounded-xl blur-lg"></div>
            <div className="relative p-4 bg-blue-50/60 dark:bg-blue-900/20 backdrop-blur-xl rounded-xl border border-blue-200/30 dark:border-blue-800/50 shadow-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-300 font-medium text-sm">
                    搜索 "<span className="font-bold">{searchQuery}</span>"，找到 <span className="font-bold">{totalFilteredWebsites}</span> 个相关资源
                    {isSearching && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
                  </p>
                  <button
                    onClick={clearSearch}
                    className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors focus-optimized"
                  >
                    清除搜索
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 网站展示区域 */}
        <div className="space-y-12 sm:space-y-16">
          {filteredData.map((day, dayIndex) => (
            <section key={dayIndex} className="relative animate-fadeIn" style={{ animationDelay: `${dayIndex * 0.1}s` }}>
              <DayHeader day={day} />

              {/* 网站卡片网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {day.websites.map((website, index) => (
                  <WebsiteCard 
                    key={website.id} 
                    website={website} 
                    index={index} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {filteredData.length === 0 && !isSearching && (
          <div className="text-center py-12 sm:py-16 animate-fadeIn">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-full blur-lg"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              没有找到相关资源
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              试试其他关键词或浏览推荐资源
            </p>
          </div>
        )}
      </div>

      {/* 一键回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 group scroll-to-top"
          title="回到顶部"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-200"></div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </button>
      )}

      {/* 底部 */}
      <footer className="mt-16 sm:mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border-t border-slate-200/40 dark:border-slate-700/60 transition-colors duration-200"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15 5L12 8L9 5L12 2Z"/>
                  <path d="M2 12L5 15L8 12L5 9L2 12Z"/>
                  <path d="M16 12L19 15L22 12L19 9L16 12Z"/>
                  <path d="M12 16L15 19L12 22L9 19L12 16Z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold gradient-text">
                小古资源库
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">发现更好的网络世界</p>
            <p className="text-slate-500 dark:text-slate-500 text-sm sm:text-base">精心筛选，用心推荐，让每一次点击都有价值</p>
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
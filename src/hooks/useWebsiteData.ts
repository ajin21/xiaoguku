import { useState, useEffect, useMemo } from 'react';
import { Website, DayData, WebsiteData } from '../types/website';
import { formatDate, getDayName, parseDate } from '../utils/dateUtils';
import { getRandomColor } from '../utils/colorUtils';
import websiteData from '../data/websites.json';

export const useWebsiteData = () => {
  const [daysData, setDaysData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const websites: WebsiteData[] = websiteData.websites;
        
        // 按日期分组
        const groupedByDate = websites.reduce((acc, website) => {
          const date = website.date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(website);
          return acc;
        }, {} as Record<string, WebsiteData[]>);

        // 转换为DayData格式
        const days: DayData[] = Object.entries(groupedByDate)
          .map(([dateString, websites]) => {
            const date = parseDate(dateString);
            return {
              date,
              dateString: formatDate(date),
              dayName: getDayName(date),
              websites: websites.map((website, index) => ({
                ...website,
                id: `${dateString}-${index}`,
                color: getRandomColor(website.name)
              }))
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime()); // 最新的在前

        setDaysData(days);
      } catch (error) {
        console.error('加载网站数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 模拟加载延迟
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, []);

  return { daysData, isLoading };
};
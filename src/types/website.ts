// 网站数据类型定义
export interface WebsiteData {
  name: string;
  url: string;
  description: string;
  date: string;
}

export interface Website extends WebsiteData {
  id: string;
  color: string;
}

export interface DayData {
  date: Date;
  dateString: string;
  dayName: string;
  websites: Website[];
}
// 颜色工具函数
const colorPalette = [
  'from-violet-500 to-purple-600', 
  'from-blue-500 to-cyan-500', 
  'from-emerald-500 to-teal-500', 
  'from-orange-500 to-red-500', 
  'from-pink-500 to-rose-500', 
  'from-indigo-500 to-blue-500',
  'from-green-500 to-emerald-500', 
  'from-yellow-500 to-orange-500', 
  'from-purple-500 to-pink-500', 
  'from-cyan-500 to-blue-500',
  'from-red-500 to-pink-500', 
  'from-teal-500 to-green-500', 
  'from-amber-500 to-yellow-500', 
  'from-rose-500 to-pink-500', 
  'from-sky-500 to-cyan-500',
  'from-lime-500 to-green-500', 
  'from-fuchsia-500 to-purple-500', 
  'from-slate-500 to-gray-600'
];

export const getRandomColor = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

export const getFirstChar = (name: string) => {
  return name.charAt(0).toUpperCase();
};
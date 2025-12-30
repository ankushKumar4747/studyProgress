
import React from 'react';
import { useLocation } from 'react-router-dom';

const TopBar: React.FC = () => {
  const location = useLocation();
  const getTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard Overview';
    if (path === 'new-task') return 'New Assignment Plan';
    if (path === 'tasks') return 'Syllabus Tracker';
    if (path === 'schedule') return 'Completed Topics';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border-dark bg-surface-darker/50 backdrop-blur-sm z-10 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-white hidden sm:block">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 bg-[#233348] rounded-lg px-3 py-1.5 border border-white/5 cursor-pointer hover:bg-[#2c3f56] transition-colors">
          <span className="material-symbols-outlined text-[#92a9c9] text-[18px]">calendar_today</span>
          <span className="text-sm font-medium text-white">Oct 24, 2023</span>
          <span className="material-symbols-outlined text-[#92a9c9] text-[18px]">expand_more</span>
        </div>
        <button className="relative text-[#92a9c9] hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border border-background-dark"></span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;

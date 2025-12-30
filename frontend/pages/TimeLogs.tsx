
import React from 'react';
import { TimeLog } from '../types';

const timeLogs: TimeLog[] = [
  { id: '1', date: 'Oct 24', description: 'Design System Update', project: 'UI Kit', startTime: '09:00 AM', endTime: '11:30 AM', duration: '2h 30m' },
  { id: '2', date: 'Oct 24', description: 'Client Sync Meeting', project: 'Marketing', startTime: '11:45 AM', endTime: '12:45 PM', duration: '1h 00m' },
  { id: '3', date: 'Oct 24', description: 'Research Competitors', project: 'Strategy', startTime: '01:30 PM', endTime: '03:15 PM', duration: '1h 45m' },
  { id: '4', date: 'Oct 24', description: 'Weekly Report', project: 'Internal', startTime: '03:30 PM', endTime: '04:30 PM', duration: '1h 00m' },
  { id: '5', date: 'Oct 24', description: 'Component Documentation', project: 'UI Kit', startTime: '04:45 PM', endTime: 'Running', duration: '1h 30m', isRunning: true },
];

const TimeLogs: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-bold tracking-tight">Time Logs</h2>
            <p className="text-[#92a9c9] text-base">Manage and review your daily productivity entries.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#233348] border border-white/5 rounded-lg px-3 py-2 cursor-pointer hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-[#92a9c9] text-[20px]">calendar_today</span>
              <span className="text-sm font-medium text-white">Today: Oct 24, 2023</span>
              <span className="material-symbols-outlined text-[#92a9c9] text-[20px]">expand_more</span>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LogStatCard label="Total Tracked Today" value="7h 45m" icon="schedule" iconColor="text-primary" progress={85} />
          <LogStatCard label="Billable Hours" value="5h 30m" icon="trending_up" iconColor="text-green-500" trend="+12% vs yesterday" />
          <div className="flex flex-col gap-1 p-5 rounded-xl bg-surface-dark border border-white/5 col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl text-purple-500">folder_open</span>
            </div>
            <p className="text-[#92a9c9] text-sm font-medium">Most Active Project</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="size-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">UK</div>
              <div>
                <p className="text-white text-lg font-bold tracking-tight">UI Kit Redesign</p>
                <p className="text-[#5a6b85] text-xs">3h 15m tracked</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9]">search</span>
            <input className="block w-full pl-10 pr-3 py-2.5 border border-border-dark rounded-lg bg-surface-dark text-white placeholder-[#5a6b85] focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="Search logs by task, project, or tag..." />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-dark border border-border-dark rounded-lg text-[#92a9c9] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            <span className="text-sm font-medium">Filters</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-dark border border-border-dark rounded-lg text-[#92a9c9] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e293b] border-b border-border-dark">
                  <th className="px-6 py-4 text-xs font-semibold text-[#92a9c9] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#92a9c9] uppercase tracking-wider">Task Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#92a9c9] uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#92a9c9] uppercase tracking-wider">Time Span</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#92a9c9] uppercase tracking-wider text-right">Duration</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#92a9c9] uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {timeLogs.map(log => (
                  <tr key={log.id} className={`transition-colors group ${log.isRunning ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-white/5'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92a9c9] font-mono">{log.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">{log.description}</div>
                      {log.id === '1' && <div className="text-xs text-[#5a6b85] mt-0.5">Refactoring buttons and inputs</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        log.project === 'UI Kit' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        log.project === 'Marketing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        log.project === 'Strategy' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-slate-700/50 text-slate-300 border-slate-600/30'
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          log.project === 'UI Kit' ? 'bg-purple-400' :
                          log.project === 'Marketing' ? 'bg-blue-400' :
                          log.project === 'Strategy' ? 'bg-orange-400' : 'bg-slate-400'
                        }`}></span>
                        {log.project}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#92a9c9] font-mono">{log.startTime} - {log.endTime}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right font-mono ${log.isRunning ? 'text-primary animate-pulse' : 'text-white'}`}>
                      {log.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {log.isRunning ? (
                        <button className="flex items-center gap-1 mx-auto text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors active:scale-95">
                          <span className="material-symbols-outlined text-[16px]">stop</span>
                          Stop
                        </button>
                      ) : (
                        <div className="invisible group-hover:visible flex items-center justify-center gap-2 transition-all">
                          <button className="text-[#92a9c9] hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                          <button className="text-[#92a9c9] hover:text-red-400 transition-colors p-1"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-border-dark flex items-center justify-between">
            <p className="text-sm text-[#92a9c9]">Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">5</span> of <span className="font-medium text-white">24</span> results</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-md border border-border-dark text-[#92a9c9] opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 text-sm rounded-md border border-border-dark text-white hover:bg-white/5">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogStatCard: React.FC<{label: string, value: string, icon: string, iconColor: string, trend?: string, progress?: number}> = ({label, value, icon, iconColor, trend, progress}) => (
  <div className="flex flex-col gap-1 p-5 rounded-xl bg-surface-dark border border-white/5 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className={`material-symbols-outlined text-6xl ${iconColor}`}>{icon}</span>
    </div>
    <p className="text-[#92a9c9] text-sm font-medium">{label}</p>
    <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
    {progress !== undefined ? (
      <div className="mt-2 w-full bg-slate-700 h-1 rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
      </div>
    ) : trend ? (
      <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
        <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
        <span>{trend}</span>
      </div>
    ) : null}
  </div>
);

export default TimeLogs;

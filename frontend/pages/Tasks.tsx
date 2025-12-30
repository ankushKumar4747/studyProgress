
import React, { useState, useMemo } from 'react';

interface CoveredTopic {
  id: string;
  title: string;
  subject: string;
  coveredDate: string;
  category: string;
  importance: 'High' | 'Medium' | 'Low';
}

const mockCoveredTopics: CoveredTopic[] = [
  { id: '1', title: 'Big O Notation & Complexity', subject: 'CS101', category: 'Theory', coveredDate: 'Oct 24, 2023', importance: 'High' },
  { id: '2', title: 'Binary Search Trees', subject: 'CS101', category: 'Data Structures', coveredDate: 'Oct 24, 2023', importance: 'High' },
  { id: '3', title: 'Integration by Parts', subject: 'Calculus II', category: 'Calculus', coveredDate: 'Oct 23, 2023', importance: 'Medium' },
  { id: '4', title: 'Taylor Series Basics', subject: 'Calculus II', category: 'Series', coveredDate: 'Oct 23, 2023', importance: 'High' },
  { id: '5', title: 'Cognitive Behavioral Therapy', subject: 'Psychology', category: 'Clinical', coveredDate: 'Oct 21, 2023', importance: 'Medium' },
  { id: '6', title: 'Industrial Revolution Impacts', subject: 'World History', category: 'Modern History', coveredDate: 'Oct 20, 2023', importance: 'Low' },
  { id: '7', title: 'Quick Sort Algorithm', subject: 'CS101', category: 'Sorting', coveredDate: 'Oct 19, 2023', importance: 'High' },
];

const subjectsList = ['All Subjects', 'CS101', 'Calculus II', 'Psychology', 'World History'];

const Tasks: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    return mockCoveredTopics.filter(topic => {
      const matchesSubject = selectedSubject === 'All Subjects' || topic.subject === selectedSubject;
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [selectedSubject, searchQuery]);

  // Group topics by date
  const groupedTopics = useMemo(() => {
    const groups: { [key: string]: CoveredTopic[] } = {};
    filteredTopics.forEach(topic => {
      if (!groups[topic.coveredDate]) groups[topic.coveredDate] = [];
      groups[topic.coveredDate].push(topic);
    });
    return groups;
  }, [filteredTopics]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTopics).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [groupedTopics]);

  const coveragePercent = useMemo(() => {
    // Simulated coverage logic
    if (selectedSubject === 'All Subjects') return 68;
    if (selectedSubject === 'CS101') return 82;
    if (selectedSubject === 'Calculus II') return 45;
    return 60;
  }, [selectedSubject]);

  // Circle constants
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (coveragePercent / 100) * circumference;

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Syllabus Tracker</h1>
            <p className="text-[#94a3b8] font-medium italic">Tracing your academic progress through the semester.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9] text-[20px]">filter_list</span>
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-surface-dark border border-border-dark rounded-xl text-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer transition-all appearance-none"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9] text-[20px]">search</span>
              <input 
                type="text"
                placeholder="Find a topic..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-dark border border-border-dark rounded-xl text-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Coverage Progress Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-9xl text-white">auto_awesome</span>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative size-32 flex items-center justify-center">
               <svg className="size-full -rotate-90 overflow-visible" viewBox="0 0 128 128">
                {/* Background track */}
                <circle 
                  cx="64" cy="64" r={radius} 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  className="text-slate-800" 
                />
                {/* Progress bar */}
                <circle 
                  cx="64" cy="64" r={radius} 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  className="text-indigo-500 transition-all duration-1000 ease-out" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={offset} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{coveragePercent}%</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">{selectedSubject} Curriculum</h3>
              <p className="text-indigo-200/60 font-medium mt-1">
                You have covered <span className="text-white font-bold">{filteredTopics.length} core topics</span> in this context. 
                {coveragePercent > 70 ? " You're ahead of the schedule!" : " Keep moving through the syllabus."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-indigo-300">Total: 42 Topics</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-green-400">Mastered: 12</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-amber-400">Reviewing: 5</span>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Download Summary
            </button>
          </div>
        </div>

        {/* Timeline View */}
        <div className="relative flex flex-col gap-12 pl-6 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-px bg-slate-800 hidden md:block"></div>

          {sortedDates.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 select-none">
              <span className="material-symbols-outlined text-7xl mb-4">history_edu</span>
              <p className="text-lg font-black uppercase tracking-widest">No topics found</p>
              <p className="text-sm mt-1">Try adjusting your filters or subject context.</p>
            </div>
          ) : (
            sortedDates.map((date, index) => (
              <div key={date} className="relative group">
                {/* Date Marker (Desktop) */}
                <div className="hidden md:flex absolute left-[50%] -translate-x-1/2 -top-6 bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-full z-10 shadow-xl group-hover:border-indigo-500 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{date}</span>
                </div>
                
                {/* Date Marker (Mobile) */}
                <div className="md:hidden absolute -left-6 top-0 w-12 h-12 flex items-center justify-center bg-indigo-500 rounded-full border-4 border-slate-900 z-10">
                  <span className="material-symbols-outlined text-white text-[18px]">calendar_today</span>
                </div>
                <div className="md:hidden mb-4 ml-10">
                   <span className="text-sm font-black uppercase tracking-widest text-indigo-400">{date}</span>
                </div>

                {/* Topics Grid for this date */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {groupedTopics[date].map((topic, tIndex) => (
                    <div 
                      key={topic.id}
                      className={`relative bg-surface-dark border border-white/5 p-6 rounded-3xl hover:border-primary/40 transition-all group/card shadow-lg ${
                        index % 2 === 0 ? (tIndex === 0 ? 'md:mr-10' : 'md:ml-10') : (tIndex === 0 ? 'md:ml-10' : 'md:mr-10')
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          topic.subject === 'CS101' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                          topic.subject === 'Calculus II' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          topic.subject === 'Psychology' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-600/20'
                        }`}>
                          {topic.subject}
                        </span>
                        <div className="flex gap-2">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                            topic.importance === 'High' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' :
                            topic.importance === 'Medium' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' :
                            'text-slate-400 border-slate-400/20 bg-slate-400/5'
                          }`}>
                            {topic.importance} Impact
                          </span>
                        </div>
                      </div>

                      <h4 className="text-white font-bold text-lg mb-2 group-hover/card:text-indigo-400 transition-colors leading-tight">
                        {topic.title}
                      </h4>
                      <p className="text-[#94a3b8] text-sm font-medium mb-4 line-clamp-2">
                        Successfully covered {topic.category.toLowerCase()} concepts and validated through practical exercises.
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-[#64748b]">
                          <span className="material-symbols-outlined text-[16px]">category</span>
                          <span className="text-xs font-bold uppercase tracking-tight">{topic.category}</span>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-white transition-colors">
                          VIEW RESOURCES
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;

import React, { useState, useMemo } from "react";
import { subjectsAPI } from "../services/api";

const Tasks: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const data = await subjectsAPI.getTotalSubjectsWithData();
        setSubjects(data);
      } catch (e) {
        console.error("Failed to fetch syllabus", e);
      }
    };
    fetchSyllabus();
  }, []);

  const filteredSubjects = useMemo(() => {
    if (selectedSubjectId === "All") return subjects;
    return subjects.filter((s) => s._id === selectedSubjectId);
  }, [subjects, selectedSubjectId]);

  // Calculate global stats
  const stats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;

    filteredSubjects.forEach((sub) => {
      sub.chapters.forEach((chap: any) => {
        chap.subtopics.forEach((topic: any) => {
          totalTopics++;
          if (topic.isCompleted) completedTopics++;
        });
      });
    });

    return {
      total: totalTopics,
      completed: completedTopics,
      percentage:
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
    };
  }, [filteredSubjects]);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
              Syllabus Tracker
            </h1>
            <p className="text-[#94a3b8] font-medium italic">
              Tracing your academic progress through the semester.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9] text-[20px]">
                filter_list
              </span>
              <select
                className="w-full pl-10 pr-4 py-2.5 bg-surface-dark border border-border-dark rounded-xl text-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer transition-all appearance-none"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                <option value="All">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9] text-[20px]">
                search
              </span>
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
            <span className="material-symbols-outlined text-9xl text-white">
              auto_awesome
            </span>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative size-32 flex items-center justify-center">
              <svg
                className="size-full -rotate-90 overflow-visible"
                viewBox="0 0 128 128"
              >
                {/* Background track */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                />
                {/* Progress bar */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
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
                <span className="text-2xl font-black text-white">
                  {stats.percentage}%
                </span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {selectedSubjectId === "All" ? "Combined" : "Subject"}{" "}
                Curriculum
              </h3>
              <p className="text-indigo-200/60 font-medium mt-1">
                You have covered{" "}
                <span className="text-white font-bold">
                  {stats.completed} topics
                </span>{" "}
                across all modules.
                {stats.percentage > 70
                  ? " You're ahead of the schedule!"
                  : " Keep moving through the syllabus."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-indigo-300">
                  Total: {stats.total} Topics
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-green-400">
                  Completed: {stats.completed}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-amber-400">
                  Remaining: {stats.total - stats.completed}
                </span>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Download Summary
            </button>
          </div>
        </div>

        {/* Syllabus Tree View */}
        <div className="flex flex-col gap-8">
          {filteredSubjects.length === 0 ? (
            <div className="py-20 text-center opacity-50">
              <p className="text-xl font-bold text-white">
                No syllabus data found.
              </p>
            </div>
          ) : (
            filteredSubjects.map((subject) => (
              <div
                key={subject._id}
                className="bg-surface-dark border border-white/5 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white">
                    {subject.subjectName}
                  </h2>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-indigo-500/20">
                    {subject.totalChapter} Chapters
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  {subject.chapters.map((chapter: any, cIdx: number) => (
                    <div
                      key={cIdx}
                      className="bg-background-dark/50 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                    >
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                        <span className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                          {chapter.section}
                        </span>
                        {chapter.name}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {chapter.subtopics.map((topic: any, tIdx: number) => {
                          const matchesSearch =
                            !searchQuery ||
                            topic.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase());
                          if (!matchesSearch) return null;

                          return (
                            <div
                              key={tIdx}
                              className={`px-4 py-3 rounded-lg border-b border-white/5 flex items-center justify-between gap-4 transition-all ${
                                topic.isCompleted
                                  ? "bg-emerald-500/10 border-l-4 border-l-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                  : "hover:bg-white/5 text-slate-400 border-l-4 border-l-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-widest w-6 ${
                                    topic.isCompleted
                                      ? "text-emerald-500"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {tIdx + 1 < 10 ? `0${tIdx + 1}` : tIdx + 1}
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    topic.isCompleted
                                      ? "text-emerald-100"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {topic.name}
                                </span>
                              </div>

                              {topic.isCompleted && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                  Done
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {(!subject.chapters || subject.chapters.length === 0) && (
                    <div className="text-center py-8 text-slate-500 italic">
                      No chapters defined for this subject.
                    </div>
                  )}
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

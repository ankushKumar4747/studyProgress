import React, { useState, useMemo, useEffect } from "react";
import { subjectsAPI } from "../services/api";

interface CompletedTopic {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  completedDate: string;
  studyHours: number;
  category: string;
  importance: "High" | "Medium" | "Low";
}

const mockCompletedTopics: CompletedTopic[] = [
  {
    id: "1",
    title: "Big O Notation & Complexity",
    subject: "Computer Science 101",
    subjectCode: "CS101",
    category: "Theory",
    completedDate: "2023-10-24",
    studyHours: 2.5,
    importance: "High",
  },
  {
    id: "2",
    title: "Binary Search Trees",
    subject: "Computer Science 101",
    subjectCode: "CS101",
    category: "Data Structures",
    completedDate: "2023-10-24",
    studyHours: 3.0,
    importance: "High",
  },
  {
    id: "3",
    title: "Integration by Parts",
    subject: "Calculus II",
    subjectCode: "MATH202",
    category: "Calculus",
    completedDate: "2023-10-23",
    studyHours: 2.0,
    importance: "Medium",
  },
  {
    id: "4",
    title: "Taylor Series Basics",
    subject: "Calculus II",
    subjectCode: "MATH202",
    category: "Series",
    completedDate: "2023-10-23",
    studyHours: 1.5,
    importance: "High",
  },
  {
    id: "5",
    title: "Cognitive Behavioral Therapy",
    subject: "Intro to Psychology",
    subjectCode: "PSYCH110",
    category: "Clinical",
    completedDate: "2023-10-21",
    studyHours: 2.5,
    importance: "Medium",
  },
  {
    id: "6",
    title: "Industrial Revolution Impacts",
    subject: "World History",
    subjectCode: "HIST101",
    category: "Modern History",
    completedDate: "2023-10-20",
    studyHours: 1.0,
    importance: "Low",
  },
  {
    id: "7",
    title: "Quick Sort Algorithm",
    subject: "Computer Science 101",
    subjectCode: "CS101",
    category: "Sorting",
    completedDate: "2023-10-19",
    studyHours: 2.0,
    importance: "High",
  },
  {
    id: "8",
    title: "Hash Tables & Collision Resolution",
    subject: "Computer Science 101",
    subjectCode: "CS101",
    category: "Data Structures",
    completedDate: "2023-10-19",
    studyHours: 2.5,
    importance: "High",
  },
  {
    id: "9",
    title: "Polar Coordinates",
    subject: "Calculus II",
    subjectCode: "MATH202",
    category: "Coordinate Systems",
    completedDate: "2023-10-18",
    studyHours: 1.5,
    importance: "Medium",
  },
  {
    id: "10",
    title: "Social Dynamics & Group Behavior",
    subject: "Intro to Psychology",
    subjectCode: "PSYCH110",
    category: "Social Psychology",
    completedDate: "2023-10-17",
    studyHours: 2.0,
    importance: "Medium",
  },
];

const subjectColors: { [key: string]: string } = {
  CS101: "indigo",
  MATH202: "rose",
  PSYCH110: "amber",
  HIST101: "slate",
};

const Completed: React.FC = () => {
  const [subjects, setSubjects] = useState<
    {
      id: string;
      name: string;
      totalChapters: number;
      completed: number;
      incompleted: number;
    }[]
  >([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [subjectProgress, setSubjectProgress] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsAPI.getUserSubjects();
        if (data.subjects) {
          setSubjects(data.subjects);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubjectId) {
      setSubjectProgress(null);
      return;
    }

    const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
    if (selectedSubject) {
      const total = selectedSubject.completed + selectedSubject.incompleted;
      const percentage =
        total > 0 ? Math.round((selectedSubject.completed / total) * 100) : 0;

      setSubjectProgress({
        completionPercentage: percentage,
        completedTopics: selectedSubject.completed,
        totalTopics: total,
        incompletedTopics: selectedSubject.incompleted,
        totalChapters: selectedSubject.totalChapters,
      });
    }
  }, [selectedSubjectId, subjects]);

  const filteredTopics = useMemo(() => {
    return mockCompletedTopics.filter((topic) => {
      // Logic for filtering by subjects would go here if we had backend task data
      const matchesDate = !selectedDate || topic.completedDate === selectedDate;
      return matchesDate;
    });
  }, [selectedDate]);

  const topicsBySubject = useMemo(() => {
    const groups: { [key: string]: CompletedTopic[] } = {};
    filteredTopics.forEach((topic) => {
      if (!groups[topic.subject]) groups[topic.subject] = [];
      groups[topic.subject].push(topic);
    });
    return groups;
  }, [filteredTopics]);

  const dateStudyStats = useMemo(() => {
    if (!selectedDate) return null;

    const topicsOnDate = mockCompletedTopics.filter(
      (t) => t.completedDate === selectedDate
    );
    const totalHours = topicsOnDate.reduce((sum, t) => sum + t.studyHours, 0);

    const subjectHours: {
      [key: string]: { hours: number; topics: number; code: string };
    } = {};
    topicsOnDate.forEach((topic) => {
      if (!subjectHours[topic.subject]) {
        subjectHours[topic.subject] = {
          hours: 0,
          topics: 0,
          code: topic.subjectCode,
        };
      }
      subjectHours[topic.subject].hours += topic.studyHours;
      subjectHours[topic.subject].topics += 1;
    });

    return { totalHours, subjectHours, topicCount: topicsOnDate.length };
  }, [selectedDate]);

  const availableDates = useMemo(() => {
    return Array.from(
      new Set(mockCompletedTopics.map((t) => t.completedDate))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalCompletedTopics = filteredTopics.length;
  const totalStudyHours = filteredTopics.reduce(
    (sum, t) => sum + t.studyHours,
    0
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-[1400px] flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
              Completed Topics
            </h1>
            <p className="text-[#94a3b8] font-medium italic">
              Track your learning journey and study progress.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/20 to-surface-dark border border-primary/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  calendar_month
                </span>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Select Date
              </h3>
            </div>

            <select
              className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer transition-all"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">All Dates</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>

            {selectedDate && dateStudyStats && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-black uppercase tracking-widest text-[#92a9c9] mb-2">
                  Study Summary
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {dateStudyStats.totalHours.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-[#92a9c9]">
                    hours
                  </span>
                </div>
                <p className="text-xs text-[#92a9c9] mt-1">
                  {dateStudyStats.topicCount} topics completed
                </p>
              </div>
            )}
          </div>

          <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-indigo-500">
                auto_awesome
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[#92a9c9] text-xs font-black uppercase tracking-widest mb-2">
                Subject Progress
              </p>
              <div className="mb-4">
                <select
                  className="w-full px-4 py-3 bg-background-dark/50 border border-white/10 rounded-xl text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer transition-all appearance-none"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  <option value="">Select Subject to View</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {subjectProgress ? (
                <>
                  <h3 className="text-4xl font-black text-white">
                    {subjectProgress.completionPercentage}%
                  </h3>
                  <p className="text-sm text-[#92a9c9] mt-2">
                    {subjectProgress.completedTopics} /{" "}
                    {subjectProgress.totalTopics} topics completed
                  </p>
                  <p className="text-xs text-[#92a9c9] mt-1">
                    {subjectProgress.incompletedTopics} remaining
                  </p>
                  <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${subjectProgress.completionPercentage}%`,
                      }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-4xl font-black text-white">-</h3>
                  <p className="text-sm text-[#92a9c9] mt-2">
                    No subject selected
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-amber-500">
                menu_book
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[#92a9c9] text-xs font-black uppercase tracking-widest mb-2">
                Chapters
              </p>
              {subjectProgress ? (
                <>
                  <h3 className="text-4xl font-black text-white">
                    {subjectProgress.totalChapters}
                  </h3>
                  <p className="text-sm text-[#92a9c9] mt-2">
                    Total chapters in syllabus
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-4xl font-black text-white">-</h3>
                  <p className="text-sm text-[#92a9c9] mt-2">
                    Select a subject
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {selectedDate && dateStudyStats && (
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-indigo-400 text-[28px]">
                insights
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Study Breakdown - {formatDate(selectedDate)}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dateStudyStats.subjectHours).map(
                ([subject, data]: [
                  string,
                  { hours: number; topics: number; code: string }
                ]) => {
                  const color = subjectColors[data.code] || "slate";
                  return (
                    <div
                      key={subject}
                      className="bg-background-dark/50 border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                            color === "indigo"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              : color === "rose"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : color === "amber"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-600/20"
                          }`}
                        >
                          {data.code}
                        </span>
                        <span className="text-2xl font-black text-white">
                          {data.hours.toFixed(1)}h
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1">
                        {subject}
                      </h4>
                      <p className="text-xs text-[#92a9c9]">
                        {data.topics} topic{data.topics !== 1 ? "s" : ""}{" "}
                        covered
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        <div className="space-y-8">
          {Object.keys(topicsBySubject).length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 select-none">
              <span className="material-symbols-outlined text-7xl mb-4">
                history_edu
              </span>
              <p className="text-lg font-black uppercase tracking-widest text-white">
                No topics found
              </p>
              <p className="text-sm mt-1 text-[#92a9c9]">
                Try adjusting your filters or date selection.
              </p>
            </div>
          ) : (
            Object.entries(topicsBySubject).map(
              ([subject, topics]: [string, CompletedTopic[]]) => {
                const subjectCode = topics[0].subjectCode;
                const color = subjectColors[subjectCode] || "slate";
                const subjectTotalHours = topics.reduce(
                  (sum, t) => sum + t.studyHours,
                  0
                );

                return (
                  <div key={subject} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`size-3 rounded-full ${
                            color === "indigo"
                              ? "bg-indigo-500"
                              : color === "rose"
                              ? "bg-rose-500"
                              : color === "amber"
                              ? "bg-amber-500"
                              : "bg-slate-500"
                          }`}
                        ></div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                          {subject}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                            color === "indigo"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              : color === "rose"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : color === "amber"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-600/20"
                          }`}
                        >
                          {subjectCode}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-widest text-[#92a9c9]">
                          Total Time
                        </p>
                        <p className="text-xl font-black text-white">
                          {subjectTotalHours.toFixed(1)}h
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="bg-surface-dark border border-white/5 p-5 rounded-2xl hover:border-primary/40 transition-all group/card shadow-lg"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                                topic.importance === "High"
                                  ? "text-rose-400 border-rose-400/20 bg-rose-400/5"
                                  : topic.importance === "Medium"
                                  ? "text-amber-400 border-amber-400/20 bg-amber-400/5"
                                  : "text-slate-400 border-slate-400/20 bg-slate-400/5"
                              }`}
                            >
                              {topic.importance}
                            </span>
                            <div className="flex items-center gap-1 text-primary">
                              <span className="material-symbols-outlined text-[16px]">
                                schedule
                              </span>
                              <span className="text-sm font-black">
                                {topic.studyHours}h
                              </span>
                            </div>
                          </div>

                          <h4 className="text-white font-bold text-base mb-2 group-hover/card:text-primary transition-colors leading-tight">
                            {topic.title}
                          </h4>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                            <div className="flex items-center gap-2 text-[#64748b]">
                              <span className="material-symbols-outlined text-[14px]">
                                category
                              </span>
                              <span className="text-xs font-bold uppercase tracking-tight">
                                {topic.category}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#92a9c9]">
                              {formatDate(topic.completedDate)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Completed;

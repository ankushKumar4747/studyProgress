import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { studyGoalAPI, subjectsAPI } from "../services/api";

const studyData = [
  { name: "Mon", hours: 4.5, goal: 5 },
  { name: "Tue", hours: 6.2, goal: 5 },
  { name: "Wed", hours: 3.8, goal: 5 },
  { name: "Thu", hours: 7.1, goal: 5 },
  { name: "Fri", hours: 2.0, goal: 5 },
  { name: "Sat", hours: 1.5, goal: 2 },
  { name: "Sun", hours: 4.0, goal: 2 },
];

const ENROLLED_SUBJECTS = [
  {
    id: "cs101",
    name: "Computer Science 101",
    code: "CS101",
    color: "indigo",
    topics: [
      "Big O Notation",
      "Data Structures",
      "Recursion",
      "Sorting Algorithms",
    ],
  },
  {
    id: "math202",
    name: "Calculus II",
    code: "MATH202",
    color: "rose",
    topics: ["Integration", "Series", "Polar Coordinates", "Vector Calculus"],
  },
  {
    id: "psych110",
    name: "Intro to Psychology",
    code: "PSYCH110",
    color: "amber",
    topics: [
      "Cognitive Bias",
      "Behavioral Science",
      "Neuroscience",
      "Social Dynamics",
    ],
  },
  {
    id: "hist101",
    name: "World History",
    code: "HIST101",
    color: "slate",
    topics: [
      "Industrial Revolution",
      "French Revolution",
      "Cold War",
      "Modern Era",
    ],
  },
];

const Dashboard: React.FC = () => {
  // activeSubject is derived from the fetched subjects, so we should strictly type it or use any for flexibility with the new chapters data
  const [activeSubject, setActiveSubject] = useState<any | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(300); // Default 5 hours
  const [studiedTodayMinutes, setStudiedTodayMinutes] = useState(252); // Mock 4.2 hours
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isLoadingGoal, setIsLoadingGoal] = useState(false);
  const [tempHours, setTempHours] = useState(Math.floor(dailyGoalMinutes / 60));
  const [tempMins, setTempMins] = useState(dailyGoalMinutes % 60);
  const [currentStreak, setCurrentStreak] = useState(12); // Default value

  // Fetch study goal and streak on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch study goal
        const goalResponse = await studyGoalAPI.getStudyGoal();
        if (goalResponse.minutes) {
          setDailyGoalMinutes(goalResponse.minutes);
        }

        // Fetch streak
        const streakResponse = await studyGoalAPI.getStreak();
        if (streakResponse.streak !== undefined) {
          setCurrentStreak(streakResponse.streak);
        }

        // Fetch study time
        const timeResponse = await subjectsAPI.getStudyTime();
        if (timeResponse.totalStudyMinutes !== undefined) {
          setStudiedTodayMinutes(timeResponse.totalStudyMinutes);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const [focusDistribution, setFocusDistribution] = useState<any[]>(studyData);
  useEffect(() => {
    const fetchFocusDistribution = async () => {
      try {
        const data = await subjectsAPI.getWeeklyFocusDistribution();
        if (Array.isArray(data)) {
          setFocusDistribution(data);
        }
      } catch (err) {
        console.error("Failed to fetch focus distribution:", err);
      }
    };
    fetchFocusDistribution();
  }, []);

  const [subjects, setSubjects] = useState<any[]>([]);
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsAPI.getTotalSubjectsWithData();
        // Enrich data with color and code for UI
        const colors = ["indigo", "rose", "amber", "slate", "emerald", "blue"];
        const enrichedSubjects = data.map((sub: any, index: number) => ({
          ...sub,
          id: sub._id,
          name: sub.subjectName,
          code: sub.subjectName.substring(0, 3).toUpperCase() + "101",
          color: colors[index % colors.length],
          topics: sub.chapters.flatMap((c: any) =>
            c.subtopics.map((s: any) => s.name)
          ),
          chapters: sub.chapters,
        }));
        setSubjects(enrichedSubjects);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  const [masteryData, setMasteryData] = useState<any>({
    totalHours: 0,
    subjects: [],
  });

  useEffect(() => {
    const fetchMastery = async () => {
      try {
        const data = await subjectsAPI.getWeeklyMastery();
        if (data) {
          setMasteryData(data);
        }
      } catch (err) {
        console.error("Failed to fetch mastery data:", err);
      }
    };
    fetchMastery();
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => setIsTimerRunning(true);
  const handleStopSession = async () => {
    setIsTimerRunning(false);
    setIsSessionFinished(true);

    if (activeSubject?.id && timerSeconds > 0) {
      try {
        const minutes = Math.ceil(timerSeconds / 60);
        await subjectsAPI.updateStudyTime(minutes, activeSubject.id);
        console.log("Study time updated:", minutes);
      } catch (error) {
        console.error("Failed to update study time:", error);
      }
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = Number(tempHours) * 60 + Number(tempMins);
    setIsLoadingGoal(true);

    try {
      // Step 1: Update the study goal
      await studyGoalAPI.updateStudyGoal(totalMinutes);

      // Step 2: Fetch the updated goal from backend to confirm
      const response = await studyGoalAPI.getStudyGoal();
      if (response.minutes) {
        setDailyGoalMinutes(response.minutes);
        console.log(
          "✅ Study goal updated and refreshed:",
          response.minutes,
          "minutes"
        );
      }

      setIsEditingGoal(false);
    } catch (err) {
      console.error("Failed to update study goal:", err);
      alert("Failed to update study goal. Please try again.");
    } finally {
      setIsLoadingGoal(false);
    }
  };

  const progressPercent = Math.min(
    Math.round((studiedTodayMinutes / dailyGoalMinutes) * 100),
    100
  );
  const remainingMinutes = Math.max(dailyGoalMinutes - studiedTodayMinutes, 0);

  const formatMinutesToDisplay = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, Jamie!
            </h2>
            <p className="text-[#92a9c9] mt-1 italic">
              "The beautiful thing about learning is that no one can take it
              away from you."
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-indigo-500">
                menu_book
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[#92a9c9] text-sm font-semibold uppercase tracking-wider">
                  Study Goal Today
                </p>
                <button
                  onClick={() => {
                    setTempHours(Math.floor(dailyGoalMinutes / 60));
                    setTempMins(dailyGoalMinutes % 60);
                    setIsEditingGoal(true);
                  }}
                  className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#92a9c9] hover:text-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                </button>
              </div>
              <h3 className="text-3xl font-black text-white mt-1">
                {(studiedTodayMinutes / 60).toFixed(1)}h
                <span className="text-lg text-[#5a6b85] font-normal">
                  {" "}
                  / {(dailyGoalMinutes / 60).toFixed(1)}h
                </span>
              </h3>
              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#92a9c9] mt-3">
                {remainingMinutes > 0
                  ? `Keep going! Just ${formatMinutesToDisplay(
                      remainingMinutes
                    )} to target.`
                  : "Daily goal achieved! Excellent work today!"}
              </p>
            </div>
          </div>

          <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-amber-500">
                local_fire_department
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[#92a9c9] text-sm font-semibold uppercase tracking-wider">
                Work Streak
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                {currentStreak}{" "}
                <span className="text-lg text-[#5a6b85] font-normal">Days</span>
              </h3>
              <p className="text-sm text-amber-400 mt-2 flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">
                  trending_up
                </span>
                {currentStreak > 0
                  ? "Keep it going!"
                  : "Start your streak today!"}
              </p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= Math.min(currentStreak, 7)
                        ? "bg-amber-500"
                        : "bg-slate-700"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-rose-500">
                assignment_turned_in
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[#92a9c9] text-sm font-semibold uppercase tracking-wider">
                Course Progress
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                14{" "}
                <span className="text-lg text-[#5a6b85] font-normal">/ 18</span>
              </h3>
              <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  check_circle
                </span>
                Ahead of schedule
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Total Subjects ({subjects.length})
              </h3>
              <span className="text-xs font-bold text-[#5a6b85] uppercase tracking-widest">
                Select to start working
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setActiveSubject(sub)}
                  className="group bg-surface-dark p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px]"
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      sub.color === "indigo"
                        ? "bg-indigo-500"
                        : sub.color === "rose"
                        ? "bg-rose-500"
                        : sub.color === "amber"
                        ? "bg-amber-500"
                        : "bg-slate-500"
                    }`}
                  ></div>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        sub.color === "indigo"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                          : sub.color === "rose"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : sub.color === "amber"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}
                    >
                      {sub.code}
                    </span>
                    <h4 className="text-white font-bold text-lg mt-3 leading-tight group-hover:text-primary transition-colors">
                      {sub.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5a6b85] mt-4 uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[16px]">
                      timer
                    </span>
                    Start Study Session
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-dark rounded-2xl border border-white/5 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Focus Distribution
                  </h3>
                  <p className="text-sm text-[#92a9c9]">
                    Weekly hours per subject
                  </p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={focusDistribution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#334155"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#1e293b" }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="goal"
                      fill="#6366f133"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-dark rounded-2xl border border-white/5 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">
                Mastery Overview (Last 7 Days)
              </h3>
              <div className="flex flex-col items-center justify-center mb-8 relative">
                <div className="size-48 rounded-full border-[12px] border-slate-800 relative flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-3xl font-black text-white">
                      {masteryData.totalHours}h
                    </span>
                    <span className="text-xs font-bold text-[#92a9c9] uppercase tracking-widest">
                      Total Focus
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {masteryData.subjects.length > 0 ? (
                  masteryData.subjects.map((sub: any, index: number) => {
                    // Assign colors cyclically or randomly if not provided
                    const colors = [
                      "bg-indigo-500",
                      "bg-rose-500",
                      "bg-amber-500",
                      "bg-emerald-500",
                      "bg-slate-500",
                    ];
                    const color = colors[index % colors.length];

                    return (
                      <CategoryRow
                        key={index}
                        label={sub.subjectName}
                        color={color}
                        time={`${sub.hours}h`}
                        percent={`${sub.percent}%`}
                      />
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-sm text-center">
                    No study data for the last 7 days.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Modal */}
      {activeSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background-dark/80 backdrop-blur-md"
            onClick={() => !isTimerRunning && setActiveSubject(null)}
          ></div>
          <div className="relative bg-surface-dark border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div
              className={`absolute top-0 left-0 w-full h-2 ${
                activeSubject.color === "indigo"
                  ? "bg-indigo-500"
                  : activeSubject.color === "rose"
                  ? "bg-rose-500"
                  : activeSubject.color === "amber"
                  ? "bg-amber-500"
                  : "bg-slate-500"
              }`}
            ></div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Active Session
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">
                  {activeSubject.name}
                </h2>
              </div>
              {!isTimerRunning && (
                <button
                  onClick={() => setActiveSubject(null)}
                  className="size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              )}
            </div>

            <div className="flex flex-col items-center gap-8 py-4">
              <div className="relative flex items-center justify-center">
                <div className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  {formatTime(timerSeconds)}
                </div>
              </div>

              {/* Controls Area */}
              <div className="flex items-center justify-center gap-4 w-full">
                {!isTimerRunning && !isSessionFinished ? (
                  <button
                    onClick={() => {
                      setIsTimerRunning(true);
                      setIsSessionFinished(false);
                    }}
                    className="w-full py-4 bg-primary rounded-2xl text-white font-bold text-lg hover:bg-indigo-400 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      play_arrow
                    </span>
                    Start Focus
                  </button>
                ) : isTimerRunning ? (
                  <button
                    onClick={handleStopSession}
                    className="w-full py-4 bg-rose-500 rounded-2xl text-white font-bold text-lg hover:bg-rose-400 transition-all shadow-lg hover:shadow-rose-500/25 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">stop</span>
                    Stop Session
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveSubject(null);
                      setIsSessionFinished(false);
                      setTimerSeconds(0);
                    }}
                    className="w-full py-4 bg-slate-700 rounded-2xl text-white font-bold text-lg hover:bg-slate-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">close</span>
                    Close Session
                  </button>
                )}
              </div>

              {/* Conditional Roadmap / Topics View */}
              {isSessionFinished && (
                <div className="w-full mt-2 animate-in slide-in-from-bottom-4 fade-in duration-500 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-[#5a6b85] uppercase tracking-widest">
                      Session Map
                    </label>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      Review Progress
                    </span>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {activeSubject.chapters?.map((chapter: any, i: number) => (
                      <div
                        key={i}
                        className="bg-background-dark/30 rounded-xl p-4 border border-white/5"
                      >
                        <h4 className="text-white font-bold text-sm mb-3 sticky top-0 bg-transparent backdrop-blur-sm z-10 flex items-center justify-between">
                          {chapter.name}
                          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-white/5">
                            Sec {chapter.section}
                          </span>
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {chapter.subtopics.map((sub: any, j: number) => (
                            <div
                              key={j}
                              className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                                sub.isCompleted
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-slate-800/50 border-white/5 text-slate-400"
                              }`}
                            >
                              <span>{sub.name}</span>
                              {sub.isCompleted && (
                                <span className="material-symbols-outlined text-[16px]">
                                  check_circle
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {(!activeSubject.chapters ||
                      activeSubject.chapters.length === 0) && (
                      <p className="text-slate-500 text-center text-sm py-4">
                        No detailed roadmap available.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {isTimerRunning && (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="size-1.5 rounded-full bg-primary animate-bounce"></div>
                    <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Focusing on {selectedTopic}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Daily Goal Edit Modal */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background-dark/80 backdrop-blur-md"
            onClick={() => setIsEditingGoal(false)}
          ></div>
          <div className="relative bg-surface-dark border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">Daily Target</h2>
              <button
                onClick={() => setIsEditingGoal(false)}
                className="size-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleUpdateGoal} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#92a9c9] uppercase tracking-wider">
                    Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={tempHours}
                    onChange={(e) =>
                      setTempHours(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full px-4 py-3 bg-background-dark/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#92a9c9] uppercase tracking-wider">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={tempMins}
                    onChange={(e) =>
                      setTempMins(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full px-4 py-3 bg-background-dark/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoadingGoal}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingGoal ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Goal"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryRow: React.FC<{
  label: string;
  color: string;
  time: string;
  percent: string;
}> = ({ label, color, time, percent }) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-3">
      <div
        className={`size-2.5 rounded-full ${color} group-hover:scale-125 transition-transform`}
      ></div>
      <span className="text-sm text-white font-semibold group-hover:text-primary transition-colors">
        {label}
      </span>
    </div>
    <span className="text-sm font-bold text-[#92a9c9]">
      {time} ({percent})
    </span>
  </div>
);

export default Dashboard;

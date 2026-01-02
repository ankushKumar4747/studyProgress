import React from "react";
import { useTimer } from "../context/TimerContext";
import { useLocation, useNavigate } from "react-router-dom";
import { subjectsAPI } from "../services/api";

const FloatingTimer: React.FC = () => {
  const {
    activeSubject,
    isTimerRunning,
    setIsTimerRunning,
    timerSeconds,
    formatTime,
    isMinimized,
    setIsMinimized,
    handleStopSession,
    setActiveSubject,
    isSessionFinished,
    setIsSessionFinished,
    setTimerSeconds,
    selectedSubtopics,
    setSelectedSubtopics,
    toggleSubtopic,
  } = useTimer();

  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  // Show if there is an active subject
  const shouldShow = !!activeSubject;

  if (!shouldShow) return null;

  const handleSaveAndClose = async () => {
    try {
      // Update the chapters with selected topics marked as completed
      const updatedChapters = activeSubject.chapters.map((chapter: any) => ({
        ...chapter,
        subtopics: chapter.subtopics.map((subtopic: any) => ({
          ...subtopic,
          isCompleted:
            selectedSubtopics.includes(subtopic.name) || subtopic.isCompleted,
        })),
      }));

      // Prepare the data to send to backend
      const subjectData = {
        _id: activeSubject.id || activeSubject._id,
        subjectName: activeSubject.subjectName || activeSubject.name,
        totalChapter: activeSubject.totalChapter,
        chapters: updatedChapters,
        userId: activeSubject.userId,
        createdAt: activeSubject.createdAt,
        updatedAt: activeSubject.updatedAt,
      };

      console.log("Sending completed topics to backend:", subjectData);

      // Send to backend
      await subjectsAPI.updateCompletedTopics(subjectData);

      console.log("✅ Completed topics updated successfully!");

      // Also update study time with number of completed topics
      if (timerSeconds > 0) {
        const minutes = Math.ceil(timerSeconds / 60);
        const numberOfCompletedTopics = selectedSubtopics.length;

        await subjectsAPI.updateStudyTime(
          minutes,
          activeSubject.id || activeSubject._id,
          numberOfCompletedTopics
        );
        console.log(
          `✅ Study time updated: ${minutes} minutes, ${numberOfCompletedTopics} topics completed`
        );
      }
    } catch (error) {
      console.error("❌ Failed to update completed topics:", error);
    } finally {
      // Reset state
      setActiveSubject(null);
      setTimerSeconds(0);
      setIsSessionFinished(false);
      setSelectedSubtopics([]);
    }
  };

  const colorConfig =
    {
      indigo: "bg-indigo-500",
      rose: "bg-rose-500",
      amber: "bg-amber-500",
      slate: "bg-slate-500",
      emerald: "bg-emerald-500",
      blue: "bg-blue-500",
    }[activeSubject.color as string] || "bg-indigo-500";

  const borderColorConfig =
    {
      indigo: "border-indigo-500/30",
      rose: "border-rose-500/30",
      amber: "border-amber-500/30",
      slate: "border-slate-500/30",
      emerald: "border-emerald-500/30",
      blue: "border-blue-500/30",
    }[activeSubject.color as string] || "border-indigo-500/30";

  if (isSessionFinished) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-md animate-in fade-in duration-300"></div>
        <div className="relative bg-surface-dark border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
          {/* Header with decorative bg */}
          <div className={`relative p-8 pb-6 ${colorConfig} bg-opacity-10`}>
            <div
              className={`absolute inset-0 ${colorConfig} opacity-10 blur-xl`}
            ></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex p-3 rounded-full bg-white/10 mb-4 shadow-lg shadow-black/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-4xl text-white">
                  emoji_events
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                Session Complete!
              </h2>
              <p className="text-[#92a9c9] font-medium">
                Great job! You focused for{" "}
                <span className="text-white font-bold">
                  {formatTime(timerSeconds)}
                </span>{" "}
                on{" "}
                <span className="text-white font-bold">
                  {activeSubject.name}
                </span>
                .
              </p>
              <p className="text-sm text-[#92a9c9]/80 mt-1">
                Select the topics you mastered during this session:
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
              {activeSubject.chapters?.map((chapter: any, i: number) => (
                <div key={i}>
                  <h4 className="flex items-center gap-3 text-sm font-black text-[#5a6b85] uppercase tracking-widest mb-3">
                    <span className="h-px bg-white/10 flex-1"></span>
                    {chapter.name}
                    <span className="h-px bg-white/10 flex-1"></span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapter.subtopics.map((sub: any, j: number) => {
                      const isCompleted = sub.isCompleted;
                      const isSelected = selectedSubtopics.includes(sub.name);

                      return (
                        <div
                          key={j}
                          onClick={() =>
                            !isCompleted && toggleSubtopic(sub.name)
                          }
                          className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-500/5 border-emerald-500/20 opacity-60 grayscale-[0.5]"
                              : isSelected
                              ? `bg-${
                                  activeSubject.color || "indigo"
                                }-500/10 border-${
                                  activeSubject.color || "indigo"
                                }-500/50 shadow-lg shadow-${
                                  activeSubject.color || "indigo"
                                }-500/10`
                              : "bg-background-dark border-white/5 hover:border-white/10 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span
                              className={`text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "text-white"
                                  : "text-slate-400 group-hover:text-slate-200"
                              }`}
                            >
                              {sub.name}
                            </span>
                            {isCompleted ? (
                              <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                                check_circle
                              </span>
                            ) : (
                              <div
                                className={`size-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                  isSelected
                                    ? `bg-${
                                        activeSubject.color || "indigo"
                                      }-500 border-${
                                        activeSubject.color || "indigo"
                                      }-500 scale-110`
                                    : "border-slate-600 group-hover:border-slate-400"
                                }`}
                              >
                                {isSelected && (
                                  <span className="material-symbols-outlined text-[14px] text-white font-bold">
                                    check
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveSubject(null);
                  setTimerSeconds(0);
                  setIsSessionFinished(false);
                  setSelectedSubtopics([]);
                }}
                className="px-6 py-4 rounded-xl text-[#92a9c9] font-bold hover:bg-white/5 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleSaveAndClose}
                className="flex-1 py-4 bg-white text-black font-black text-lg rounded-xl shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">save_as</span>
                Save Progress & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Floating Timer View (Only when session is NOT finished)
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300`}
    >
      <div
        className={`bg-surface-dark border ${borderColorConfig} rounded-2xl shadow-2xl p-4 w-80 backdrop-blur-xl flex flex-col gap-3 group relative overflow-hidden transition-all duration-300`}
      >
        <div
          className={`absolute top-0 left-0 w-1 h-full ${colorConfig}`}
        ></div>

        {/* Header */}
        <div className="flex items-center justify-between pl-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-[#92a9c9] tracking-widest">
              Active Session
            </span>
            <h3 className="text-white font-bold text-sm truncate max-w-[180px]">
              {activeSubject.name}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {!isTimerRunning && (
              <button
                onClick={() => {
                  setActiveSubject(null);
                  setTimerSeconds(0);
                  setIsSessionFinished(false);
                }}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-[#92a9c9] hover:text-rose-400 transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-between pl-3 bg-black/20 rounded-xl p-3 border border-white/5">
          <span className="text-2xl font-black text-white font-mono tracking-tight">
            {formatTime(timerSeconds)}
          </span>
          <div className="flex items-center gap-2">
            {isTimerRunning ? (
              <div className="flex gap-1 h-3 items-end">
                <div
                  className={`w-1 bg-current ${
                    activeSubject.color === "rose"
                      ? "text-rose-400"
                      : "text-primary"
                  } rounded-full animate-[bounce_1s_infinite]`}
                ></div>
                <div
                  className={`w-1 bg-current ${
                    activeSubject.color === "rose"
                      ? "text-rose-400"
                      : "text-primary"
                  } rounded-full animate-[bounce_1s_infinite_0.2s]`}
                ></div>
                <div
                  className={`w-1 bg-current ${
                    activeSubject.color === "rose"
                      ? "text-rose-400"
                      : "text-primary"
                  } rounded-full animate-[bounce_1s_infinite_0.4s]`}
                ></div>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 bg-amber-400/10 rounded">
                Paused
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 pl-3">
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="flex items-center justify-center gap-2 py-2 rounded-xl bg-primary hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              <span className="material-symbols-outlined text-[16px]">
                play_arrow
              </span>{" "}
              Resume
            </button>
          ) : (
            <button
              onClick={() => setIsTimerRunning(false)}
              className="flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              <span className="material-symbols-outlined text-[16px]">
                pause
              </span>{" "}
              Pause
            </button>
          )}
          <button
            onClick={async () => {
              await handleStopSession();
            }}
            className="flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">stop</span>{" "}
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingTimer;

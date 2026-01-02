import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Ariakit from "@ariakit/react";
import { Topic } from "../types";
import { suggestTopics } from "../services/gemini";
import "../index.css";

interface SubjectEntry {
  id: string;
  name: string;
  topics: Topic[];
}

const NewTask: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Subject Management
  const [subjects, setSubjects] = useState<SubjectEntry[]>([]);
  const [subjectInput, setSubjectInput] = useState("");

  // State for Selected Context
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // State for UI
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSubjectName =
    subjects.find((s) => s.id === selectedSubjectId)?.name ||
    "Choose a subject...";

  const addSubject = () => {
    if (!subjectInput.trim()) return;
    const newSub: SubjectEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: subjectInput.trim(),
      topics: [],
    };
    setSubjects([...subjects, newSub]);
    setSubjectInput("");
    if (!selectedSubjectId) setSelectedSubjectId(newSub.id);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    if (selectedSubjectId === id) setSelectedSubjectId("");
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  const addTopicToSubject = (title: string) => {
    if (!selectedSubjectId) return;
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === selectedSubjectId) {
          const newTopic: Topic = {
            id: Math.random().toString(36).substr(2, 9),
            title: title.trim(),
            isCompleted: false,
          };
          return { ...sub, topics: [...sub.topics, newTopic] };
        }
        return sub;
      })
    );
  };

  const removeTopicFromSubject = (topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === selectedSubjectId) {
          return { ...sub, topics: sub.topics.filter((t) => t.id !== topicId) };
        }
        return sub;
      })
    );
  };

  const handleAISuggest = async () => {
    if (!currentSubject) return;
    setIsGenerating(true);
    const suggested = await suggestTopics(currentSubject.name);
    setIsGenerating(false);

    suggested.forEach((s) => {
      if (
        !currentSubject.topics.some(
          (t) => t.title.toLowerCase() === s.toLowerCase()
        )
      ) {
        addTopicToSubject(s);
      }
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSubjectId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Simple CSV split (assuming one topic per line)
      const rows = text.split(/\r?\n/).filter((row) => row.trim().length > 0);
      rows.forEach((row) => addTopicToSubject(row.trim()));
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0) return;
    console.log("Final Plan:", { subjects });
    navigate("/tasks");
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white mb-4 transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="text-sm font-bold">Back to Assignments</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            Academic Planner
          </h1>
          <p className="text-[#94a3b8] mt-2 font-medium">
            Build your subjects and import your syllabuses.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Side: Subject Creation & Core Config */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-dark border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col gap-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  school
                </span>
                Subject Builder
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#64748b] uppercase tracking-widest">
                  New Subject Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Biology 101"
                    className="flex-1 bg-background-dark border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600 text-sm"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSubject())
                    }
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    className="px-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Subject List */}
              <div className="flex flex-col gap-2 min-h-[100px] border-t border-slate-800 pt-4">
                <label className="text-xs font-black text-[#64748b] uppercase tracking-widest">
                  Added Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjects.length === 0 ? (
                    <p className="text-xs text-slate-600 italic">
                      No subjects added yet...
                    </p>
                  ) : (
                    subjects.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubjectId(sub.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          selectedSubjectId === sub.id
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <span className="text-xs font-bold">{sub.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSubject(sub.id);
                          }}
                          className="hover:text-red-300"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            close
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={subjects.length === 0}
              className="w-full bg-primary hover:bg-indigo-600 disabled:opacity-30 disabled:grayscale text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <span className="material-symbols-outlined">save</span>
              Confirm Semester Plan
            </button>
          </div>

          {/* Right Side: Topics Breakdown */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-dark border border-white/5 p-6 md:p-8 rounded-2xl shadow-xl min-h-[500px] flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">
                      article
                    </span>
                    Syllabus Breakdown
                  </h3>
                  <p className="text-sm text-[#94a3b8]">
                    Select a subject to manage its curriculum.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAISuggest}
                    disabled={isGenerating || !selectedSubjectId}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      auto_awesome
                    </span>
                    {isGenerating ? "Analyzing..." : "AI Syllabus"}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!selectedSubjectId}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700 disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      upload_file
                    </span>
                    Import CSV
                  </button>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleCSVUpload}
                  />
                </div>
              </div>

              {/* Subject Selector & Context Area */}
              <div className="mb-6 p-4 bg-background-dark/50 border border-slate-800 rounded-2xl">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-[#5a6b85] uppercase tracking-widest">
                    Active Curriculum Context
                  </label>
                  <Ariakit.MenuProvider>
                    <Ariakit.MenuButton className="button w-full !bg-transparent !border-none !p-0 !text-lg !font-bold">
                      {activeSubjectName}
                      <Ariakit.MenuButtonArrow />
                    </Ariakit.MenuButton>
                    <Ariakit.Menu gutter={8} className="menu" portal>
                      <Ariakit.MenuItem className="menu-item" disabled>
                        Choose a subject from your list...
                      </Ariakit.MenuItem>
                      {subjects.map((s) => (
                        <Ariakit.MenuItem
                          key={s.id}
                          className="menu-item"
                          onClick={() => setSelectedSubjectId(s.id)}
                        >
                          {s.name}
                        </Ariakit.MenuItem>
                      ))}
                    </Ariakit.Menu>
                  </Ariakit.MenuProvider>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                {!selectedSubjectId ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 select-none">
                    <span className="material-symbols-outlined text-7xl mb-4">
                      school
                    </span>
                    <p className="text-sm font-black uppercase tracking-widest">
                      Select a Subject to start
                    </p>
                    <p className="text-xs mt-1">
                      Add subjects on the left to populate this view
                    </p>
                  </div>
                ) : currentSubject?.topics.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 select-none">
                    <span className="material-symbols-outlined text-6xl mb-4">
                      csv
                    </span>
                    <p className="text-sm font-black uppercase tracking-widest">
                      No Curriculum Found
                    </p>
                    <p className="text-xs mt-1">
                      Use AI Suggestion or Upload a CSV Syllabus
                    </p>
                  </div>
                ) : (
                  currentSubject?.topics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className="group flex items-center justify-between p-4 bg-background-dark/50 border border-slate-800 rounded-xl hover:border-primary/50 transition-all animate-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <span className="size-8 flex items-center justify-center rounded-lg bg-slate-800 text-[11px] font-black text-slate-500">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-white font-bold block">
                            {topic.title}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-black">
                            Sub-task for {currentSubject.name}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTopicFromSubject(topic.id)}
                        className="opacity-0 group-hover:opacity-100 size-9 flex items-center justify-center rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTask;

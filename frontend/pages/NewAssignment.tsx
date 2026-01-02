import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assignmentAPI } from "../services/api";

interface Subtopic {
  name: string;
  isCompleted?: boolean;
}

interface Chapter {
  name: string;
  section: string;
  subtopics: Subtopic[];
}

interface SubjectData {
  subjectName: string;
  chapters: Chapter[];
}

interface SubjectInput {
  id: string;
  name: string;
  file: File | null;
  status: "idle" | "parsing" | "success" | "error";
  parsedData: Chapter[];
  errorMessage?: string;
}

const NewAssignment: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      file: null,
      status: "idle",
      parsedData: [],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const addSubjectRow = () => {
    setSubjects([
      ...subjects,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        file: null,
        status: "idle",
        parsedData: [],
      },
    ]);
  };

  const removeSubjectRow = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const handleNameChange = (id: string, name: string) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const parseCSV = (csvText: string): Chapter[] => {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length < 2) return [];

    const chaptersMap: { [key: string]: Chapter } = {};

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length < 3) continue;

      const [chapterName, section, subtopicContent, completedContent] = parts;
      const key = `${chapterName}-${section}`;

      if (!chaptersMap[key]) {
        chaptersMap[key] = {
          name: chapterName,
          section: section,
          subtopics: [],
        };
      }

      const subtopicNames = subtopicContent
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      const completedStatuses = completedContent
        ? completedContent.split(";").map((s) => s.trim().toLowerCase())
        : [];

      subtopicNames.forEach((name, index) => {
        const subtopic: Subtopic = { name };
        const status =
          completedStatuses[index] !== undefined
            ? completedStatuses[index]
            : completedStatuses.length === 1
            ? completedStatuses[0]
            : null;

        if (status) {
          if (status === "true" || status === "1" || status === "completed") {
            subtopic.isCompleted = true;
          } else if (
            status === "false" ||
            status === "0" ||
            status === "pending"
          ) {
            subtopic.isCompleted = false;
          }
        }
        chaptersMap[key].subtopics.push(subtopic);
      });
    }

    return Object.values(chaptersMap);
  };

  const handleFileChange = async (id: string, file: File | null) => {
    if (!file) {
      setSubjects(
        subjects.map((s) =>
          s.id === id ? { ...s, file: null, status: "idle", parsedData: [] } : s
        )
      );
      return;
    }

    try {
      const text = await file.text();
      const chapters = parseCSV(text);

      setSubjects(
        subjects.map((s) =>
          s.id === id
            ? {
                ...s,
                file,
                status: chapters.length > 0 ? "success" : "error",
                parsedData: chapters,
                errorMessage:
                  chapters.length > 0 ? "" : "No valid data found in CSV.",
              }
            : s
        )
      );
    } catch (err) {
      setSubjects(
        subjects.map((s) =>
          s.id === id
            ? { ...s, status: "error", errorMessage: "Failed to read file." }
            : s
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    const readyToSubmit = subjects.filter(
      (s) => s.name && s.file && s.status === "success"
    );
    if (readyToSubmit.length === 0) {
      setGlobalError("Please provide valid subject names and CSV files.");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalSubjects = readyToSubmit.map((s) => ({
        subjectName: s.name,
        chapters: s.parsedData,
      }));

      const payload = { subjects: finalSubjects };

      // Log the exact payload structure
      console.log("📤 Sending Assignment Payload:");
      console.log(JSON.stringify(payload, null, 2));

      await assignmentAPI.createAssignment(payload);
      navigate("/dashboard");
    } catch (err: any) {
      setGlobalError(
        err.response?.data?.message ||
          "Server error. Check your backend connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-14 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-center gap-4">
              <span className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/20 text-indigo-400">
                <span className="material-symbols-outlined text-4xl">
                  publish
                </span>
              </span>
              Bulk Import
            </h1>
            <p className="text-lg text-[#94a3b8] font-medium max-w-2xl">
              Upload your syllabus CSVs to instantly generate tracked
              assignments.
              <span className="text-indigo-400 font-bold ml-1">
                Use semicolons (;) for multiple subtopics.
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {globalError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 font-bold shadow-[0_0_30px_rgba(244,63,94,0.1)]">
              <span className="material-symbols-outlined">error</span>
              {globalError}
            </div>
          )}

          <div className="space-y-6">
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className="group relative bg-surface-dark border border-white/5 rounded-3xl p-8 shadow-xl transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-backwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeSubjectRow(subject.id)}
                    className="size-8 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-xs font-black text-[#5a6b85] uppercase tracking-widest pl-1">
                      Subject Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) =>
                          handleNameChange(subject.id, e.target.value)
                        }
                        placeholder="e.g. Advanced Algorithms"
                        className="w-full pl-5 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 focus:bg-background-dark"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-2">
                    <label className="text-xs font-black text-[#5a6b85] uppercase tracking-widest pl-1">
                      CSV Syllabus File
                    </label>
                    <div className="relative group/file">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) =>
                          handleFileChange(
                            subject.id,
                            e.target.files?.[0] || null
                          )
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className={`w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between transition-all group-hover/file:bg-white/10 ${
                          subject.file
                            ? "border-indigo-500/50 bg-indigo-500/5"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span
                            className={`material-symbols-outlined ${
                              subject.file
                                ? "text-indigo-400"
                                : "text-slate-500"
                            }`}
                          >
                            {subject.file ? "description" : "upload_file"}
                          </span>
                          <span
                            className={`text-sm font-bold truncate ${
                              subject.file ? "text-white" : "text-slate-500"
                            }`}
                          >
                            {subject.file
                              ? subject.file.name
                              : "Click to upload CSV..."}
                          </span>
                        </div>
                        {subject.file && (
                          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase rounded-lg">
                            Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {(subject.status === "success" || subject.errorMessage) && (
                  <div className="mt-4 pl-1">
                    {subject.status === "success" && (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide animate-in slide-in-from-left-2 fade-in">
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                        Successfully parsed {subject.parsedData.length} chapters
                      </div>
                    )}
                    {subject.errorMessage && (
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wide animate-in slide-in-from-left-2 fade-in">
                        <span className="material-symbols-outlined text-[16px]">
                          warning
                        </span>
                        {subject.errorMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={addSubjectRow}
              className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 font-bold hover:bg-white/10 hover:text-white transition-all w-full md:w-auto justify-center"
            >
              <span className="size-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
              </span>
              Add Another Subject
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                  <span className="text-lg">Generate Assignments</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAssignment;

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

  const handleFileChange = (id: string, file: File | null) => {
    setSubjects(
      subjects.map((s) =>
        s.id === id ? { ...s, file, status: "idle", errorMessage: "" } : s
      )
    );
  };

  const parseCSV = (csvText: string): Chapter[] => {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length < 2) return []; // Header only or empty

    // Assume header: Chapter,Section,Subtopic,Completed
    const chaptersMap: { [key: string]: Chapter } = {};

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      // Simple CSV split (not handling commas inside quotes for simplicity,
      // but can be improved if needed)
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length < 3) continue;

      const [chapterName, section, subtopicName, completedStr] = parts;
      const key = `${chapterName}-${section}`;

      if (!chaptersMap[key]) {
        chaptersMap[key] = {
          name: chapterName,
          section: section,
          subtopics: [],
        };
      }

      const subtopic: Subtopic = { name: subtopicName };
      if (completedStr) {
        const isComp =
          completedStr.toLowerCase() === "true" || completedStr === "1";
        subtopic.isCompleted = isComp;
      }

      chaptersMap[key].subtopics.push(subtopic);
    }

    return Object.values(chaptersMap);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    // Validation
    const invalid = subjects.find((s) => !s.name || !s.file);
    if (invalid) {
      setGlobalError(
        "Please provide both subject name and CSV file for all entries."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const finalSubjects: SubjectData[] = [];

      for (const subject of subjects) {
        if (!subject.file) continue;

        const fileText = await subject.file.text();
        const chapters = parseCSV(fileText);

        finalSubjects.push({
          subjectName: subject.name,
          chapters: chapters,
        });
      }

      const payload = { subjects: finalSubjects };
      console.log("Final Payload:", payload);

      await assignmentAPI.createAssignment(payload);

      // Navigate to dashboard or tasks on success
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Submission error:", err);
      setGlobalError(
        err.response?.data?.message ||
          "Failed to create assignment. Please check your data."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            add_task
          </span>
          New Assignment
        </h1>
        <p className="text-[#92a9c9] mt-2">
          Upload CSV files to import subjects, chapters, and topics in bulk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {globalError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <span className="material-symbols-outlined">error</span>
            <p className="text-sm font-medium">{globalError}</p>
          </div>
        )}

        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div
              key={subject.id}
              className="group bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-all hover:bg-surface-dark/60 hover:border-primary/20"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Subject Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#92a9c9] uppercase tracking-wider">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) =>
                        handleNameChange(subject.id, e.target.value)
                      }
                      placeholder="e.g. DSA, DBMS..."
                      className="w-full px-4 py-3 bg-background-dark/50 border border-border-dark rounded-xl text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>

                  {/* CSV Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#92a9c9] uppercase tracking-wider">
                      CSV File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) =>
                          handleFileChange(
                            subject.id,
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id={`file-${subject.id}`}
                      />
                      <label
                        htmlFor={`file-${subject.id}`}
                        className="flex items-center gap-3 w-full px-4 py-3 bg-background-dark/50 border border-dashed border-border-dark rounded-xl text-[#92a9c9] cursor-pointer hover:border-primary/50 hover:text-white transition-all overflow-hidden"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          upload_file
                        </span>
                        <span className="truncate text-sm">
                          {subject.file
                            ? subject.file.name
                            : "Choose CSV file..."}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeSubjectRow(subject.id)}
                  disabled={subjects.length === 1}
                  className="mt-6 md:mt-8 p-2 rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all disabled:opacity-0"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={addSubjectRow}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Add Another Subject
          </button>

          <div className="flex-grow"></div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-primary hover:bg-primary-dark rounded-xl text-white font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Save All Subjects</span>
                <span className="material-symbols-outlined">done_all</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* CSV Template Guide */}
      <div className="mt-12 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
        <h3 className="text-indigo-300 font-bold flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined">info</span>
          CSV Format Guide
        </h3>
        <p className="text-sm text-[#92a9c9] mb-4">
          Your CSV should follow this exact column order (with a header row):
        </p>
        <div className="bg-background-dark/80 p-4 rounded-xl font-mono text-xs text-indigo-200 overflow-x-auto">
          Chapter, Section, Subtopic, Completed
          <br />
          Chapter 1: Intro, 1.1, Variables, true
          <br />
          Chapter 1: Intro, 1.1, Functions, false
          <br />
          Chapter 2: Objects, 2.1, Constructors, <br />
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;

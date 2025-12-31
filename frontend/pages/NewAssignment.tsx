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
    <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">
            publish
          </span>
          Bulk Import Assignment
        </h1>
        <p className="text-[#92a9c9] mt-2">
          Map your CSV syllabus to the tracker (use ; for multiple subtopics).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {globalError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-bold">
            {globalError}
          </div>
        )}

        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div
              key={subject.id}
              className="bg-surface-dark border border-white/5 rounded-2xl p-6 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) => handleNameChange(subject.id, e.target.value)}
                  placeholder="Subject Name (e.g. DSA)"
                  className="w-full px-4 py-3 bg-background-dark border border-white/5 rounded-xl text-white outline-none"
                />
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    handleFileChange(subject.id, e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-3 bg-background-dark border border-white/5 rounded-xl text-white outline-none cursor-pointer"
                />
              </div>
              {subject.status === "success" && (
                <p className="text-xs text-green-400 mt-2 font-bold">
                  Successfully parsed {subject.parsedData.length} chapters.
                </p>
              )}
              {subject.errorMessage && (
                <p className="text-xs text-rose-400 mt-2 font-bold">
                  {subject.errorMessage}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={addSubjectRow}
            className="text-primary font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span> Subject
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary rounded-xl text-white font-black hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Generate Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAssignment;

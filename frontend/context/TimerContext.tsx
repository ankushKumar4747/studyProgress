import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { subjectsAPI } from "../services/api";

interface TimerContextType {
  activeSubject: any | null;
  setActiveSubject: (subject: any | null) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (isRunning: boolean) => void;
  timerSeconds: number;
  setTimerSeconds: (seconds: number) => void; // Exposed for reset
  isSessionFinished: boolean;
  setIsSessionFinished: (isFinished: boolean) => void;
  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
  handleStopSession: () => Promise<void>;
  formatTime: (totalSeconds: number) => string;
  selectedSubtopics: string[];
  setSelectedSubtopics: (subtopics: string[]) => void;
  toggleSubtopic: (subtopicName: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeSubject, _setActiveSubject] = useState<any | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const setActiveSubject = (subject: any | null) => {
    if (
      isTimerRunning &&
      activeSubject &&
      subject &&
      activeSubject.id !== subject.id
    ) {
      alert(
        "⚠️ Active Session in Progress\n\nPlease stop the current timer for '" +
          activeSubject.name +
          "' before starting a new subject."
      );
      return;
    }
    _setActiveSubject(subject);
  };

  // Store timer seconds for each subject by ID
  const [subjectTimers, setSubjectTimers] = useState<{ [id: string]: number }>(
    {}
  );

  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);

  // Helper to set timer for active subject
  const setTimerSeconds = (seconds: number) => {
    if (activeSubject?.id) {
      setSubjectTimers((prev) => ({
        ...prev,
        [activeSubject.id]: seconds,
      }));
    }
  };

  // Helper to get current timer seconds safely
  const timerSeconds = activeSubject?.id
    ? subjectTimers[activeSubject.id] || 0
    : 0;

  // Timer Interval
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && activeSubject?.id) {
      interval = window.setInterval(() => {
        setSubjectTimers((prev) => ({
          ...prev,
          [activeSubject.id]: (prev[activeSubject.id] || 0) + 1,
        }));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeSubject]);

  const handleStopSession = async () => {
    setIsTimerRunning(false);
    setIsSessionFinished(true);
    // Note: Study time is now saved when user clicks "Save Progress & Close"
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleSubtopic = (subtopicName: string) => {
    setSelectedSubtopics((prev) =>
      prev.includes(subtopicName)
        ? prev.filter((s) => s !== subtopicName)
        : [...prev, subtopicName]
    );
  };

  return (
    <TimerContext.Provider
      value={{
        activeSubject,
        setActiveSubject,
        isTimerRunning,
        setIsTimerRunning,
        timerSeconds,
        setTimerSeconds,
        isSessionFinished,
        setIsSessionFinished,
        isMinimized,
        setIsMinimized,
        handleStopSession,
        formatTime,
        selectedSubtopics,
        setSelectedSubtopics,
        toggleSubtopic,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};


export enum TaskStatus {
  TODO = 'Not Started',
  IN_PROGRESS = 'Studying',
  DONE = 'Submitted',
  REVIEW = 'Reviewing'
}

export enum TaskPriority {
  HIGH = 'Critical',
  MEDIUM = 'Upcoming',
  LOW = 'Backlog'
}

export interface Topic {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  name: string;
  category: string; // Subject: CS101, MATH202, etc.
  status: TaskStatus;
  priority: TaskPriority;
  loggedTime: number; // Study hours spent
  estimatedTime: number; // Estimated hours needed
  dueDate: string;
  description: string;
  topics?: Topic[];
}

export interface TimeLog {
  id: string;
  date: string;
  description: string;
  project: string; // Subject Name
  startTime: string;
  endTime: string;
  duration: string;
  isRunning?: boolean;
}

export type ViewType = 'dashboard' | 'tasks' | 'timeLogs' | 'analytics' | 'settings' | 'newTask';

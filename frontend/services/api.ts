import axiosInstance from "../utils/axios";

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/loginUser", {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await axiosInstance.put("/user/profile", data);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAllTasks: async () => {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: any) => {
    const response = await axiosInstance.post("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: any) => {
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Completed Topics API
export const completedAPI = {
  getAllCompleted: async () => {
    const response = await axiosInstance.get("/completed");
    return response.data;
  },

  getCompletedByDate: async (date: string) => {
    const response = await axiosInstance.get(`/completed/date/${date}`);
    return response.data;
  },

  getCompletedBySubject: async (subject: string) => {
    const response = await axiosInstance.get(`/completed/subject/${subject}`);
    return response.data;
  },

  markTopicComplete: async (topicData: any) => {
    const response = await axiosInstance.post("/completed", topicData);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getStudyStats: async () => {
    const response = await axiosInstance.get("/analytics/stats");
    return response.data;
  },

  getStudyHoursByDate: async (startDate: string, endDate: string) => {
    const response = await axiosInstance.get("/analytics/hours", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getSubjectBreakdown: async () => {
    const response = await axiosInstance.get("/analytics/subjects");
    return response.data;
  },
};

// Time Logs API
export const timeLogsAPI = {
  getAllTimeLogs: async () => {
    const response = await axiosInstance.get("/time-logs");
    return response.data;
  },

  createTimeLog: async (logData: any) => {
    const response = await axiosInstance.post("/time-logs", logData);
    return response.data;
  },

  updateTimeLog: async (id: string, logData: any) => {
    const response = await axiosInstance.put(`/time-logs/${id}`, logData);
    return response.data;
  },

  deleteTimeLog: async (id: string) => {
    const response = await axiosInstance.delete(`/time-logs/${id}`);
    return response.data;
  },
};

// Assignment API
export const assignmentAPI = {
  createAssignment: async (data: any) => {
    const response = await axiosInstance.post(
      "/assignment/createAssignment",
      data
    );
    return response.data;
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  tasks: tasksAPI,
  completed: completedAPI,
  analytics: analyticsAPI,
  timeLogs: timeLogsAPI,
  assignment: assignmentAPI,
};

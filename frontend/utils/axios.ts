import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:4000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Add authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging (remove in production)
    console.log("📤 Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response for debugging (remove in production)
    console.log("📥 Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error("🔒 Unauthorized - Redirecting to login");
          localStorage.removeItem("token");
          window.location.href = "/#/login";
          break;

        case 403:
          // Forbidden
          console.error("🚫 Forbidden - Access denied");
          break;

        case 404:
          // Not found
          console.error("🔍 Not Found - Resource does not exist");
          break;

        case 500:
          // Server error
          console.error("💥 Server Error - Please try again later");
          break;

        default:
          console.error(`❌ Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("📡 Network Error - No response from server");
    } else {
      // Something else happened
      console.error("⚠️ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

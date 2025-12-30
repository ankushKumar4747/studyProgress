import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      // Handle error
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-[32px]">
                  school
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  StudySync
                </h1>
                <p className="text-[#92a9c9] text-sm font-medium">
                  Your Academic Success Partner
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                <span className="material-symbols-outlined text-indigo-400 text-[24px]">
                  auto_awesome
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  Smart Progress Tracking
                </h3>
                <p className="text-[#92a9c9] text-sm">
                  Monitor your study hours, completed topics, and academic
                  progress in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="size-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/20 transition-colors">
                <span className="material-symbols-outlined text-rose-400 text-[24px]">
                  insights
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  Detailed Analytics
                </h3>
                <p className="text-[#92a9c9] text-sm">
                  Get insights into your study patterns and optimize your
                  learning strategy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <span className="material-symbols-outlined text-amber-400 text-[24px]">
                  check_circle
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  Achievement System
                </h3>
                <p className="text-[#92a9c9] text-sm">
                  Track completed topics by subject and celebrate your academic
                  milestones.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-[#92a9c9] text-sm italic">
              "The beautiful thing about learning is that no one can take it
              away from you."
            </p>
            <p className="text-white font-bold text-sm mt-2">— B.B. King</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-surface-dark/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2">
                Welcome Back!
              </h2>
              <p className="text-[#92a9c9]">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-400 text-[20px]">
                  error
                </span>
                <p className="text-rose-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#92a9c9] text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jamie@college.edu"
                    className="w-full pl-12 pr-4 py-4 bg-background-dark border border-border-dark rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#92a9c9] text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-background-dark border border-border-dark rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92a9c9] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border-dark bg-background-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-[#92a9c9] group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-indigo-400 font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mobile Branding */}
          <div className="md:hidden mt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">
                  school
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">StudySync</h1>
            </div>
            <p className="text-[#92a9c9] text-sm">
              Your Academic Success Partner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

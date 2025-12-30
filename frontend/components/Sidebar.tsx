import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navItems = [
    { name: "Home", path: "/dashboard", icon: "home" },
    { name: "Syllabus Tracker", path: "/tasks", icon: "history_edu" },
    { name: "New Assignment", path: "/new-assignment", icon: "add_circle" },
    { name: "Grades & Stats", path: "/analytics", icon: "insights" },
  ];

  const campusItems = [
    { name: "Completed", path: "/schedule", icon: "check_circle" },
  ];

  return (
    <aside className="w-64 bg-surface-darker border-r border-border-dark hidden md:flex flex-col flex-shrink-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="material-symbols-outlined text-white text-[20px]">
            school
          </span>
        </div>
        <div>
          <h1 className="text-white text-base font-bold leading-none">
            StudySync
          </h1>
          <p className="text-[#92a9c9] text-xs font-normal mt-1">
            Undergrad Plan
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-[#92a9c9] hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-border-dark">
          <p className="px-3 text-xs font-semibold text-[#5a6b85] uppercase tracking-wider mb-2">
            Campus
          </p>
          {campusItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-[#92a9c9] hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border-dark">
        <div className="flex items-center gap-3">
          <div
            className="size-9 rounded-full bg-cover bg-center bg-[#233348]"
            style={{
              backgroundImage: `url('https://picsum.photos/seed/student123/100/100')`,
            }}
          ></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Jamie Student
            </p>
            <p className="text-xs text-[#92a9c9] truncate">jamie@college.edu</p>
          </div>
          <button className="text-[#92a9c9] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

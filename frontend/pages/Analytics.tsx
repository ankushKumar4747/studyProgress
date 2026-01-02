import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const activityData = [
  { name: "Mon", hours: 4.0 },
  { name: "Tue", hours: 6.2 },
  { name: "Wed", hours: 4.8 },
  { name: "Thu", hours: 7.5 },
  { name: "Fri", hours: 5.0 },
  { name: "Sat", hours: 2.5 },
  { name: "Sun", hours: 1.0 },
];

const categoryData = [
  { name: "Development", value: 45, color: "#136dec" },
  { name: "Design", value: 25, color: "#ec4899" },
  { name: "Meetings", value: 20, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#2a3b55" },
];

const Analytics: React.FC = () => {
  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Analytics and Reports
            </h1>
            <p className="text-[#92a9c9] text-base">
              Track your productivity trends and task completion rates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface-dark p-1 rounded-xl border border-border-dark">
            <div className="flex bg-[#101822]/50 rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-[#92a9c9]">
                Daily
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-white shadow-sm">
                Weekly
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-[#92a9c9]">
                Monthly
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-[#92a9c9]">
                Yearly
              </button>
            </div>
            <div className="flex items-center border-l border-border-dark pl-3 gap-2">
              <button className="p-2 text-[#92a9c9] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_today
                </span>
              </button>
              <button className="p-2 text-[#92a9c9] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  download
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KPICard
            label="Total Focus Time"
            value="34h 20m"
            icon="timer"
            iconColor="text-blue-500"
            trend="+12%"
            trendUp={true}
          />
          <KPICard
            label="Tasks Completed"
            value="45"
            total="50"
            icon="check_circle"
            iconColor="text-purple-500"
            trend="+5%"
            trendUp={true}
          />
        </div>

        <div className="w-full rounded-xl border border-border-dark bg-surface-dark/30 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Activity Trends</h3>
              <p className="text-[#92a9c9] text-sm">
                Focus hours distribution over the current period
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-bold text-white">34.5 hrs</p>
              <p className="text-emerald-500 text-sm font-medium">
                +2.4 hrs vs last week
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#136dec" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#136dec" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#2a3b55"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#92a9c9", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161f2c",
                    border: "1px solid #2a3b55",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#136dec"
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border-dark bg-surface-dark/30 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">
              Time by Category
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-8 h-full">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="block text-2xl font-bold text-white">
                    45h
                  </span>
                  <span className="text-xs text-[#92a9c9]">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 flex-1 w-full sm:w-auto">
                {categoryData.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      <span className="text-sm text-white">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[#92a9c9]">
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-dark bg-surface-dark/30 p-6 flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-bold text-white">Task Completion</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#92a9c9]">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>{" "}
                  Completed
                </div>
                <div className="flex items-center gap-1.5 text-[#92a9c9]">
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>{" "}
                  Planned
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-around h-full gap-5">
              <CompletionBar label="High Priority" current={12} total={15} />
              <CompletionBar label="Medium Priority" current={24} total={25} />
              <CompletionBar label="Low Priority" current={9} total={10} />
              <CompletionBar label="Backlog" current={5} total={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{
  label: string;
  value: string;
  total?: string;
  icon: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}> = ({ label, value, total, icon, iconColor, trend, trendUp }) => (
  <div className="flex flex-col p-6 rounded-xl border border-border-dark bg-surface-dark/50 hover:bg-surface-dark transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-white/5 ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {trend && (
        <span
          className={`flex items-center text-sm font-medium bg-white/5 px-2 py-0.5 rounded ${
            trendUp ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] mr-1">
            {trendUp ? "trending_up" : "trending_down"}
          </span>{" "}
          {trend}
        </span>
      )}
    </div>
    <p className="text-[#92a9c9] text-sm font-medium mb-1">{label}</p>
    <p className="text-white text-3xl font-bold tracking-tight">
      {value}
      {total && (
        <span className="text-[#92a9c9] text-xl font-normal">/{total}</span>
      )}
    </p>
  </div>
);

const CompletionBar: React.FC<{
  label: string;
  current: number;
  total: number;
}> = ({ label, current, total }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-white">{label}</span>
      <span className="text-[#92a9c9]">
        {current}/{total}
      </span>
    </div>
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full"
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default Analytics;

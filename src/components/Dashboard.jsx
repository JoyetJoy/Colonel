import {
  Users,
  Building2,
  DollarSign,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  UserPlus,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  {
    label: "Total Employees",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Active Customers",
    value: "89",
    change: "+5%",
    trend: "up",
    icon: Building2,
  },
  {
    label: "Monthly Payroll",
    value: "\u20B928.5L",
    change: "-2%",
    trend: "down",
    icon: DollarSign,
  },
  {
    label: "Attendance Rate",
    value: "94.2%",
    change: "+1.8%",
    trend: "up",
    icon: ClipboardCheck,
  },
];

const attendanceData = [
  { month: "Oct", present: 1180, absent: 67 },
  { month: "Nov", present: 1195, absent: 52 },
  { month: "Dec", present: 1150, absent: 97 },
  { month: "Jan", present: 1210, absent: 37 },
  { month: "Feb", present: 1230, absent: 17 },
  { month: "Mar", present: 1175, absent: 72 },
];

const revenueData = [
  { month: "Oct", revenue: 24 },
  { month: "Nov", revenue: 26 },
  { month: "Dec", revenue: 25 },
  { month: "Jan", revenue: 28 },
  { month: "Feb", revenue: 30 },
  { month: "Mar", revenue: 28.5 },
];

const allocationData = [
  { name: "Industrial", value: 420 },
  { name: "Commercial", value: 350 },
  { name: "Residential", value: 280 },
  { name: "Event", value: 120 },
  { name: "Unallocated", value: 77 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const recentActivities = [
  {
    icon: UserPlus,
    text: "New employee Rajesh Kumar registered",
    time: "10 min ago",
  },
  {
    icon: FileText,
    text: "Pay slips generated for February 2026",
    time: "1 hour ago",
  },
  {
    icon: Building2,
    text: "New customer TechGuard Industries added",
    time: "2 hours ago",
  },
  {
    icon: AlertTriangle,
    text: "3 employees marked absent at Phoenix Mall",
    time: "3 hours ago",
  },
  {
    icon: Clock,
    text: "Payroll processing completed for Zone B",
    time: "5 hours ago",
  },
];

const pendingTasks = [
  { task: "Process pending salary for 23 employees", priority: "high" },
  { task: "Review 8 interview candidates", priority: "medium" },
  { task: "Generate GST billing for Q4", priority: "high" },
  { task: "Approve 12 leave requests", priority: "medium" },
  { task: "Update uniform inventory", priority: "low" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here's your security operations overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-500"}`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground text-sm">Employee Attendance</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#111" }}
                itemStyle={{ color: "#444" }}
              />

              <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Pie */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-foreground text-sm mb-4">Employee Allocation</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                stroke="none"
              >
                {allocationData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
                itemStyle={{ color: "#444" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {allocationData.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue + Activities + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground text-sm">Revenue Trend</h3>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +8.2%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#111" }}
                itemStyle={{ color: "#444" }}
                formatter={(value) => [`\u20B9${value}L`, "Revenue"]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-foreground text-sm mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <activity.icon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-foreground">{activity.text}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-foreground text-sm mb-4">Pending Tasks</h3>
          <div className="space-y-2.5">
            {pendingTasks.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.priority === "high"
                      ? "bg-red-500"
                      : item.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                  }`}
                />
                <div>
                  <p className="text-xs text-foreground">{item.task}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {item.priority} priority
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Download,
  FileText,
  Users,
  Building2,
  DollarSign,
  Calendar,
  ClipboardList,
  AlertTriangle,
  Printer,
  Filter,
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
} from "recharts";

const reportCategories = [
  { id: "attendance", label: "Attendance Reports", icon: Calendar, count: 5 },
  { id: "payroll", label: "Payroll Reports", icon: DollarSign, count: 4 },
  { id: "employee", label: "Employee Reports", icon: Users, count: 6 },
  { id: "billing", label: "Billing Reports", icon: Building2, count: 3 },
  { id: "duty", label: "Duty Loss Reports", icon: AlertTriangle, count: 2 },
  {
    id: "allocation",
    label: "Allocation Reports",
    icon: ClipboardList,
    count: 3,
  },
];

const reportList = {
  attendance: [
    {
      name: "Daily Attendance Summary",
      description: "Consolidated daily attendance across all sites",
      lastGenerated: "2026-03-15",
    },
    {
      name: "Monthly Attendance Report",
      description: "Month-wise attendance with present/absent/leave counts",
      lastGenerated: "2026-03-01",
    },
    {
      name: "Absentee Report",
      description: "List of employees absent without prior notice",
      lastGenerated: "2026-03-14",
    },
    {
      name: "Late Arrival Report",
      description: "Employees who arrived late at duty stations",
      lastGenerated: "2026-03-13",
    },
    {
      name: "Unit-Wise Attendance",
      description: "Attendance breakdown by customer unit/location",
      lastGenerated: "2026-03-10",
    },
  ],
  payroll: [
    {
      name: "Salary Statement",
      description: "Complete salary breakdown for all employees",
      lastGenerated: "2026-02-28",
    },
    {
      name: "Bank Transfer Report",
      description: "Salary details formatted for bank submission",
      lastGenerated: "2026-02-28",
    },
    {
      name: "PF/ESI Report",
      description: "Provident Fund and ESI contribution details",
      lastGenerated: "2026-02-28",
    },
    {
      name: "Professional Tax Report",
      description: "State-wise professional tax deductions",
      lastGenerated: "2026-02-28",
    },
  ],
  employee: [
    {
      name: "Employee Master List",
      description: "All registered employees with details",
      lastGenerated: "2026-03-15",
    },
    {
      name: "Employee Joining Report",
      description: "New employees joined in selected period",
      lastGenerated: "2026-03-01",
    },
    {
      name: "Employee Attrition Report",
      description: "Employees who left or absconded",
      lastGenerated: "2026-03-10",
    },
    {
      name: "Unit-Wise Salary Report",
      description:
        "Salary details for employees working across multiple companies",
      lastGenerated: "2026-02-28",
    },
    {
      name: "Absconding Report",
      description: "Security staff who left without notice",
      lastGenerated: "2026-03-12",
    },
    {
      name: "Document Expiry Report",
      description: "Employees with expiring documents/licenses",
      lastGenerated: "2026-03-08",
    },
  ],
  billing: [
    {
      name: "Customer Invoice Report",
      description: "GST billing report for all active customers",
      lastGenerated: "2026-02-28",
    },
    {
      name: "Outstanding Payment Report",
      description: "Pending payments from customers",
      lastGenerated: "2026-03-14",
    },
    {
      name: "Revenue Summary",
      description: "Monthly and quarterly revenue summaries",
      lastGenerated: "2026-03-01",
    },
  ],
  duty: [
    {
      name: "Duty Loss Report",
      description: "Contracted vs billed duties comparison for customers",
      lastGenerated: "2026-03-10",
    },
    {
      name: "Duty Variance Report",
      description: "Variance analysis between expected and actual hours",
      lastGenerated: "2026-03-05",
    },
  ],
  allocation: [
    {
      name: "Allocation Summary",
      description: "Current allocation of employees across companies",
      lastGenerated: "2026-03-15",
    },
    {
      name: "Area-Wise Deployment",
      description: "Geographic distribution of security personnel",
      lastGenerated: "2026-03-12",
    },
    {
      name: "Field Officer Report",
      description: "Guards assigned to each field officer",
      lastGenerated: "2026-03-10",
    },
  ],
};

const attendanceTrend = [
  { month: "Oct", rate: 92.1 },
  { month: "Nov", rate: 94.5 },
  { month: "Dec", rate: 90.8 },
  { month: "Jan", rate: 95.2 },
  { month: "Feb", rate: 94.8 },
  { month: "Mar", rate: 93.6 },
];

const payrollTrend = [
  { month: "Oct", amount: 24.2 },
  { month: "Nov", amount: 25.8 },
  { month: "Dec", amount: 25.1 },
  { month: "Jan", amount: 27.3 },
  { month: "Feb", amount: 28.5 },
  { month: "Mar", amount: 27.9 },
];

export function ReportsGeneration() {
  const [selectedCategory, setSelectedCategory] = useState("attendance");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate and download reports for attendance, payments, and
            operations
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" /> Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-foreground text-sm mb-4">
            Attendance Rate Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[88, 98]}
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
                formatter={(value) => [`${value}%`, "Rate"]}
              />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-foreground text-sm mb-4">
            Payroll Trend (in Lakhs)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={payrollTrend}>
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
                formatter={(value) => [`₹${value}L`, "Payroll"]}
              />

              <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`p-4 rounded-xl border transition-colors text-left ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-card text-foreground border-border hover:border-gray-300"
            }`}
          >
            <cat.icon
              className={`w-5 h-5 mb-2 ${selectedCategory === cat.id ? "text-white" : "text-muted-foreground"}`}
            />
            <p className="text-xs">{cat.label}</p>
            <p
              className={`text-[11px] mt-0.5 ${selectedCategory === cat.id ? "text-white/60" : "text-muted-foreground"}`}
            >
              {cat.count} reports
            </p>
          </button>
        ))}
      </div>

      {/* Report List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-foreground text-sm capitalize">
            {selectedCategory.replace("-", " ")} Reports
          </h3>
        </div>
        <div className="divide-y divide-border/50">
          {reportList[selectedCategory]?.map((report) => (
            <div
              key={report.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {report.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Last generated: {report.lastGenerated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-12 sm:ml-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground bg-secondary rounded-lg hover:text-foreground transition-colors">
                  <Printer className="w-3 h-3" /> Print
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

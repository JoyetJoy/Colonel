import { useState } from "react";
import { DollarSign, Save } from "lucide-react";

const statusLabels = {
  P: { label: "Present", color: "bg-green-100 text-green-700" },
  A: { label: "Absent", color: "bg-red-100 text-red-600" },
  L: { label: "Leave", color: "bg-yellow-100 text-yellow-700" },
  H: { label: "Holiday", color: "bg-blue-100 text-blue-700" },
  WO: { label: "Week Off", color: "bg-purple-100 text-purple-700" },
  HD: { label: "Half Day", color: "bg-orange-100 text-orange-700" },
};

const daysInMonth = 28; // Feb 2026

const generateDays = () => {
  const days = [];
  for (let i = 0; i < daysInMonth; i++) {
    const rand = Math.random();
    if (rand > 0.92) days.push("A");
    else if (rand > 0.88) days.push("L");
    else if (rand > 0.84) days.push("WO");
    else if (rand > 0.82) days.push("HD");
    else days.push("P");
  }
  return days;
};

const countStatus = (days, s) => days.filter((d) => d === s).length;

const mockAttendance = [
  "Rajesh Kumar",
  "Suresh Patel",
  "Amit Singh",
  "Prakash Yadav",
  "Deepak Sharma",
  "Ravi Teja",
].map((name, i) => {
  const days = generateDays();
  return {
    empId: `COL-00${i + 1}`,
    name,
    company: [
      "TechPark Solutions",
      "Phoenix Mall",
      "Greenfield Apts",
      "Wipro Campus",
      "City Hospital",
      "Infosys SEZ",
    ][i],
    days,
    totalPresent: countStatus(days, "P") + countStatus(days, "HD") * 0.5,
    totalAbsent: countStatus(days, "A"),
    totalLeave: countStatus(days, "L"),
  };
});

export function PayrollManagement() {
  const [mode, setMode] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState("2026-03-15");
  const [month] = useState("February 2026");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Payroll Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mark attendance daily or monthly and process payroll
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-foreground">
            <Save className="w-4 h-4" /> Save Attendance
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            <DollarSign className="w-4 h-4" /> Process Payroll
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setMode("daily")}
            className={`px-3 py-1.5 text-xs rounded-md ${mode === "daily" ? "bg-gray-900 text-white" : "text-muted-foreground"}`}
          >
            Daily Attendance
          </button>
          <button
            onClick={() => setMode("monthly")}
            className={`px-3 py-1.5 text-xs rounded-md ${mode === "monthly" ? "bg-gray-900 text-white" : "text-muted-foreground"}`}
          >
            Monthly View
          </button>
        </div>
        {mode === "daily" && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border outline-none"
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusLabels).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded text-[10px] flex items-center justify-center ${val.color}`}
            >
              {key}
            </span>
            <span className="text-xs text-muted-foreground">{val.label}</span>
          </div>
        ))}
      </div>

      {mode === "daily" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-foreground text-sm">
              Attendance for {selectedDate}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Employee", "Company", "Status", "Mark"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAttendance.map((emp) => (
                  <tr
                    key={emp.empId}
                    className="border-b border-border/50 hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{emp.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {emp.empId}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {emp.company}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full ${statusLabels["P"].color}`}
                      >
                        Present
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {["P", "A", "L", "HD", "WO"].map((s) => (
                          <button
                            key={s}
                            className={`w-7 h-7 rounded text-[10px] flex items-center justify-center ${statusLabels[s].color} hover:opacity-80`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground text-sm">
              Monthly Attendance - {month}
            </h3>
            <span className="text-xs text-muted-foreground">
              {daysInMonth} days
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground px-3 py-2 sticky left-0 bg-white z-10 min-w-[140px]">
                    Employee
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th
                      key={i}
                      className="text-center text-[10px] text-muted-foreground px-0.5 py-2 min-w-[28px]"
                    >
                      {i + 1}
                    </th>
                  ))}
                  <th className="text-center text-xs text-muted-foreground px-2 py-2">
                    P
                  </th>
                  <th className="text-center text-xs text-muted-foreground px-2 py-2">
                    A
                  </th>
                  <th className="text-center text-xs text-muted-foreground px-2 py-2">
                    L
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.map((emp) => (
                  <tr
                    key={emp.empId}
                    className="border-b border-border/50 hover:bg-secondary/30"
                  >
                    <td className="px-3 py-2 sticky left-0 bg-white z-10">
                      <p className="text-xs text-foreground whitespace-nowrap">
                        {emp.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {emp.empId}
                      </p>
                    </td>
                    {emp.days.map((d, i) => (
                      <td key={i} className="text-center px-0.5 py-2">
                        <span
                          className={`inline-flex w-6 h-6 rounded text-[9px] items-center justify-center ${statusLabels[d].color}`}
                        >
                          {d}
                        </span>
                      </td>
                    ))}
                    <td className="text-center text-xs text-green-600 px-2">
                      {emp.totalPresent}
                    </td>
                    <td className="text-center text-xs text-red-500 px-2">
                      {emp.totalAbsent}
                    </td>
                    <td className="text-center text-xs text-yellow-600 px-2">
                      {emp.totalLeave}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

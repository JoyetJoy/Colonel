import { useState } from "react";
import { CalendarDays, Plus, Shirt, DollarSign, Calendar } from "lucide-react";

const mockLeaves = [
  {
    id: "1",
    empId: "COL-001",
    employeeName: "Rajesh Kumar",
    type: "casual",
    from: "2026-03-10",
    to: "2026-03-11",
    days: 2,
    status: "approved",
    reason: "Family function",
  },
  {
    id: "2",
    empId: "COL-002",
    employeeName: "Suresh Patel",
    type: "sick",
    from: "2026-03-12",
    to: "2026-03-14",
    days: 3,
    status: "approved",
    reason: "Fever",
  },
  {
    id: "3",
    empId: "COL-006",
    employeeName: "Prakash Yadav",
    type: "casual",
    from: "2026-03-18",
    to: "2026-03-18",
    days: 1,
    status: "pending",
    reason: "Personal work",
  },
  {
    id: "4",
    empId: "COL-007",
    employeeName: "Deepak Sharma",
    type: "absent",
    from: "2026-03-08",
    to: "2026-03-08",
    days: 1,
    status: "rejected",
    reason: "No prior notice",
  },
  {
    id: "5",
    empId: "COL-008",
    employeeName: "Ravi Teja",
    type: "earned",
    from: "2026-03-20",
    to: "2026-03-25",
    days: 6,
    status: "pending",
    reason: "Annual leave",
  },
];

const mockAdvances = [
  {
    id: "1",
    empId: "COL-002",
    employeeName: "Suresh Patel",
    amount: 2000,
    date: "2026-02-15",
    purpose: "Medical emergency",
    status: "deducted",
  },
  {
    id: "2",
    empId: "COL-006",
    employeeName: "Prakash Yadav",
    amount: 1000,
    date: "2026-03-01",
    purpose: "Personal",
    status: "pending",
  },
  {
    id: "3",
    empId: "COL-001",
    employeeName: "Rajesh Kumar",
    amount: 3000,
    date: "2026-01-20",
    purpose: "Family emergency",
    status: "deducted",
  },
];

const mockUniforms = [
  {
    id: "1",
    empId: "COL-001",
    employeeName: "Rajesh Kumar",
    item: "Shirt (White)",
    quantity: 2,
    dateIssued: "2025-12-01",
    closingStock: 45,
    rentPerMonth: 100,
  },
  {
    id: "2",
    empId: "COL-001",
    employeeName: "Rajesh Kumar",
    item: "Trouser (Black)",
    quantity: 2,
    dateIssued: "2025-12-01",
    closingStock: 38,
    rentPerMonth: 100,
  },
  {
    id: "3",
    empId: "COL-002",
    employeeName: "Suresh Patel",
    item: "Cap",
    quantity: 1,
    dateIssued: "2026-01-15",
    closingStock: 62,
    rentPerMonth: 50,
  },
  {
    id: "4",
    empId: "COL-003",
    employeeName: "Amit Singh",
    item: "Shirt (White)",
    quantity: 2,
    dateIssued: "2025-11-20",
    closingStock: 43,
    rentPerMonth: 100,
  },
  {
    id: "5",
    empId: "COL-006",
    employeeName: "Prakash Yadav",
    item: "Full Set",
    quantity: 1,
    dateIssued: "2026-02-14",
    closingStock: 20,
    rentPerMonth: 200,
  },
];

const leaveStatusColors = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
};

const leaveTypeColors = {
  casual: "bg-blue-100 text-blue-700",
  sick: "bg-orange-100 text-orange-700",
  earned: "bg-purple-100 text-purple-700",
  absent: "bg-red-100 text-red-600",
};

export function LeaveExpenseManagement() {
  const [tab, setTab] = useState("leave");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Leave & Expense Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage leaves, advances, mess fees, and uniform requirements
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 self-start">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 w-fit">
        {[
          { key: "leave", label: "Leaves", icon: Calendar },
          { key: "advance", label: "Advances", icon: DollarSign },
          { key: "uniform", label: "Uniforms", icon: Shirt },
          { key: "mess", label: "Mess Fees", icon: CalendarDays },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
              tab === t.key
                ? "bg-gray-900 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "leave" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Employee",
                    "Type",
                    "From",
                    "To",
                    "Days",
                    "Reason",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockLeaves.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-border/50 hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">
                        {l.employeeName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {l.empId}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${leaveTypeColors[l.type]}`}
                      >
                        {l.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {l.from}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {l.to}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {l.days}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                      {l.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${leaveStatusColors[l.status]}`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "advance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">
                Total Advances Given
              </p>
              <p className="text-2xl text-foreground mt-1">
                {"\u20B9"}
                {mockAdvances
                  .reduce((s, a) => s + a.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">Pending Recovery</p>
              <p className="text-2xl text-yellow-600 mt-1">
                {"\u20B9"}
                {mockAdvances
                  .filter((a) => a.status === "pending")
                  .reduce((s, a) => s + a.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Employee", "Amount", "Date", "Purpose", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs text-muted-foreground px-4 py-3"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mockAdvances.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border/50 hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {a.employeeName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {a.empId}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {"\u20B9"}
                        {a.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {a.date}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {a.purpose}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[11px] px-2 py-1 rounded-full capitalize ${a.status === "deducted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "uniform" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Employee",
                      "Item",
                      "Qty",
                      "Date Issued",
                      "Closing Stock",
                      "Rent/Month",
                    ].map((h) => (
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
                  {mockUniforms.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border/50 hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {u.employeeName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {u.empId}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {u.item}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {u.quantity}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {u.dateIssued}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {u.closingStock}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {"\u20B9"}
                        {u.rentPerMonth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "mess" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">
              Total Mess Fees (Feb 2026)
            </p>
            <p className="text-2xl text-foreground mt-1">{"\u20B9"}3,500</p>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Employee",
                      "Month",
                      "Days",
                      "Rate/Day",
                      "Total",
                      "Status",
                    ].map((h) => (
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
                  {[
                    {
                      name: "Rajesh Kumar",
                      empId: "COL-001",
                      month: "Feb 2026",
                      days: 25,
                      rate: 20,
                      total: 500,
                      status: "deducted",
                    },
                    {
                      name: "Suresh Patel",
                      empId: "COL-002",
                      month: "Feb 2026",
                      days: 25,
                      rate: 20,
                      total: 500,
                      status: "deducted",
                    },
                    {
                      name: "Prakash Yadav",
                      empId: "COL-006",
                      month: "Feb 2026",
                      days: 25,
                      rate: 20,
                      total: 500,
                      status: "deducted",
                    },
                    {
                      name: "Deepak Sharma",
                      empId: "COL-007",
                      month: "Feb 2026",
                      days: 25,
                      rate: 20,
                      total: 500,
                      status: "deducted",
                    },
                    {
                      name: "Ravi Teja",
                      empId: "COL-008",
                      month: "Feb 2026",
                      days: 25,
                      rate: 20,
                      total: 500,
                      status: "deducted",
                    },
                  ].map((m) => (
                    <tr
                      key={m.empId}
                      className="border-b border-border/50 hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {m.empId}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {m.month}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {m.days}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {"\u20B9"}
                        {m.rate}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {"\u20B9"}
                        {m.total}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

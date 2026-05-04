import { useState } from "react";
import { ArrowLeftRight, Search, MapPin, User } from "lucide-react";

const mockAllocations = [
  {
    id: "1",
    employeeName: "Rajesh Kumar",
    empId: "COL-001",
    company: "TechPark Solutions",
    unit: "Gate 1",
    shift: "Day (6AM-6PM)",
    allocatedFrom: "2025-01-15",
    allocatedTo: null,
    area: "Electronic City",
    fieldOfficer: "Suresh Nair",
    status: "active",
  },
  {
    id: "2",
    employeeName: "Suresh Patel",
    empId: "COL-002",
    company: "Phoenix Mall",
    unit: "Main Entrance",
    shift: "Night (6PM-6AM)",
    allocatedFrom: "2025-02-01",
    allocatedTo: null,
    area: "Whitefield",
    fieldOfficer: "Suresh Nair",
    status: "active",
  },
  {
    id: "3",
    employeeName: "Amit Singh",
    empId: "COL-003",
    company: "Greenfield Apts",
    unit: "Block A",
    shift: "Day (6AM-6PM)",
    allocatedFrom: "2024-12-01",
    allocatedTo: null,
    area: "Koramangala",
    fieldOfficer: "Ramesh Gupta",
    status: "active",
  },
  {
    id: "4",
    employeeName: "Prakash Yadav",
    empId: "COL-006",
    company: "Wipro Campus",
    unit: "Building 3",
    shift: "Day (8AM-8PM)",
    allocatedFrom: "2025-03-01",
    allocatedTo: null,
    area: "Sarjapur Road",
    fieldOfficer: "Ramesh Gupta",
    status: "active",
  },
  {
    id: "5",
    employeeName: "Deepak Sharma",
    empId: "COL-007",
    company: "City Hospital",
    unit: "Emergency Wing",
    shift: "Night (8PM-8AM)",
    allocatedFrom: "2025-01-20",
    allocatedTo: null,
    area: "Jayanagar",
    fieldOfficer: "Vijay Kumar",
    status: "active",
  },
  {
    id: "6",
    employeeName: "Ravi Teja",
    empId: "COL-008",
    company: "Infosys SEZ",
    unit: "Parking Lot",
    shift: "Day (6AM-6PM)",
    allocatedFrom: "2024-11-15",
    allocatedTo: null,
    area: "Electronic City",
    fieldOfficer: "Suresh Nair",
    status: "active",
  },
  {
    id: "7",
    employeeName: "Mohan Das",
    empId: "COL-005",
    company: "TechPark Solutions",
    unit: "Reception",
    shift: "Day (9AM-6PM)",
    allocatedFrom: "2024-06-01",
    allocatedTo: "2025-01-30",
    area: "Electronic City",
    fieldOfficer: "Suresh Nair",
    status: "completed",
  },
];

const unallocated = [
  { name: "Vikram Reddy", empId: "COL-004", designation: "Security Guard" },
  { name: "Ganesh Rao", empId: "COL-009", designation: "Guard" },
  { name: "Santosh Pillai", empId: "COL-010", designation: "Security Guard" },
];

export function EmployeeAllocation() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");

  const filtered = mockAllocations.filter(
    (a) =>
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase()),
  );

  const areas = [...new Set(mockAllocations.map((a) => a.area))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Employee Allocation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Assign employees to companies, units, areas, and field officers
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 self-start">
          <ArrowLeftRight className="w-4 h-4" /> Reallocate
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Active Allocations</p>
          <p className="text-2xl text-foreground mt-1">
            {mockAllocations.filter((a) => a.status === "active").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Unallocated</p>
          <p className="text-2xl text-foreground mt-1">{unallocated.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Areas Covered</p>
          <p className="text-2xl text-foreground mt-1">{areas.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Field Officers</p>
          <p className="text-2xl text-foreground mt-1">3</p>
        </div>
      </div>

      {/* Unallocated Employees */}
      {unallocated.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <h3 className="text-orange-700 text-sm mb-3">
            Unallocated Employees ({unallocated.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {unallocated.map((emp) => (
              <div
                key={emp.empId}
                className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 border border-orange-100"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{emp.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {emp.empId} · {emp.designation}
                  </p>
                </div>
                <button className="ml-2 px-2.5 py-1 text-[11px] bg-gray-900 text-white rounded-md hover:bg-gray-800">
                  Allocate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Toggle + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee or company..."
            className="w-full h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/20"
          />
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-xs rounded-md ${view === "list" ? "bg-gray-900 text-white" : "text-muted-foreground"}`}
          >
            List View
          </button>
          <button
            onClick={() => setView("area")}
            className={`px-3 py-1.5 text-xs rounded-md ${view === "area" ? "bg-gray-900 text-white" : "text-muted-foreground"}`}
          >
            Area View
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Employee",
                    "Company / Unit",
                    "Shift",
                    "Area",
                    "Field Officer",
                    "Since",
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
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">
                        {a.employeeName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {a.empId}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{a.company}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {a.unit}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {a.shift}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {a.area}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      {a.fieldOfficer}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {a.allocatedFrom}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${a.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area) => {
            const areaAllocations = filtered.filter(
              (a) => a.area === area && a.status === "active",
            );
            return (
              <div
                key={area}
                className="bg-card border border-border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-foreground" />
                  <h3 className="text-foreground text-sm">{area}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {areaAllocations.length} guards
                  </span>
                </div>
                <div className="space-y-2">
                  {areaAllocations.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-xs text-foreground">
                          {a.employeeName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {a.company} · {a.unit}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {a.shift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

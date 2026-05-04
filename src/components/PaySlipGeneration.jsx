import { useState } from "react";
import { FileText, Printer, Download, Search, Edit } from "lucide-react";

const mockPaySlips = [
  {
    id: "1",
    empId: "COL-001",
    employeeName: "Rajesh Kumar",
    month: "February 2026",
    basicSalary: 15000,
    hra: 3000,
    transportAllowance: 1500,
    pfDeduction: 1800,
    esiDeduction: 263,
    professionalTax: 200,
    advance: 0,
    messFee: 500,
    uniformRent: 200,
    grossSalary: 19500,
    totalDeductions: 2963,
    netSalary: 16537,
    status: "generated",
    company: "TechPark Solutions",
  },
  {
    id: "2",
    empId: "COL-002",
    employeeName: "Suresh Patel",
    month: "February 2026",
    basicSalary: 18000,
    hra: 3600,
    transportAllowance: 1500,
    pfDeduction: 2160,
    esiDeduction: 323,
    professionalTax: 200,
    advance: 2000,
    messFee: 500,
    uniformRent: 200,
    grossSalary: 23100,
    totalDeductions: 5383,
    netSalary: 17717,
    status: "printed",
    company: "Phoenix Mall",
  },
  {
    id: "3",
    empId: "COL-003",
    employeeName: "Amit Singh",
    month: "February 2026",
    basicSalary: 22000,
    hra: 4400,
    transportAllowance: 1500,
    pfDeduction: 2640,
    esiDeduction: 0,
    professionalTax: 200,
    advance: 0,
    messFee: 0,
    uniformRent: 200,
    grossSalary: 27900,
    totalDeductions: 3040,
    netSalary: 24860,
    status: "generated",
    company: "Greenfield Apts",
  },
  {
    id: "4",
    empId: "COL-006",
    employeeName: "Prakash Yadav",
    month: "February 2026",
    basicSalary: 14000,
    hra: 2800,
    transportAllowance: 1500,
    pfDeduction: 1680,
    esiDeduction: 256,
    professionalTax: 200,
    advance: 1000,
    messFee: 500,
    uniformRent: 200,
    grossSalary: 18300,
    totalDeductions: 3836,
    netSalary: 14464,
    status: "pending_edit",
    company: "Wipro Campus",
  },
  {
    id: "5",
    empId: "COL-007",
    employeeName: "Deepak Sharma",
    month: "February 2026",
    basicSalary: 15000,
    hra: 3000,
    transportAllowance: 1500,
    pfDeduction: 0,
    esiDeduction: 273,
    professionalTax: 200,
    advance: 0,
    messFee: 500,
    uniformRent: 0,
    grossSalary: 19500,
    totalDeductions: 973,
    netSalary: 18527,
    status: "generated",
    company: "City Hospital",
  },
  {
    id: "6",
    empId: "COL-008",
    employeeName: "Ravi Teja",
    month: "February 2026",
    basicSalary: 18000,
    hra: 3600,
    transportAllowance: 1500,
    pfDeduction: 2160,
    esiDeduction: 323,
    professionalTax: 200,
    advance: 0,
    messFee: 500,
    uniformRent: 200,
    grossSalary: 23100,
    totalDeductions: 3383,
    netSalary: 19717,
    status: "generated",
    company: "Infosys SEZ",
  },
];

const statusStyles = {
  generated: "bg-green-100 text-green-700",
  printed: "bg-blue-100 text-blue-700",
  pending_edit: "bg-yellow-100 text-yellow-700",
};

export function PaySlipGeneration() {
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const filtered = mockPaySlips.filter(
    (p) =>
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.empId.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPayout = mockPaySlips.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Pay Slip Generation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate, edit, and print pay slips with transport allowance and
            professional tax
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-foreground">
            <Download className="w-4 h-4" /> Bank Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            <Printer className="w-4 h-4" /> Print All
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Total Payslips</p>
          <p className="text-2xl text-foreground mt-1">{mockPaySlips.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Total Payout</p>
          <p className="text-2xl text-foreground mt-1">
            {"\u20B9"}
            {totalPayout.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Printed</p>
          <p className="text-2xl text-foreground mt-1">
            {mockPaySlips.filter((p) => p.status === "printed").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Pending Edit</p>
          <p className="text-2xl text-yellow-600 mt-1">
            {mockPaySlips.filter((p) => p.status === "pending_edit").length}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employee..."
          className="w-full sm:w-80 h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payslip List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Employee",
                    "Company",
                    "Gross",
                    "Deductions",
                    "Net Pay",
                    "Status",
                    "",
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
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer ${selectedSlip?.id === p.id ? "bg-gray-50" : ""}`}
                    onClick={() => setSelectedSlip(p)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">
                        {p.employeeName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.empId}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {p.company}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {"\u20B9"}
                      {p.grossSalary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-500">
                      {"\u20B9"}
                      {p.totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {"\u20B9"}
                      {p.netSalary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${statusStyles[p.status]}`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-50">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-50">
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payslip Detail */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          {selectedSlip ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground text-sm">Pay Slip Details</h3>
                <span className="text-xs text-muted-foreground">
                  {selectedSlip.month}
                </span>
              </div>
              <div className="space-y-1 mb-4 pb-4 border-b border-border">
                <p className="text-sm text-foreground">
                  {selectedSlip.employeeName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedSlip.empId} · {selectedSlip.company}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Earnings</p>
                  <div className="space-y-1.5">
                    {[
                      ["Basic Salary", selectedSlip.basicSalary],
                      ["HRA", selectedSlip.hra],
                      ["Transport Allowance", selectedSlip.transportAllowance],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-foreground">
                          {"\u20B9"}
                          {val.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs pt-1 border-t border-border">
                      <span className="text-foreground">Gross Salary</span>
                      <span className="text-foreground">
                        {"\u20B9"}
                        {selectedSlip.grossSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Deductions
                  </p>
                  <div className="space-y-1.5">
                    {[
                      ["PF Contribution", selectedSlip.pfDeduction],
                      ["ESI Contribution", selectedSlip.esiDeduction],
                      ["Professional Tax", selectedSlip.professionalTax],
                      ["Advance", selectedSlip.advance],
                      ["Mess Fee", selectedSlip.messFee],
                      ["Uniform Rent", selectedSlip.uniformRent],
                    ]
                      .filter(([_, val]) => val > 0)
                      .map(([label, val]) => (
                        <div
                          key={label}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-red-500">
                            -{"\u20B9"}
                            {val.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    <div className="flex justify-between text-xs pt-1 border-t border-border">
                      <span className="text-foreground">Total Deductions</span>
                      <span className="text-red-500">
                        {"\u20B9"}
                        {selectedSlip.totalDeductions.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm text-white">Net Pay</span>
                  <span className="text-lg text-white">
                    {"\u20B9"}
                    {selectedSlip.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <FileText className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Select an employee to view pay slip details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

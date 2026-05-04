import { useState } from "react";
import { Plus, Search, FileText, Edit, X, Receipt } from "lucide-react";

const COUNTRY_CODES = [
  { label: 'IN (+91)', value: '+91' },
  { label: 'US (+1)', value: '+1' },
  { label: 'UK (+44)', value: '+44' },
  { label: 'AE (+971)', value: '+971' },
];

const mockCustomers = [
  {
    id: "1",
    companyName: "TechPark Solutions Pvt Ltd",
    contactPerson: "Vikram Malhotra",
    phone: "9812345678",
    gstNo: "29AABCT1234F1ZB",
    address: "Electronic City, Bangalore",
    guardsDeployed: 24,
    billingType: "attendance",
    monthlyBill: 480000,
    status: "active",
    lastBillDate: "2026-02-28",
  },
  {
    id: "2",
    companyName: "Phoenix Mall",
    contactPerson: "Anita Sharma",
    phone: "9812345679",
    gstNo: "29AABCP5678G2ZC",
    address: "Whitefield, Bangalore",
    guardsDeployed: 36,
    billingType: "attendance",
    monthlyBill: 720000,
    status: "active",
    lastBillDate: "2026-02-28",
  },
  {
    id: "3",
    companyName: "Greenfield Apartments",
    contactPerson: "Sunil Mehta",
    phone: "9812345680",
    gstNo: "29AABCG9012H3ZD",
    address: "Koramangala, Bangalore",
    guardsDeployed: 8,
    billingType: "manual",
    monthlyBill: 160000,
    status: "active",
    lastBillDate: "2026-02-25",
  },
  {
    id: "4",
    companyName: "Reliance Industries",
    contactPerson: "Priya Nair",
    phone: "9812345681",
    gstNo: "29AABCR3456I4ZE",
    address: "Peenya Industrial Area",
    guardsDeployed: 48,
    billingType: "attendance",
    monthlyBill: 960000,
    status: "active",
    lastBillDate: "2026-02-28",
  },
  {
    id: "5",
    companyName: "City Hospital",
    contactPerson: "Dr. Rajan",
    phone: "9812345682",
    gstNo: "29AABCC7890J5ZF",
    address: "Jayanagar, Bangalore",
    guardsDeployed: 12,
    billingType: "manual",
    monthlyBill: 240000,
    status: "active",
    lastBillDate: "2026-02-20",
  },
  {
    id: "6",
    companyName: "Sunrise Events",
    contactPerson: "Meera Iyer",
    phone: "9812345683",
    gstNo: "29AABCS2345K6ZG",
    address: "MG Road, Bangalore",
    guardsDeployed: 0,
    billingType: "manual",
    monthlyBill: 0,
    status: "inactive",
    lastBillDate: "2025-12-15",
  },
];

export function CustomerBilling() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("customers");

  const filtered = mockCustomers.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = mockCustomers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.monthlyBill, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Customer & Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customers with GST billing and attendance-based invoicing
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Active Customers</p>
          <p className="text-2xl text-foreground">
            {mockCustomers.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Guards Deployed</p>
          <p className="text-2xl text-foreground">
            {mockCustomers.reduce((sum, c) => sum + c.guardsDeployed, 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
          <p className="text-2xl text-foreground">
            {"\u20B9"}
            {(totalRevenue / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-foreground text-sm">Register New Customer</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Company Name", placeholder: "Enter company name" },
              { label: "Contact Person", placeholder: "Contact person name" },
              { label: "Phone", placeholder: "Phone number", hasCode: true },
              { label: "GST Number", placeholder: "GST identification number" },
              { label: "Address", placeholder: "Company address" },
              { label: "Guards Required", placeholder: "Number of guards" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {field.label}
                </label>
                {field.hasCode ? (
                  <div className="flex gap-2">
                    <select className="w-20 h-9 px-1 bg-secondary rounded-lg text-[10px] text-foreground border border-border focus:border-white/20 outline-none">
                      {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="flex-1 h-9 px-3 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-white/20 outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-white/20 outline-none"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Billing Type
              </label>
              <select className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-white/20 outline-none">
                <option value="attendance">Attendance Based</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="px-5 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Register Customer
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("customers")}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === "customers" ? "bg-gray-900 text-white" : "text-muted-foreground hover:text-foreground"}`}
        >
          Customers
        </button>
        <button
          onClick={() => setTab("billing")}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === "billing" ? "bg-gray-900 text-white" : "text-muted-foreground hover:text-foreground"}`}
        >
          Billing
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/20"
        />
      </div>

      {tab === "customers" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Company",
                    "Contact",
                    "GST No.",
                    "Guards",
                    "Billing Type",
                    "Monthly Bill",
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
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground whitespace-nowrap">
                        {c.companyName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {c.address}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">
                        {c.contactPerson}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {c.code || "+91"} {c.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {c.gstNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {c.guardsDeployed}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-muted-foreground capitalize">
                        {c.billingType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {"\u20B9"}
                      {c.monthlyBill.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-50">
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-50">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered
            .filter((c) => c.status === "active")
            .map((c) => (
              <div
                key={c.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-foreground text-sm">{c.companyName}</h3>
                    <p className="text-xs text-muted-foreground">
                      GST: {c.gstNo} | Last billed: {c.lastBillDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-secondary text-muted-foreground rounded-lg hover:text-foreground flex items-center gap-1.5">
                      <Edit className="w-3 h-3" /> Edit Bill
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Generate Invoice
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[11px] text-muted-foreground">Guards</p>
                    <p className="text-sm text-foreground">
                      {c.guardsDeployed}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[11px] text-muted-foreground">
                      Billing Type
                    </p>
                    <p className="text-sm text-foreground capitalize">
                      {c.billingType}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[11px] text-muted-foreground">
                      Monthly Amount
                    </p>
                    <p className="text-sm text-foreground">
                      {"\u20B9"}
                      {c.monthlyBill.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[11px] text-muted-foreground">
                      GST (18%)
                    </p>
                    <p className="text-sm text-foreground">
                      {"\u20B9"}
                      {Math.round(c.monthlyBill * 0.18).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

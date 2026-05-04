import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Shield,
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  ArrowLeftRight,
  FileText,
  CalendarDays,
  DollarSign,
  BarChart3,
  Menu,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Database,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "./AuthContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { path: "/dashboard/employees", label: "Employee Registration", icon: Users },
  {
    path: "/dashboard/applications",
    label: "Applications",
    icon: ClipboardList,
  },
  { path: "/dashboard/staffs", label: "Staffs", icon: UserCheck },
  { path: "/dashboard/clients", label: "Clients", icon: Building2 },

  {
    label: "Masters",
    icon: Database,
    subItems: [
      { path: "/dashboard/masters/jobs", label: "Jobs" },
      { path: "/dashboard/masters/designations", label: "Designations" },
      { path: "/dashboard/masters/areas", label: "Areas" },
      { path: "/dashboard/masters/branches", label: "Branches" },
    ]
  },
  // {
  //   path: "/dashboard/interviews",
  //   label: "Interview Management",
  //   icon: UserCheck,
  // },
  // {
  //   path: "/dashboard/customers",
  //   label: "Customer & Billing",
  //   icon: Building2,
  // },
  // {
  //   path: "/dashboard/allocation",
  //   label: "Employee Allocation",
  //   icon: ArrowLeftRight,
  // },
  // { path: "/dashboard/payslips", label: "Pay Slip Generation", icon: FileText },
  // {
  //   path: "/dashboard/leave-expense",
  //   label: "Leave & Expense",
  //   icon: CalendarDays,
  // },
  // { path: "/dashboard/payroll", label: "Payroll Management", icon: DollarSign },
  // { path: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("coloneltoken")
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full bg-sidebar border-r border-sidebar-border
          transition-all duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-64" : "w-16"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-black" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-sm text-white whitespace-nowrap">
                Colonel Security
              </h1>
              <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                Management System
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
          {navItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.label} className="mb-0.5">
                  <button
                    onClick={() => {
                      if (expandedMenu === item.label) setExpandedMenu(null);
                      else setExpandedMenu(item.label);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group
                      ${expandedMenu === item.label ? "bg-sidebar-accent text-white" : "text-muted-foreground hover:text-white hover:bg-sidebar-accent"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {sidebarOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === item.label ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  {sidebarOpen && expandedMenu === item.label && (
                    <div className="pl-9 pr-3 py-1 space-y-1">
                      {item.subItems.map(subItem => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded-md transition-colors ${isActive
                              ? "bg-white text-black font-medium"
                              : "text-muted-foreground hover:text-white hover:bg-sidebar-accent"
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors group
                  ${isActive
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-sidebar-accent"
                  }`
                }
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar toggle (desktop) */}
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 bg-background">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border-none outline-none w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm">
                {user?.initials || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-foreground">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 light-content bg-[#f8f9fa]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

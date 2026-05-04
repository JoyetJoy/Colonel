import { createBrowserRouter } from "react-router";
import { RootLayout } from "../components/RootLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";
import { Dashboard } from "../components/Dashboard";
import { EmployeeListings } from "../components/EmployeeListings";
import { EmployeeViewPage } from "../components/EmployeeViewPage";
import { InterviewManagement } from "../components/InterviewManagement";
import { CustomerBilling } from "../components/CustomerBilling";
import { EmployeeAllocation } from "../components/EmployeeAllocation";
import { PaySlipGeneration } from "../components/PaySlipGeneration";
import { LeaveExpenseManagement } from "../components/LeaveExpenseManagement";
import { PayrollManagement } from "../components/PayrollManagement";
import { ReportsGeneration } from "../components/ReportsGeneration";
import { JobsMaster } from "../components/masters/JobsMaster";
import { DesignationsMaster } from "../components/masters/DesignationsMaster";
import { AreasMaster } from "../components/masters/AreasMaster";
import { BranchesMaster } from "../components/masters/BranchesMaster";
import { ClientViewPage } from "../components/ClientViewPage";
import { NotFound } from "../components/NotFound";
import { JobsPage } from "../components/JobsPage";
import { JobDetailsPage } from "../components/JobDetailsPage";
import { ApplyJobPage } from "../components/ApplyJobPage";
import LoginPage from "../components/LoginPage";
import { ApplicationsPage } from "../components/ApplicationsPage";
import { ApplicationViewPage } from "../components/ApplicationViewPage";
import { StaffsListings } from "../components/StaffsListings";
import { ClientsListing } from "../components/ClientsListing";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: LoginPage,
      },
      {
        path: "/jobs",
        Component: JobsPage,
      },
      {
        path: "/jobs/:jobId",
        Component: JobDetailsPage,
      },
      {
        path: "/jobs/apply/:jobId",
        Component: ApplyJobPage,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "/dashboard",
            Component: Layout,
            children: [
              { index: true, Component: Dashboard },
              { path: "employees", Component: EmployeeListings },
              { path: "employees/view/:id", Component: EmployeeViewPage },
              { path: "interviews", Component: InterviewManagement },
              { path: "customers", Component: CustomerBilling },
              { path: "allocation", Component: EmployeeAllocation },
              { path: "payslips", Component: PaySlipGeneration },
              { path: "leave-expense", Component: LeaveExpenseManagement },
              { path: "payroll", Component: PayrollManagement },
              { path: "reports", Component: ReportsGeneration },
              { path: "masters/jobs", Component: JobsMaster },
              { path: "masters/designations", Component: DesignationsMaster },
              { path: "masters/areas", Component: AreasMaster },
              { path: "masters/branches", Component: BranchesMaster },
              { path: "staffs", Component: StaffsListings },
              { path: "clients", Component: ClientsListing },
              { path: "clients/view/:id", Component: ClientViewPage },
              {
                path: "applications",
                children: [
                  { index: true, Component: ApplicationsPage },
                  { path: "view/:id", Component: ApplicationViewPage },
                ]
              },
            ],
          },
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

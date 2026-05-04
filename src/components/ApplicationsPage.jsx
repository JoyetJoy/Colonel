import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { newRequest } from '../api';
import { JOB_APPLICATIONS } from '../api/apis';
import { Search, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { DataTable } from "./ui/DataTable";

export function ApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: applicationsResponse, isLoading, isError } = useQuery({
    queryKey: ['applications', currentPage, itemsPerPage, keyword],
    queryFn: () =>
      newRequest.get(JOB_APPLICATIONS, {
        params: {
          keyword: keyword,
          page: currentPage,
          limit: itemsPerPage
        }
      }).then(res => res.data)
  });

  const columns = useMemo(() => [
    {
      header: "Applicant Name",
      accessor: (app) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-xs text-white overflow-hidden shrink-0">
            {app.documents?.photos ? (
              <img src={app.documents.photos} alt="" className="w-full h-full object-cover" />
            ) : (
              app.nameOfApplicant?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <span className="text-sm text-gray-900 whitespace-nowrap font-medium">
            {app.nameOfApplicant}
          </span>
        </div>
      ),
    },
    { header: "Job", accessor: (app) => <>{app.job?.name}</>, className: "text-gray-500 whitespace-nowrap" },
    { header: "Phone", accessor: (app) => `${app.code || ''} ${app.contactNumber}`, className: "text-gray-500" },
    { header: "Qualification", accessor: "educationalQualification", className: "text-gray-500" },
    { header: "Experience", accessor: "experience", className: "text-gray-500 whitespace-nowrap" },
    {
      header: "Applied Date",
      accessor: (app) => app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'N/A',
      className: "text-gray-500"
    },
    {
      header: "Status",
      accessor: (app) => {
        const status = app.status || 'Pending';
        let statusClass = "bg-gray-100 text-gray-700";
        if (status === 'NewApplication') statusClass = "bg-yellow-100 text-yellow-700";
        if (status === 'Rejected') statusClass = "bg-red-100 text-red-700";
        if (status === 'Active' || status === 'Converted') statusClass = "bg-green-100 text-green-700";
        return (
          <span className={`text-[11px] px-2.5 py-1 rounded-full capitalize font-medium ${statusClass}`}>
            {status==='NewApplication'? "New Application" : status }
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: (app) => (
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate(`view/${app.id}`)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#dee8ff] hover:bg-blue-200 transition-colors"
            title="View Details"
          >
            <Eye className="size-3" color="#487fff" />
          </button>
        </div>
      ),
    },
  ], [navigate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Job Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage all incoming job applications
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/20"
          />
        </div>
        {/* <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-white border border-border transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button> */}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm font-medium">Loading applications...</p>
          </div>
        ) : isError ? (
          <div className="p-8">
            <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-600 font-medium text-sm">Failed to load applications.</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={applicationsResponse?.data || []}
            pagination={true}
            currentPage={currentPage}
            totalPages={Math.ceil((applicationsResponse?.meta?.total || applicationsResponse?.total || 0) / itemsPerPage) || 1}
            totalItems={applicationsResponse?.meta?.total || applicationsResponse?.total || applicationsResponse?.data?.length || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}

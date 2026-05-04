import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { newRequest } from '../api';
import { JOBS_LIST, BRANCH_DROPDOWN } from '../api/apis';
import { Search, MapPin, Briefcase, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export function JobsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [selectedBranch, setSelectedBranch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: branchDropdown } = useQuery({
    queryKey: ["branchDropdown"],
    queryFn: () => newRequest.get(BRANCH_DROPDOWN).then((res) => res.data),
  });

  const { data: jobResponse, isLoading, isError } = useQuery({
    queryKey: ["jobList", currentPage, searchTerm, selectedBranch],
    queryFn: () =>
      newRequest
        .get(JOBS_LIST, {
          params: {
            keyword: searchTerm,
            page: currentPage,
            limit: itemsPerPage,
            branchId: selectedBranch || undefined,
          },
        })
        .then((res) => res.data),
  });

  const jobs = jobResponse?.data || [];
  const totalPages = jobResponse?.totalPages || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch]);



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gray-900 text-white py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Join Our Security Team</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover opportunities to protect and serve. We are looking for dedicated professionals to join Colonel Security.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-24 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 text-black">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
            />
          </div>
          <div className="relative w-full md:w-64 text-black">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-12 pl-10 pr-10 rounded-xl border border-gray-200 bg-white shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Branches</option>
              {branchDropdown?.data?.map(branch => (
                <option key={branch.value} value={branch.value}>{branch.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-gray-900 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching available positions...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm">
            <h3 className="text-lg font-medium text-red-600">Failed to load jobs</h3>
            <p className="text-gray-500 mt-1">Please try again later.</p>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.name}</h3>
                    <div className="flex items-center justify-between gap-2 text-gray-500 text-sm mt-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.branch?.name || job.branchName || 'Remote/Branch'}</span>
                      </div>
                      <span className="text-gray-400 text-xs font-medium">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full py-2.5 bg-gray-50 text-gray-900 font-medium rounded-xl border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1 flex-wrap justify-center">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or branch filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedBranch(''); }}
              className="mt-6 text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

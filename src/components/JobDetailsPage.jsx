import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { newRequest } from '../api';
import { JOBS_LIST } from '../api/apis';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building, Loader2 } from 'lucide-react';

export function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { data: jobResponse, isLoading, isError } = useQuery({
    queryKey: ["jobDetail", jobId],
    queryFn: () =>
      newRequest
        .get(`${JOBS_LIST}/${jobId}`)
        .then((res) => res.data),
  });

  const job = jobResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-12 h-12 text-gray-900 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">The position you're looking for doesn't exist or has been closed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{job.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>Colonel Security</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{job.branch?.name || job.branchName || "Remote/Branch"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/jobs/apply/${job.id}`)}
              className="w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer shrink-0"
            >
              Apply for this Job
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-b-2xl shadow-sm border-t-0 border border-gray-100 p-8 md:p-10 mt-1">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Job Description</h2>
          <div className="prose prose-gray max-w-full overflow-hidden break-words">
            {job.description ? (
              <div
                className="text-gray-800 leading-relaxed prose prose-blue max-w-full"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <p className="text-gray-500 italic">No description provided for this position.</p>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              Does this sound like a good fit for you? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

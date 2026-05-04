import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Phone,
  MapPin,
  Star,
  Clock,
  X,
} from "lucide-react";

const COUNTRY_CODES = [
  { label: 'IN (+91)', value: '+91' },
  { label: 'US (+1)', value: '+1' },
  { label: 'UK (+44)', value: '+44' },
  { label: 'AE (+971)', value: '+971' },
];

const mockInterviews = [
  {
    id: "1",
    candidateName: "Arun Verma",
    phone: "9988776655",
    position: "Security Guard",
    date: "2026-03-16",
    time: "10:00 AM",
    location: "Head Office",
    status: "scheduled",
    rating: 0,
    experience: "3 years",
    notes: "Referred by Rajesh Kumar",
  },
  {
    id: "2",
    candidateName: "Kiran Bose",
    phone: "9988776656",
    position: "Senior Guard",
    date: "2026-03-15",
    time: "2:00 PM",
    location: "Head Office",
    status: "completed",
    rating: 4,
    experience: "5 years",
    notes: "Strong candidate, good communication",
  },
  {
    id: "3",
    candidateName: "Manoj Tiwari",
    phone: "9988776657",
    position: "Security Guard",
    date: "2026-03-14",
    time: "11:00 AM",
    location: "Branch Office",
    status: "hired",
    rating: 5,
    experience: "7 years",
    notes: "Excellent background, hired immediately",
  },
  {
    id: "4",
    candidateName: "Sanjay Rao",
    phone: "9988776658",
    position: "Supervisor",
    date: "2026-03-13",
    time: "3:00 PM",
    location: "Head Office",
    status: "rejected",
    rating: 2,
    experience: "1 year",
    notes: "Insufficient experience for supervisor role",
  },
  {
    id: "5",
    candidateName: "Rohit Mehra",
    phone: "9988776659",
    position: "Security Guard",
    date: "2026-03-17",
    time: "9:30 AM",
    location: "Head Office",
    status: "pending",
    rating: 0,
    experience: "2 years",
    notes: "Walk-in candidate",
  },
  {
    id: "6",
    candidateName: "Naveen Joshi",
    phone: "9988776660",
    position: "Guard",
    date: "2026-03-18",
    time: "11:30 AM",
    location: "Branch Office",
    status: "scheduled",
    rating: 0,
    experience: "4 years",
    notes: "",
  },
];

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
  hired: "bg-green-100 text-green-700",
  pending: "bg-gray-100 text-gray-500",
};

export function InterviewManagement() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockInterviews.filter((i) => {
    const matchSearch = i.candidateName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground">Interview Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conduct and store interviews for recruitment
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-foreground text-sm">Schedule New Interview</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                label: "Candidate Name",
                placeholder: "Full name",
                type: "text",
              },
              { 
                label: "Phone", 
                placeholder: "Phone number", 
                type: "tel",
                hasCode: true
              },
              {
                label: "Position",
                placeholder: "e.g. Security Guard",
                type: "text",
              },
              { label: "Interview Date", placeholder: "", type: "date" },
              { label: "Interview Time", placeholder: "", type: "time" },
              {
                label: "Location",
                placeholder: "e.g. Head Office",
                type: "text",
              },
              {
                label: "Experience",
                placeholder: "e.g. 3 years",
                type: "text",
              },
              { label: "Notes", placeholder: "Additional notes", type: "text" },
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
                      type={field.type}
                      placeholder={field.placeholder}
                      className="flex-1 h-9 px-3 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-white/20 outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-white/20 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button className="px-5 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Schedule
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/20"
          />
        </div>
        <div className="flex gap-1.5">
          {[
            "all",
            "scheduled",
            "completed",
            "hired",
            "rejected",
            "pending",
          ].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs rounded-lg capitalize transition-colors ${
                statusFilter === s
                  ? "bg-gray-900 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((interview) => (
          <div
            key={interview.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-gray-300 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-foreground text-sm">
                  {interview.candidateName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {interview.position}
                </p>
              </div>
              <span
                className={`text-[11px] px-2 py-1 rounded-full capitalize ${statusColors[interview.status]}`}
              >
                {interview.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" /> {interview.date}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {interview.time}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5" /> {interview.code || "+91"} {interview.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {interview.location}
              </div>
            </div>
            {interview.rating > 0 && (
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < interview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                  />
                ))}
              </div>
            )}
            {interview.notes && (
              <p className="text-xs text-muted-foreground bg-gray-50 rounded-lg p-2.5">
                {interview.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

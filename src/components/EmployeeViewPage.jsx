import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ImagePreview from "./popups/ImagePreview";
import { newRequest } from "../api";
import { EMPLOYEES } from "../api/apis";
import { DocumentCard } from "./ui/DocumentCard";
import { SectionHeader } from "./ui/SectionHeader";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Heart,
  Shield,
  User,
  FileText,
  Building2,
  Droplets,
  Ruler,
  Weight,
  ScanLine,
  GraduationCap,
  Clock,
  AlertCircle,
  Users,
  CreditCard,
  Landmark,
  ImageIcon,
} from "lucide-react";

const statusConfig = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  inactive: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400", border: "border-gray-200" },
  absconding: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", border: "border-red-200" },
};

function InfoItem({ icon: Icon, label, value, iconColor = "text-gray-400" }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 font-medium break-words">{value || "—"}</p>
      </div>
    </div>
  );
}



export function EmployeeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

  const { data: employeeData, isLoading, isError } = useQuery({
    queryKey: ["employeeView", id],
    queryFn: () => newRequest.get(`${EMPLOYEES}/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const emp = employeeData?.data;

  // Format ISO date strings for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = dateStr.split("T")[0];
    return d || "—";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (isError || !emp) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-600">Failed to load employee details.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[emp.status] || statusConfig.inactive;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Employee Profile</h1>
          <p className="text-xs text-gray-400 mt-0.5">View complete employee information</p>
        </div>
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 relative">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="px-6 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Profile Image */}
            <div
              className={`w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gray-100 shrink-0 ${emp.profileImage ? 'cursor-pointer' : ''}`}
              onClick={() => emp.profileImage && setPreviewImage(emp.profileImage)}
            >
              {emp.profileImage ? (
                <img
                  src={emp.profileImage}
                  alt={emp.nameOfApplicant}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-3xl font-bold">
                  {emp.nameOfApplicant?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* Name & Meta */}
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h2 className="text-xl font-bold text-gray-900">{emp.nameOfApplicant}</h2>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {emp.status?.charAt(0).toUpperCase() + emp.status?.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {emp.employeeCode && (
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> {emp.employeeCode}
                  </span>
                )}
                {emp.designation?.name && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> {emp.designation.name}
                  </span>
                )}
                {emp.contactNumber && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {emp.code} {emp.contactNumber}
                  </span>
                )}
                {emp.emergencyNumber && (
                  <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                    <Phone className="w-3.5 h-3.5" /> {emp.emergencyCode} {emp.emergencyNumber} (Emergency)
                  </span>
                )}
                {emp.branch?.name && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {emp.branch.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={User} title="Personal Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem icon={User} label="Father's Name" value={emp.fatherGuardianName} />
              <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(emp.dateOfBirth)} />
              <InfoItem icon={Clock} label="Age" value={emp.age} />
              <InfoItem icon={Heart} label="Caste / Religion" value={emp.casteReligion} />
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem icon={Droplets} label="Blood Group" value={emp.bloodGroup} iconColor="text-red-400" />
              <InfoItem icon={ScanLine} label="Aadhaar Number" value={emp.aadharNumber} />
              <InfoItem icon={Phone} label="Emergency Contact" value={`${emp.emergencyCode || ""} ${emp.emergencyNumber || ""}`} iconColor="text-orange-400" />
              <InfoItem icon={ScanLine} label="Identification Marks" value={emp.identificationMarks} />
            </div>
          </div>
        </div>

        {/* Professional & Physical */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Briefcase} title="Professional & Physical" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem icon={Briefcase} label="Designation" value={emp.designation?.name} />
              <InfoItem icon={Calendar} label="Date of Joining" value={formatDate(emp.applicationDate)} />
              <InfoItem icon={GraduationCap} label="Qualification" value={emp.educationalQualification} />
              <InfoItem icon={Clock} label="Experience" value={emp.experience} />
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem icon={Ruler} label="Height" value={emp.height ? `${emp.height} cm` : "—"} />
              <InfoItem icon={Weight} label="Weight" value={emp.weight ? `${emp.weight} kg` : "—"} />
              <InfoItem icon={MapPin} label="Preferred Location" value={emp.preferredJobLocations} />
              <InfoItem icon={Building2} label="Branch" value={emp.branch?.name} />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={MapPin} title="Address Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">Present Address</p>
              <p className="text-sm text-gray-800 leading-relaxed">{emp.presentAddress || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">Permanent Address</p>
              <p className="text-sm text-gray-800 leading-relaxed">{emp.permanentAddress || "—"}</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Landmark} title="Bank & Statutory Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem icon={Building2} label="Branch Name" value={emp.EmployeeBankDetails?.branchName} />
              <InfoItem icon={CreditCard} label="Account Number" value={emp.EmployeeBankDetails?.bankAcctNo} />
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem icon={Landmark} label="IFSC Code" value={emp.EmployeeBankDetails?.ifscCode} />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section - Full Width */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader icon={FileText} title="Documents" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <DocumentCard label="Profile Photo" imageUrl={emp.profileImage} onImageClick={setPreviewImage} />
          <DocumentCard label="Aadhaar Card" imageUrl={emp.EmployeeDocument?.aadharCard} onImageClick={setPreviewImage} />
          <DocumentCard label="PAN Card" imageUrl={emp.EmployeeDocument?.panCard} onImageClick={setPreviewImage} />
          <DocumentCard label="PCC Document" imageUrl={emp.EmployeeDocument?.pcc} onImageClick={setPreviewImage} />
          <DocumentCard label="Bank Passbook" imageUrl={emp.EmployeeDocument?.bankPassbook} onImageClick={setPreviewImage} />
        </div>
      </div>

      {/* Family Members - Full Width */}
      {emp.EmployeeFamilyMember && emp.EmployeeFamilyMember.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Users} title="Family Members" />
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Relation</th>
                  <th className="px-4 py-3">Date of Birth</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Phone Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {emp.EmployeeFamilyMember.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{member.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{member.relation || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(member.dateOfBirth)}</td>
                    <td className="px-4 py-3 text-gray-600">{member.age || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{member?.code} {member.phoneNumber || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ImagePreview previewImage={previewImage} setPreviewImage={setPreviewImage} />
    </div>
  );
}

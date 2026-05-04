import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ImagePreview from "./popups/ImagePreview";
import { newRequest } from "../api";
import {
  JOB_APPLICATIONS,
  EMPLOYEES,
  APPLICATION_UPDATE,
  APPLICATION_REJECT,
} from "../api/apis";
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
  XCircle,
  UserPlus,
  Loader2,
  Image as ImageIconAlt,
} from "lucide-react";
import toast from "react-hot-toast";
import { DocumentCard } from "./ui/DocumentCard";
import { SectionHeader } from "./ui/SectionHeader";

function InfoItem({ icon: Icon, label, value, iconColor = "text-gray-400" }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-800 font-medium break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export function ApplicationViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: applicationData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["applicationView", id],
    queryFn: () =>
      newRequest.get(`${JOB_APPLICATIONS}/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const app = applicationData?.data;

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const res = await newRequest.patch(`${APPLICATION_REJECT}/${id}`);
      if (res.data.status) {
        toast.success(res.data.message || "Application Rejected");
        queryClient.invalidateQueries(["applicationView", id]);
        navigate(-1);
      }
    } catch (error) {
      toast.error("Failed to reject application");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleConvertToEmployee = async () => {
    try {
      setIsConverting(true);
      const res = await newRequest.patch(`${APPLICATION_UPDATE}/${id}`);
      if (res.data.status) {
        toast.success(
          res.data.message || "Converted to Employee successfully!",
        );
        navigate("/dashboard/employees");
      }
    } catch (error) {
      toast.error("Failed to convert to employee");
    } finally {
      setIsConverting(false);
    }
  };

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
          <p className="text-sm text-gray-500 font-medium">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !app) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Failed to load application details.
          </p>
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

  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Application Review
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review candidate application details
            </p>
          </div>
        </div>

        {app.status === "NewApplication" && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={isRejecting || isConverting}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRejecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {isRejecting ? "Rejecting..." : "Reject"}
            </button>
            <button
              onClick={handleConvertToEmployee}
              disabled={isRejecting || isConverting}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {isConverting ? "Converting..." : "Convert to Employee"}
            </button>
          </div>
        )}
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black">
        <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="px-6 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div
              className={`w-28 h-28 rounded-2xl border-4 cursor-pointer border-white shadow-lg overflow-hidden bg-gray-100 shrink-0 ${app.documents?.photos ? "cursor-pointer" : ""}`}
              onClick={() =>
                app.profileImage && setPreviewImage(app.profileImage)
              }
            >
              {app.profileImage ? (
                <img
                  src={app.profileImage}
                  alt={app.nameOfApplicant}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-3xl font-bold">
                  {app.nameOfApplicant?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h2 className="text-xl font-bold text-gray-900">
                  {app.nameOfApplicant}
                </h2>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${app.status === "NewApplication" ? "bg-yellow-100 text-yellow-700" : app?.status === "Converted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} border-blue-100`}>
                  <span
                    className={` `}
                  />
                  {app.status==='NewApplication'? "New Application" : app.status }
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {app.registrationNo && (
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> {app.registrationNo}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {app.code}{" "}
                  {app.contactNumber}
                </span>
                <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                  <Phone className="w-3.5 h-3.5" /> {app.emergencyCode}{" "}
                  {app.emergencyNumber} (Emergency)
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />{" "}
                  {app.bankDetails?.branchName || "Not Assigned"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={User} title="Personal Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem
                icon={User}
                label="Father's Name"
                value={app.fatherGuardianName}
              />
              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={formatDate(app.dateOfBirth)}
              />
              <InfoItem icon={Clock} label="Age" value={app.age} />
              <InfoItem
                icon={Heart}
                label="Caste / Religion"
                value={app.casteReligion}
              />
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem
                icon={Droplets}
                label="Blood Group"
                value={app.bloodGroup}
                iconColor="text-red-400"
              />
              <InfoItem
                icon={ScanLine}
                label="Aadhaar Number"
                value={app.aadharNumber}
              />
              <InfoItem
                icon={Phone}
                label="Emergency Contact"
                value={`${app.emergencyCode || ""} ${app.emergencyNumber || ""}`}
                iconColor="text-orange-400"
              />
              <InfoItem
                icon={ScanLine}
                label="Identification Marks"
                value={app.identificationMarks}
              />
            </div>
          </div>
        </div>

        {/* Professional & Physical */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Briefcase} title="Professional & Physical" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem
                icon={GraduationCap}
                label="Qualification"
                value={app.educationalQualification}
              />
              <InfoItem
                icon={Clock}
                label="Experience"
                value={app.experience}
              />
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem
                icon={Ruler}
                label="Height"
                value={app.height ? `${app.height} cm` : "—"}
              />
              <InfoItem
                icon={Weight}
                label="Weight"
                value={app.weight ? `${app.weight} kg` : "—"}
              />
              <InfoItem
                icon={MapPin}
                label="Preferred Location"
                value={app.preferredJobLocations}
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={MapPin} title="Address Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                Present Address
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {app.presentAddress || "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                Permanent Address
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {app.permanentAddress || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Landmark} title="Bank & Statutory Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem
                icon={Building2}
                label="Branch Name"
                value={app.bankDetails?.branchName}
              />
              <InfoItem
                icon={CreditCard}
                label="Account Number"
                value={app.bankDetails?.bankAcctNo}
              />
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
              <InfoItem
                icon={Landmark}
                label="IFSC Code"
                value={app.bankDetails?.ifscCode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader icon={FileText} title="Documents" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <DocumentCard
            label="Profile Photo"
            imageUrl={app?.profileImage}
            onImageClick={setPreviewImage}
          />
          <DocumentCard
            label="Aadhaar Card"
            imageUrl={app.documents?.aadharCard}
            onImageClick={setPreviewImage}
          />
          <DocumentCard
            label="PAN Card"
            imageUrl={app.documents?.panCard}
            onImageClick={setPreviewImage}
          />
          <DocumentCard
            label="PCC Document"
            imageUrl={app.documents?.pcc}
            onImageClick={setPreviewImage}
          />
          <DocumentCard
            label="Bank Passbook"
            imageUrl={app.documents?.bankPassbook}
            onImageClick={setPreviewImage}
          />
        </div>
      </div>

      {/* Family Members */}
      {app.familyMembers && app.familyMembers.length > 0 && (
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
                {app.familyMembers.map((member, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {member.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.relation || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(member.dateOfBirth)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.age || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {member?.code} {member.phoneNumber || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ImagePreview
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </div>
  );
}

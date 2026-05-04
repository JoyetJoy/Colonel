import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Briefcase, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { newFormRequest } from "../api";
import { EMPLOYEES, JOB_APPLICATION } from "../api/apis";
import { MOCK_JOBS } from "../data/mockJobs";

const phoneRegExp = /^[0-9]{10}$/;
const aadharRegExp = /^[0-9]{12}$/;
const ifscRegExp = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const COUNTRY_CODES = [
  { label: '+91', value: '+91' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+971', value: '+971' },
];

const schema = yup.object({
  nameOfApplicant: yup.string().required("Full Name is required"),
  contactNumber: yup.string().matches(phoneRegExp, "Phone must be 10 digits").required("Phone is required"),
  code: yup.string().required("Code required"),
  fatherGuardianName: yup.string().required("Father's Name is required"),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  age: yup.string().required("Age is required"),
  casteReligion: yup.string().required("Caste/Religion is required"),
  bloodGroup: yup.string().required("Blood Group is required"),
  presentAddress: yup.string().required("Present Address is required"),
  permanentAddress: yup.string().required("Permanent Address is required"),
  educationalQualification: yup.string().required("Qualification is required"),
  experience: yup.string().required("Experience is required"),
  aadharNumber: yup.string().matches(aadharRegExp, "Aadhaar must be 12 digits").required("Aadhaar is required"),
  height: yup.string().required("Height is required"),
  weight: yup.string().required("Weight is required"),
  preferredJobLocations: yup.string().required("Preferred Location is required"),
  identificationMarks: yup.string().required("Identification Marks required"),
  emergencyNumber: yup.string().matches(phoneRegExp, "Must be 10 digits").required("Emergency number required"),
  emergencyCode: yup.string().required("Code required"),
  branchName: yup.string().required("Branch Name is required"),
  ifscCode: yup.string().matches(ifscRegExp, "Invalid IFSC Code").required("IFSC Code is required"),
  bankAcctNo: yup.string().matches(/^[0-9]+$/, "Must be numeric").required("Account number required"),
  profileImage: yup.mixed().test("required", "Photo is required", (v) => v && v.length > 0),
  aadharCard: yup.mixed().test("required", "Aadhaar photo required", (v) => v && v.length > 0),
  panCard: yup.mixed().test("required", "PAN photo required", (v) => v && v.length > 0),
  pcc: yup.mixed().test("required", "PCC photo required", (v) => v && v.length > 0),
  bankPassbook: yup.mixed().test("required", "Passbook photo required", (v) => v && v.length > 0),
  familyDetails: yup.array().of(
    yup.object({
      name: yup.string().required("Name required"),
      relation: yup.string().required("Relation required"),
      dob: yup.string().required("DOB required"),
      age: yup.string().required("Age required"),
      phoneNumber: yup.string().matches(phoneRegExp, "Invalid number").required("Number required"),
      code: yup.string().required("Code required"),
    })
  ).min(1, "At least one family member required"),
}).required();

// Reusable input style
const inputClass = "w-full h-11 px-4 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all text-sm";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const fileClass = "w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black file:cursor-pointer file:transition-colors";
const errorClass = "text-red-500 text-xs mt-1";

function SectionTitle({ children }) {
  return (
    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2.5 mb-5">
      <span className="w-1.5 h-5 bg-gray-900 rounded-full" />
      {children}
    </h3>
  );
}

export function ApplyJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = MOCK_JOBS[jobId] || { name: "Open Position", branch: "Any Branch" };

  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "+91",
      emergencyCode: "+91",
      familyDetails: [{ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "familyDetails" });

  // File previews
  const watchedProfile = watch("profileImage");
  const watchedAadhar = watch("aadharCard");
  const watchedPan = watch("panCard");
  const watchedPcc = watch("pcc");
  const watchedPassbook = watch("bankPassbook");

  const getPreview = (file) => {
    if (file && file.length > 0 && file[0] instanceof File) return URL.createObjectURL(file[0]);
    return null;
  };

  const profilePreview = useMemo(() => getPreview(watchedProfile), [watchedProfile]);
  const aadharPreview = useMemo(() => getPreview(watchedAadhar), [watchedAadhar]);
  const panPreview = useMemo(() => getPreview(watchedPan), [watchedPan]);
  const pccPreview = useMemo(() => getPreview(watchedPcc), [watchedPcc]);
  const passbookPreview = useMemo(() => getPreview(watchedPassbook), [watchedPassbook]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    Object.keys(data).forEach((key) => {
      if (["profileImage", "aadharCard", "panCard", "pcc", "bankPassbook"].includes(key)) {
        if (data[key]?.[0]) formData.append(key, data[key][0]);
      } else if (["branchName", "ifscCode", "bankAcctNo"].includes(key)) {
        // grouped later
      } else if (key === "familyDetails") {
        formData.append("familyMembers", JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    formData.append("bankDetails", JSON.stringify({
      branchName: data.branchName,
      ifscCode: data.ifscCode,
      bankAcctNo: data.bankAcctNo,
    }));

    try {
      const res = await newFormRequest.post(JOB_APPLICATION, formData);
      if (res?.data?.status) {
        toast.success("Application submitted successfully!");
        navigate("/jobs");
      } else {
        toast.error(res?.data?.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-black">
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 px-8 py-10 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Apply for {job.name}</h1>
                <p className="text-gray-400 mt-1">{job.branch}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Fill in all the details below to submit your application. Fields marked with * are required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">

            {/* Personal Information */}
            <div>
              <SectionTitle>Personal Information</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="lg:col-span-1">
                  <label className={labelClass}>Photo *</label>
                  {profilePreview && (
                    <div className="mb-2 w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                      <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input type="file" accept="image/*" {...register("profileImage")} className={fileClass} />
                  {errors.profileImage && <p className={errorClass}>{errors.profileImage.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" {...register("nameOfApplicant")} className={inputClass} placeholder="Enter full name" />
                  {errors.nameOfApplicant && <p className={errorClass}>{errors.nameOfApplicant.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <div className="flex gap-2">
                    <select {...register("code")} className="w-16 h-11 px-1 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900">
                      {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input type="tel" {...register("contactNumber")} className={inputClass} placeholder="10-digit number" />
                  </div>
                  {(errors.contactNumber || errors.code) && <p className={errorClass}>{errors.contactNumber?.message || errors.code?.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Father's Name *</label>
                  <input type="text" {...register("fatherGuardianName")} className={inputClass} placeholder="Enter father's name" />
                  {errors.fatherGuardianName && <p className={errorClass}>{errors.fatherGuardianName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" {...register("dateOfBirth")} className={inputClass} />
                  {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Age *</label>
                  <input type="text" {...register("age")} className={inputClass} placeholder="e.g. 25" />
                  {errors.age && <p className={errorClass}>{errors.age.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Caste/Religion *</label>
                  <input type="text" {...register("casteReligion")} className={inputClass} placeholder="e.g. Hindu" />
                  {errors.casteReligion && <p className={errorClass}>{errors.casteReligion.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Blood Group *</label>
                  <select {...register("bloodGroup")} className={inputClass + " appearance-none"}>
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  {errors.bloodGroup && <p className={errorClass}>{errors.bloodGroup.message}</p>}
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div>
              <SectionTitle>Address Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Present Address *</label>
                  <textarea {...register("presentAddress")} rows={2} className={inputClass + " h-auto py-3 resize-none"} placeholder="Current residential address" />
                  {errors.presentAddress && <p className={errorClass}>{errors.presentAddress.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Permanent Address *</label>
                  <textarea {...register("permanentAddress")} rows={2} className={inputClass + " h-auto py-3 resize-none"} placeholder="Permanent home address" />
                  {errors.permanentAddress && <p className={errorClass}>{errors.permanentAddress.message}</p>}
                </div>
              </div>
            </div>

            {/* Professional & Physical */}
            <div>
              <SectionTitle>Professional & Physical Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>Qualification *</label>
                  <input type="text" {...register("educationalQualification")} className={inputClass} placeholder="e.g. Graduate" />
                  {errors.educationalQualification && <p className={errorClass}>{errors.educationalQualification.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Experience *</label>
                  <input type="text" {...register("experience")} className={inputClass} placeholder="e.g. 2 years" />
                  {errors.experience && <p className={errorClass}>{errors.experience.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Aadhaar Number *</label>
                  <input type="text" {...register("aadharNumber")} className={inputClass} placeholder="12-digit number" />
                  {errors.aadharNumber && <p className={errorClass}>{errors.aadharNumber.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Height (cm) *</label>
                  <input type="text" {...register("height")} className={inputClass} placeholder="e.g. 175" />
                  {errors.height && <p className={errorClass}>{errors.height.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Weight (kg) *</label>
                  <input type="text" {...register("weight")} className={inputClass} placeholder="e.g. 70" />
                  {errors.weight && <p className={errorClass}>{errors.weight.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Preferred Location *</label>
                  <input type="text" {...register("preferredJobLocations")} className={inputClass} placeholder="e.g. Mumbai" />
                  {errors.preferredJobLocations && <p className={errorClass}>{errors.preferredJobLocations.message}</p>}
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClass}>Identification Marks *</label>
                  <input type="text" {...register("identificationMarks")} className={inputClass} placeholder="e.g. Scar on left hand" />
                  {errors.identificationMarks && <p className={errorClass}>{errors.identificationMarks.message}</p>}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div>
              <SectionTitle>Document Uploads</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>Aadhaar Photo *</label>
                  {aadharPreview && (
                    <div className="mb-2 w-full h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={aadharPreview} alt="Aadhaar" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" {...register("aadharCard")} className={fileClass} />
                  {errors.aadharCard && <p className={errorClass}>{errors.aadharCard.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>PAN Photo *</label>
                  {panPreview && (
                    <div className="mb-2 w-full h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={panPreview} alt="PAN" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" {...register("panCard")} className={fileClass} />
                  {errors.panCard && <p className={errorClass}>{errors.panCard.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>PCC Photo *</label>
                  {pccPreview && (
                    <div className="mb-2 w-full h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={pccPreview} alt="PCC" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" {...register("pcc")} className={fileClass} />
                  {errors.pcc && <p className={errorClass}>{errors.pcc.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Passbook Photo *</label>
                  {passbookPreview && (
                    <div className="mb-2 w-full h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={passbookPreview} alt="Passbook" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input type="file" accept="image/*" {...register("bankPassbook")} className={fileClass} />
                  {errors.bankPassbook && <p className={errorClass}>{errors.bankPassbook.message}</p>}
                </div>
              </div>
            </div>

            {/* Bank & Statutory */}
            <div>
              <SectionTitle>Bank & Statutory Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>Branch Name *</label>
                  <input type="text" {...register("branchName")} className={inputClass} placeholder="e.g. HDFC Bank" />
                  {errors.branchName && <p className={errorClass}>{errors.branchName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>IFSC Code *</label>
                  <input type="text" {...register("ifscCode")} className={inputClass} placeholder="e.g. HDFC0001234" />
                  {errors.ifscCode && <p className={errorClass}>{errors.ifscCode.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Account Number *</label>
                  <input type="text" {...register("bankAcctNo")} className={inputClass} placeholder="Account number" />
                  {errors.bankAcctNo && <p className={errorClass}>{errors.bankAcctNo.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Emergency Number *</label>
                  <div className="flex gap-2">
                    <select {...register("emergencyCode")} className="w-16 h-11 px-1 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900">
                      {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input type="tel" {...register("emergencyNumber")} className={inputClass} placeholder="10-digit number" />
                  </div>
                  {(errors.emergencyNumber || errors.emergencyCode) && <p className={errorClass}>{errors.emergencyNumber?.message || errors.emergencyCode?.message}</p>}
                </div>
              </div>
            </div>

            {/* Family Details */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <SectionTitle>Family Details</SectionTitle>
                <button
                  type="button"
                  onClick={() => append({ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" })}
                  className="text-sm flex items-center gap-1.5 text-gray-900 font-medium hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 font-medium">
                    <tr>
                      <th className="px-4 py-3 font-medium">SL</th>
                      <th className="px-4 py-3 font-medium">Name *</th>
                      <th className="px-4 py-3 font-medium">Relation *</th>
                      <th className="px-4 py-3 font-medium">DOB *</th>
                      <th className="px-4 py-3 font-medium">Age *</th>
                      <th className="px-4 py-3 font-medium">Number *</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fields.map((field, index) => (
                      <tr key={field.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-gray-400 font-medium">{index + 1}</td>
                        <td className="px-4 py-2.5">
                          <input type="text" {...register(`familyDetails.${index}.name`)} className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900" placeholder="Name" />
                          {errors.familyDetails?.[index]?.name && <p className={errorClass}>{errors.familyDetails[index].name.message}</p>}
                        </td>
                        <td className="px-4 py-2.5">
                          <input type="text" {...register(`familyDetails.${index}.relation`)} className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900" placeholder="Relation" />
                          {errors.familyDetails?.[index]?.relation && <p className={errorClass}>{errors.familyDetails[index].relation.message}</p>}
                        </td>
                        <td className="px-4 py-2.5">
                          <input type="date" {...register(`familyDetails.${index}.dob`)} className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900" />
                          {errors.familyDetails?.[index]?.dob && <p className={errorClass}>{errors.familyDetails[index].dob.message}</p>}
                        </td>
                        <td className="px-4 py-2.5">
                          <input type="text" {...register(`familyDetails.${index}.age`)} className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900" placeholder="Age" />
                          {errors.familyDetails?.[index]?.age && <p className={errorClass}>{errors.familyDetails[index].age.message}</p>}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1.5 min-w-[150px]">
                            <select {...register(`familyDetails.${index}.code`)} className="w-16 h-9 px-1 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-gray-900">
                              {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                            <input type="tel" {...register(`familyDetails.${index}.phoneNumber`)} className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-900" placeholder="Phone" />
                          </div>
                          {(errors.familyDetails?.[index]?.phoneNumber || errors.familyDetails?.[index]?.code) && <p className={errorClass}>{errors.familyDetails[index].phoneNumber?.message || errors.familyDetails[index].code?.message}</p>}
                        </td>
                        <td className="px-4 py-2.5">
                          {fields.length > 1 && (
                            <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 cursor-pointer transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-black transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

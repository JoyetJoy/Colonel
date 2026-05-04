import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  X,
  SquarePen,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePopup } from "../providers/PopupProvider";
import toast from "react-hot-toast";
import Modal from "./popups/Modal";
import { DataTable } from "./ui/DataTable";
import useApiMaster from "../hooks/useApiMasters";
import { DESIGNATION_DROPDOWN, DESIGNATIONS, EMPLOYEES } from "../api/apis";
import { newFormRequest, newRequest } from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const phoneRegExp = /^[0-9]{10}$/;
const aadharRegExp = /^[0-9]{12}$/;
const ifscRegExp = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const COUNTRY_CODES = [
  { label: '+91', value: '+91' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+971', value: '+971' },
];

const baseFields = {
  nameOfApplicant: yup.string().required("Full Name is required"),
  contactNumber: yup.string().matches(phoneRegExp, "Phone number must be exactly 10 digits").required("Phone number is required"),
  code: yup.string().required("Code required"),
  designationId: yup.string().required("Designation is required"),
  applicationDate: yup.string().required("Date of Joining is required"),
  aadharNumber: yup.string().matches(aadharRegExp, "Aadhaar must be exactly 12 digits").required("Aadhaar is required"),
  presentAddress: yup.string().required("Present Address is required"),
  permanentAddress: yup.string().required("Permanent Address is required"),
  fatherGuardianName: yup.string().required("Father's Name is required"),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  age: yup.string().required("Age is required"),
  educationalQualification: yup.string().required("Qualification is required"),
  casteReligion: yup.string().required("Caste/Religion is required"),
  experience: yup.string().required("Experience is required"),
  identificationMarks: yup.string().required("Identification Marks are required"),
  height: yup.string().required("Height is required"),
  weight: yup.string().required("Weight is required"),
  preferredJobLocations: yup.string().required("Preferred Location is required"),
  bloodGroup: yup.string().required("Blood Group is required"),
  emergencyNumber: yup.string().matches(phoneRegExp, "Emergency number must be exactly 10 digits").required("Emergency number is required"),
  emergencyCode: yup.string().required("Code required"),
  branchName: yup.string().required("Branch Name is required"),
  ifscCode: yup.string().matches(ifscRegExp, "Invalid IFSC Code").required("IFSC Code is required"),
  bankAcctNo: yup.string().matches(/^[0-9]+$/, "Account number must be numeric").required("Account number is required"),
  familyDetails: yup.array().of(
    yup.object({
      name: yup.string().required("Name is required"),
      relation: yup.string().required("Relation is required"),
      dob: yup.string().required("DOB is required"),
      age: yup.string().required("Age is required"),
      phoneNumber: yup.string().matches(phoneRegExp, "Invalid phone number").required("Phone Number is required"),
      code: yup.string().required("Code required"),
    })
  ).min(1, "At least one family member is required")
};

const createSchema = yup.object({
  ...baseFields,
  profileImage: yup.mixed().test("required", "Photo is required", (value) => value && value.length > 0),
  aadharCard: yup.mixed().test("required", "Aadhaar photo is required", (value) => value && value.length > 0),
  panCard: yup.mixed().test("required", "PAN photo is required", (value) => value && value.length > 0),
  pcc: yup.mixed().test("required", "PCC photo is required", (value) => value && value.length > 0),
  bankPassbook: yup.mixed().test("required", "Passbook photo is required", (value) => value && value.length > 0),
}).required();

const editSchema = yup.object({
  ...baseFields,
  profileImage: yup.mixed().nullable(),
  aadharCard: yup.mixed().nullable(),
  panCard: yup.mixed().nullable(),
  pcc: yup.mixed().nullable(),
  bankPassbook: yup.mixed().nullable(),
}).required();

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  absconding: "bg-red-100 text-red-600",
};

export function EmployeeListings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const { showSuccess, showError } = usePopup();

  const { data: employeeList, isLoading, isError } = useQuery({
    queryKey: ["employeeList", currentPage, pageLimit, keyword],
    queryFn: () =>
      newRequest
        .get(EMPLOYEES, {
          params: {
            keyword,
            page: currentPage,
            limit: pageLimit,
          },
        })
        .then((res) => res.data),
  });


  const { data: designationMasterList } = useApiMaster(DESIGNATION_DROPDOWN, "designationMasterList");

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(editingEmployee ? editSchema : createSchema),
    defaultValues: {
      code: "+91",
      emergencyCode: "+91",
      familyDetails: [{ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" }],
    },
  });
  console.log(errors);

  // Watch file inputs for live preview
  const watchedProfileImage = watch("profileImage");
  const watchedAadharCard = watch("aadharCard");
  const watchedPanCard = watch("panCard");
  const watchedPcc = watch("pcc");
  const watchedBankPassbook = watch("bankPassbook");

  const getPreviewUrl = (watchedFile, fallbackUrl) => {
    if (watchedFile && watchedFile.length > 0 && watchedFile[0] instanceof File) {
      return URL.createObjectURL(watchedFile[0]);
    }
    return fallbackUrl || null;
  };

  const profilePreview = useMemo(() => getPreviewUrl(watchedProfileImage, editingEmployee?.profileImage), [watchedProfileImage, editingEmployee]);
  const aadharPreview = useMemo(() => getPreviewUrl(watchedAadharCard, editingEmployee?._docs?.aadharCard), [watchedAadharCard, editingEmployee]);
  const panPreview = useMemo(() => getPreviewUrl(watchedPanCard, editingEmployee?._docs?.panCard), [watchedPanCard, editingEmployee]);
  const pccPreview = useMemo(() => getPreviewUrl(watchedPcc, editingEmployee?._docs?.pcc), [watchedPcc, editingEmployee]);
  const passbookPreview = useMemo(() => getPreviewUrl(watchedBankPassbook, editingEmployee?._docs?.bankPassbook), [watchedBankPassbook, editingEmployee]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyDetails",
  });

  const handleEditClick = async (emp) => {
    // Open modal immediately with loading state
    setEditingEmployee({ id: emp.id, nameOfApplicant: emp.nameOfApplicant });
    setShowForm(true);
    setLoadingEdit(true);

    try {
      const res = await queryClient.fetchQuery({
        queryKey: ["employeeDetail", emp.id],
        queryFn: () => newRequest.get(`${EMPLOYEES}/${emp.id}`).then((r) => r.data),
        staleTime: 5 * 60 * 1000,
      });
      const empData = res?.data;
      if (!empData) {
        showError("Failed to load employee data");
        handleCloseForm();
        return;
      }

      const normalizedEmp = {
        ...empData,
        _docs: empData.EmployeeDocument || {},
        _bank: empData.EmployeeBankDetails || {},
        _family: empData.EmployeeFamilyMember || [],
      };
      setEditingEmployee(normalizedEmp);

      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.split("T")[0];
      };

      reset({
        nameOfApplicant: empData.nameOfApplicant || "",
        contactNumber: empData.contactNumber || "",
        code: empData.code || "+91",
        designationId: empData.designationId?.toString() || empData.designation?.id?.toString() || "",
        applicationDate: formatDate(empData.applicationDate),
        aadharNumber: empData.aadharNumber || "",
        presentAddress: empData.presentAddress || "",
        permanentAddress: empData.permanentAddress || "",
        fatherGuardianName: empData.fatherGuardianName || "",
        dateOfBirth: formatDate(empData.dateOfBirth),
        age: empData.age?.toString() || "",
        educationalQualification: empData.educationalQualification || "",
        casteReligion: empData.casteReligion || "",
        experience: empData.experience || "",
        identificationMarks: empData.identificationMarks || "",
        height: empData.height?.toString() || "",
        weight: empData.weight?.toString() || "",
        preferredJobLocations: empData.preferredJobLocations || "",
        bloodGroup: empData.bloodGroup || "",
        emergencyNumber: empData.emergencyNumber || "",
        emergencyCode: empData.emergencyCode || "+91",
        branchName: empData.EmployeeBankDetails?.branchName || "",
        ifscCode: empData.EmployeeBankDetails?.ifscCode || "",
        bankAcctNo: empData.EmployeeBankDetails?.bankAcctNo || "",
        familyDetails: empData.EmployeeFamilyMember?.length > 0
          ? empData.EmployeeFamilyMember.map(m => ({
            name: m.name || "",
            relation: m.relation || "",
            dob: formatDate(m.dateOfBirth),
            age: m.age?.toString() || "",
            phoneNumber: m.phoneNumber || "",
            code: m.code || "+91",
          }))
          : [{ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" }],
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
      showError("Failed to load employee data");
      handleCloseForm();
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setLoadingEdit(false);
    reset({
      familyDetails: [{ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" }]
    });
  };

  const onSubmit = async (data) => {
    console.log("Payload:", data);

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (
        key === "profileImage" ||
        key === "aadharCard" ||
        key === "panCard" ||
        key === "pcc" ||
        key === "bankPassbook"
      ) {
        if (data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        }
      } else if (
        key === "branchName" ||
        key === "ifscCode" ||
        key === "bankAcctNo"
      ) {
        // Skip these keys inside the loop to group them later
      } else if (key === "familyDetails") {
        formData.append('familyMembers', JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    if (data?.branchName || data?.ifscCode || data?.bankAcctNo) {
      formData.append(
        "bankDetails",
        JSON.stringify({
          branchName: data?.branchName,
          ifscCode: data?.ifscCode,
          bankAcctNo: data?.bankAcctNo,
        })
      );
    }

    try {
      setLoader(true);
      const isEdit = !!editingEmployee;
      const url = isEdit ? `${EMPLOYEES}/${editingEmployee.id}` : EMPLOYEES;
      const method = isEdit ? "patch" : "post";

      const res = await newFormRequest[method](url, formData);
      if (res?.data?.status) {
        const msg = isEdit ? "Employee updated successfully!" : "Employee registered successfully!";
        if (isEdit) {
          toast.success(msg);
        } else {
          showSuccess(msg);
        }
        queryClient.invalidateQueries(["employeeList"]);
        handleCloseForm();
      } else {
        toast.error(res?.data?.message || (isEdit ? "Update failed" : "Registration failed"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const columns = useMemo(() => [
    {
      header: "Employee",
      accessor: (emp) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center overflow-hidden justify-center text-xs text-white">
            <img src={emp.profileImage} alt="" className="rounded-full object-cover" />
          </div>
          <span className="text-sm text-foreground whitespace-nowrap">
            {emp.nameOfApplicant}
          </span>
        </div>
      ),
    },
    { header: "Emp ID", accessor: "employeeCode", className: "text-muted-foreground" },
    { header: "Phone", accessor: (emp) => `${emp.code || ''} ${emp.contactNumber}`, className: "text-muted-foreground" },
    {
      header: "Designation", accessor: (emp) => (
        <div className="flex items-center gap-3">
          {emp.designation?.name}
        </div>)
    },
    // {
    //   header: "Allocated To", accessor: (emp) => (
    //     <div className="flex items-center gap-3">
    //       {emp.branch?.name}
    //     </div>), className: "text-muted-foreground whitespace-nowrap"
    // },
    // {
    //   header: "Status",
    //   accessor: (emp) => (
    //     <span
    //       className={`text-[11px] px-2 py-1 rounded-full capitalize ${statusColors[emp.status]}`}
    //     >
    //       {emp.status}
    //     </span>
    //   ),
    // },
    {
      header: "Action",
      accessor: (emp) => (
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate(`view/${emp.id}`)}
            className="flex size-7 cursor-pointer items-center rounded-full bg-[#dee8ff] p-2"
          >
            <Eye className="size-3" color="#487fff" />
          </button>
          <button
            type="button"
            onClick={() => handleEditClick(emp)}
            className="flex size-7 cursor-pointer items-center rounded-full bg-[#ddf1e4] p-2"
          >
            <SquarePen className="size-3" color="#45b369" />
          </button>

        </div>
      ),
    },
  ], [activeMenu]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Employee Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register and manage security guards with PF/ESI details
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-foreground transition-colors">
            <Download className="w-4 h-4" /> Export
          </button> */}
          <button
            onClick={() => {
              setEditingEmployee(null);
              reset({ familyDetails: [{ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" }] });
              setShowForm(true);
            }}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingEmployee ? "Edit Employee" : "New Employee Registration"}
        onSubmit={handleSubmit(onSubmit)}
        maxWidth="max-w-5xl h-[98%]"
      >
        <div className="space-y-8 text-gray-800 relative">
          {/* Loading overlay for edit mode */}
          {loadingEdit && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading employee data...</p>
              </div>
            </div>
          )}
          {/* Section: Personal Information */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-black rounded-full" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-1">
                <label className="text-xs text-muted-foreground mb-1.5 block">Photo {editingEmployee ? '(optional)' : '*'}</label>
                {profilePreview && (
                  <div className="mb-2 w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input type="file" {...register("profileImage")} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Full Name *</label>
                <input type="text" {...register("nameOfApplicant")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="Enter full name" />
                {errors.nameOfApplicant && <p className="text-red-500 text-xs mt-1">{errors.nameOfApplicant.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Phone Number *</label>
                <div className="flex gap-2">
                  <select {...register("code")} className="w-16 h-9 px-1 bg-secondary rounded-lg text-[10px] text-foreground border border-border focus:border-gray-400 outline-none">
                    {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <input type="tel" {...register("contactNumber")} className="w-40 h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="10-digit number" />
                </div>
                {(errors.contactNumber || errors.code) && <p className="text-red-500 text-xs mt-1">{errors.contactNumber?.message || errors.code?.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Father's Name *</label>
                <input type="text" {...register("fatherGuardianName")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="Enter father's name" />
                {errors.fatherGuardianName && <p className="text-red-500 text-xs mt-1">{errors.fatherGuardianName.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Date of Birth *</label>
                <input type="date" {...register("dateOfBirth")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Age *</label>
                <input type="text" {...register("age")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="Enter your age" />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Caste/Religion *</label>
                <input type="text" {...register("casteReligion")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. Hindu" />
                {errors.casteReligion && <p className="text-red-500 text-xs mt-1">{errors.casteReligion.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Blood Group *</label>
                <select {...register("bloodGroup")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none appearance-none">
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
              </div>
            </div>
          </div>

          {/* Section: Address Details */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-black rounded-full" />
              Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Present Address *</label>
                <textarea {...register("presentAddress")} rows={2} className="w-full p-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none resize-none" placeholder="Current residential address" />
                {errors.presentAddress && <p className="text-red-500 text-xs mt-1">{errors.presentAddress.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Permanent Address *</label>
                <textarea {...register("permanentAddress")} rows={2} className="w-full p-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none resize-none" placeholder="Permanent home address" />
                {errors.permanentAddress && <p className="text-red-500 text-xs mt-1">{errors.permanentAddress.message}</p>}
              </div>
            </div>
          </div>

          {/* Section: Professional & Physical */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-black rounded-full" />
              Professional & Physical Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Designation *</label>
                <select {...register("designationId")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none appearance-none">
                  <option value="">Select Designation</option>
                  {designationMasterList?.data?.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                {errors.designationId && <p className="text-red-500 text-xs mt-1">{errors.designationId.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Date of Joining *</label>
                <input type="date" {...register("applicationDate")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" />
                {errors.applicationDate && <p className="text-red-500 text-xs mt-1">{errors.applicationDate.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Qualification *</label>
                <input type="text" {...register("educationalQualification")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. Graduate" />
                {errors.educationalQualification && <p className="text-red-500 text-xs mt-1">{errors.educationalQualification.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Experience *</label>
                <input type="text" {...register("experience")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. 2 years" />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Aadhaar Number *</label>
                <input type="text" {...register("aadharNumber")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="12-digit number" />
                {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">{errors.aadharNumber.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Height (cm) *</label>
                <input type="text" {...register("height")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. 175" />
                {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Weight (kg) *</label>
                <input type="text" {...register("weight")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. 70" />
                {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Preferred Location *</label>
                <input type="text" {...register("preferredJobLocations")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. Mumbai" />
                {errors.preferredJobLocations && <p className="text-red-500 text-xs mt-1">{errors.preferredJobLocations.message}</p>}
              </div>
              <div className="lg:col-span-2">
                <label className="text-xs text-muted-foreground mb-1.5 block">Identification Marks *</label>
                <input type="text" {...register("identificationMarks")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. Scar on left hand" />
                {errors.identificationMarks && <p className="text-red-500 text-xs mt-1">{errors.identificationMarks.message}</p>}
              </div>
            </div>
          </div>

          {/* Section: Document Uploads */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-black rounded-full" />
              Document Uploads {editingEmployee && <span className="text-xs font-normal text-gray-400">(leave empty to keep current)</span>}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Aadhaar Photo {editingEmployee ? '' : '*'}</label>
                {aadharPreview && (
                  <div className="mb-2 w-full h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={aadharPreview} alt="Aadhaar" className="w-full h-full object-contain" />
                  </div>
                )}
                <input type="file" {...register("aadharCard")} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                {errors.aadharCard && <p className="text-red-500 text-xs mt-1">{errors.aadharCard.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">PAN Photo {editingEmployee ? '' : '*'}</label>
                {panPreview && (
                  <div className="mb-2 w-full h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={panPreview} alt="PAN" className="w-full h-full object-contain" />
                  </div>
                )}
                <input type="file" {...register("panCard")} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">PCC Photo {editingEmployee ? '' : '*'}</label>
                {pccPreview && (
                  <div className="mb-2 w-full h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={pccPreview} alt="PCC" className="w-full h-full object-contain" />
                  </div>
                )}
                <input type="file" {...register("pcc")} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                {errors.pcc && <p className="text-red-500 text-xs mt-1">{errors.pcc.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Passbook Photo {editingEmployee ? '' : '*'}</label>
                {passbookPreview && (
                  <div className="mb-2 w-full h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={passbookPreview} alt="Passbook" className="w-full h-full object-contain" />
                  </div>
                )}
                <input type="file" {...register("bankPassbook")} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                {errors.bankPassbook && <p className="text-red-500 text-xs mt-1">{errors.bankPassbook.message}</p>}
              </div>
            </div>
          </div>

          {/* Section: Bank & Statutory */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-black rounded-full" />
              Bank & Statutory Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Branch Name *</label>
                <input type="text" {...register("branchName")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. HDFC Bank" />
                {errors.branchName && <p className="text-red-500 text-xs mt-1">{errors.branchName.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">IFSC Code *</label>
                <input type="text" {...register("ifscCode")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="e.g. HDFC0001234" />
                {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Account Number *</label>
                <input type="text" {...register("bankAcctNo")} className="w-full h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="Numeric account number" />
                {errors.bankAcctNo && <p className="text-red-500 text-xs mt-1">{errors.bankAcctNo.message}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Emergency Contact *</label>
                <div className="flex gap-2">
                  <select {...register("emergencyCode")} className="w-16 h-9 px-1 bg-secondary rounded-lg text-[10px] text-foreground border border-border focus:border-gray-400 outline-none">
                    {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <input type="tel" {...register("emergencyNumber")} className="w-40 h-9 px-3 bg-secondary rounded-lg text-sm text-foreground border border-border focus:border-gray-400 outline-none" placeholder="10-digit number" />
                </div>
                {(errors.emergencyNumber || errors.emergencyCode) && <p className="text-red-500 text-xs mt-1">{errors.emergencyNumber?.message || errors.emergencyCode?.message}</p>}
              </div>
            </div>
          </div>

          {/* Section: Family Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="w-1 h-4 bg-black rounded-full" />
                Family Details
              </h3>
              <button
                type="button"
                onClick={() => append({ name: "", relation: "", dob: "", age: "", phoneNumber: "", code: "+91" })}
                className="text-xs flex items-center gap-1 text-black font-medium hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Member
              </button>
            </div>
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-muted-foreground text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium">SL</th>
                    <th className="px-4 py-3 font-medium">Name *</th>
                    <th className="px-4 py-3 font-medium">Relation *</th>
                    <th className="px-4 py-3 font-medium">DOB *</th>
                    <th className="px-4 py-3 font-medium">Age *</th>
                    <th className="px-4 py-3 font-medium">PHONE Number *</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{index + 1}</td>
                      <td className="px-2 py-2">
                        <input type="text" {...register(`familyDetails.${index}.name`)} className={`w-full h-8 px-2 bg-transparent rounded border ${errors.familyDetails?.[index]?.name ? 'border-red-500' : 'border-transparent focus:border-border'} outline-none text-sm`} placeholder="Name" />
                        {errors.familyDetails?.[index]?.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.familyDetails[index].name.message}</p>}
                      </td>
                      <td className="px-2 py-2">
                        <input type="text" {...register(`familyDetails.${index}.relation`)} className={`w-full h-8 px-2 bg-transparent rounded border ${errors.familyDetails?.[index]?.relation ? 'border-red-500' : 'border-transparent focus:border-border'} outline-none text-sm`} placeholder="Relation" />
                        {errors.familyDetails?.[index]?.relation && <p className="text-[10px] text-red-500 mt-0.5">{errors.familyDetails[index].relation.message}</p>}
                      </td>
                      <td className="px-2 py-2">
                        <input type="date" {...register(`familyDetails.${index}.dob`)} className={`w-full h-8 px-2 bg-transparent rounded border ${errors.familyDetails?.[index]?.dob ? 'border-red-500' : 'border-transparent focus:border-border'} outline-none text-sm`} />
                        {errors.familyDetails?.[index]?.dob && <p className="text-[10px] text-red-500 mt-0.5">{errors.familyDetails[index].dob.message}</p>}
                      </td>
                      <td className="px-2 py-2">
                        <input type="text" {...register(`familyDetails.${index}.age`)} className={`w-full h-8 px-2 bg-transparent rounded border ${errors.familyDetails?.[index]?.age ? 'border-red-500' : 'border-transparent focus:border-border'} outline-none text-sm`} placeholder="Age" />
                        {errors.familyDetails?.[index]?.age && <p className="text-[10px] text-red-500 mt-0.5">{errors.familyDetails[index].age.message}</p>}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-1">
                          <select {...register(`familyDetails.${index}.code`)} className="w-12 h-8 px-0.5 bg-secondary rounded border border-border outline-none text-[10px]">
                            {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                          <input type="tel" {...register(`familyDetails.${index}.phoneNumber`)} className={`flex-1 h-8 px-2 bg-transparent rounded border ${errors.familyDetails?.[index]?.phoneNumber ? 'border-red-500' : 'border-transparent focus:border-border'} outline-none text-sm`} placeholder="Number" />
                        </div>
                        {(errors.familyDetails?.[index]?.phoneNumber || errors.familyDetails?.[index]?.code) && <p className="text-[10px] text-red-500 mt-0.5">{errors.familyDetails[index].phoneNumber?.message || errors.familyDetails[index].code?.message}</p>}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {fields.length > 1 && (
                          <button type="button" onClick={() => remove(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>



        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            disabled={loader}
            onClick={handleCloseForm}
            className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loader}
            className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors shadow-sm"
          >
            {loader ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : editingEmployee ? 'Update Employee' : 'Register Employee'}
          </button>
        </div>
      </Modal>

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

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm font-medium">Loading employees...</p>
          </div>
        ) : isError ? (
          <div className="p-8">
            <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-600 font-medium text-sm">Failed to load employees.</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={employeeList?.data || []}
            pagination={true}
            currentPage={currentPage}
            totalPages={employeeList?.pagination?.totalPage || 1}
            totalItems={employeeList?.pagination?.totalData || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}

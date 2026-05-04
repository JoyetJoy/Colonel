import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { newRequest } from "../api";
import { CLIENTS, DESIGNATION_DROPDOWN } from "../api/apis";
import { CLIENT_REQUIREMENTS } from "../api/apis";
import useApiMaster from "../hooks/useApiMasters";
import { usePopup } from "../providers/PopupProvider";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Building2,
  FileText,
  AlertCircle,
  Plus,
  X,
  Edit,
  Trash2,
  ClipboardList,
  User,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import ErrorPopup from "./popups/ErrorPopup";
import DeleteConfirmationPopup from "./popups/DeleteConfirmationPopup";

/* ─── Small reusable pieces ────────────────────────────────────────────── */

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

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */

export function ClientViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* modal state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requirements, setRequirements] = useState([
    { designationId: "", count: "", salary: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [reqToDelete, setReqToDelete] = useState(null);
  const [editingReq, setEditingReq] = useState(null);
  const { showSuccess, showError: showGlobalError } = usePopup();

  /* ── data queries ── */
  const { data: clientData, isLoading, isError } = useQuery({
    queryKey: ["clientView", id],
    queryFn: () => newRequest.get(`${CLIENTS}/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: requirementsList } = useQuery({
    queryKey: ["clientRequirements", id],
    queryFn: () =>
      newRequest
        .get(CLIENT_REQUIREMENTS, { params: { clientId: id } })
        .then((r) => r.data),
    enabled: !!id,
  });

  const { data: designationDropdown } = useApiMaster(
    DESIGNATION_DROPDOWN,
    "designationDropdown"
  );

  const client = clientData?.data;
  const reqList = requirementsList?.data || [];
  const designations = designationDropdown?.data || [];

  /* ── requirement row helpers ── */
  const addRow = () =>
    setRequirements((prev) => [
      ...prev,
      { designationId: "", count: "", salary: "" },
    ]);

  const removeRow = (idx) =>
    setRequirements((prev) => prev.filter((_, i) => i !== idx));

  const updateRow = (idx, field, value) =>
    setRequirements((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  /* ── submit requirements ── */
  const handleSaveRequirements = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const api = editingReq ? `${CLIENT_REQUIREMENTS}/${editingReq.id}` : CLIENT_REQUIREMENTS;
      const method = editingReq ? 'patch' : 'post';
      
      const payload = editingReq ? {
        clientId: String(id),
        designationId: Number(requirements[0].designationId),
        count: Number(requirements[0].count),
        salary: Number(requirements[0].salary),
      } : {
        clientId: String(id),
        requirements: requirements.map((r) => ({
          designationId: Number(r.designationId),
          count: Number(r.count),
          salary: Number(r.salary),
        })),
      };

      const res = await newRequest[method](api, payload);
      if (res?.data?.status) {
        const msg = res?.data?.message || "Requirements saved.";
        if (editingReq) {
          toast.success(msg);
        } else {
          showSuccess(msg);
        }
        queryClient.invalidateQueries(["clientRequirements", id]);
        setIsModalOpen(false);
        setRequirements([{ designationId: "", count: "", salary: "" }]);
        setEditingReq(null);
      } else {
        toast.error(res?.data?.message || "Failed to save.");
      }
    } catch (error) {
      setErrormsg(error?.response?.data?.error || "Something went wrong.");
      setErrorPopup(true);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (req) => {
    setEditingReq(req);
    setRequirements([
      {
        designationId: String(req.designationId),
        count: String(req.count),
        salary: String(req.salary),
      },
    ]);
    setIsModalOpen(true);
  };

  /* ── designation label helper ── */
  const getDesignationLabel = (designationId) =>
    designations.find((d) => d.value === Number(designationId))?.label ||
    `ID: ${designationId}`;

  /* ── loading / error states ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading client details…</p>
        </div>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-600">Failed to load client details.</p>
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

  /* ── render ── */
  return (
    <div className="space-y-6 pb-8">
      <ErrorPopup
        popupOpen={errorPopup}
        setPopupOpen={setErrorPopup}
        setError={setErrormsg}
        error={errormsg}
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Client Profile</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            View complete client information &amp; requirements
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="px-6 pb-6 -mt-5 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-bold">
                {client.name?.charAt(0)?.toUpperCase() || "C"}
              </span>
            </div>

            {/* Name & Meta */}
            <div className="flex-1 sm:pb-1">
              <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                {client.contactPerson && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {client.contactPerson}
                  </span>
                )}
                {client.contactNumber && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {client.code} {client.contactNumber}
                  </span>
                )}
                {client.area?.name && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {client.area.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Phone} title="Contact Details" />
          <div className="divide-y divide-gray-50">
            <InfoItem icon={User} label="Contact Person" value={client.contactPerson} />
            <InfoItem icon={Phone} label="Phone" value={`${client.code || ""} ${client.contactNumber || ""}`} />
            <InfoItem
              icon={Phone}
              label="Alternate Number"
              value={`${client.alternateCode || ""} ${client.alternateNumber || ""}`}
              iconColor="text-blue-400"
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={Building2} title="Business Details" />
          <div className="divide-y divide-gray-50">
            <InfoItem
              icon={CreditCard}
              label="GST Number"
              value={client.gstNumber}
            />
            <InfoItem
              icon={MapPin}
              label="Area"
              value={client.area?.name}
              iconColor="text-green-400"
            />
            <InfoItem
              icon={FileText}
              label="Address"
              value={client.address}
            />
          </div>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionHeader icon={ClipboardList} title="Client Requirements" />
          <button
            onClick={() => {
              setEditingReq(null);
              setRequirements([{ designationId: "", count: "", salary: "" }]);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Requirements
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Count</th>
                <th className="px-4 py-3">Salary (₹)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reqList.length > 0 ? (
                reqList.map((req, index) => (
                  <tr
                    key={req.id || index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {req.designation?.name ||
                        getDesignationLabel(req.designationId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{req.count}</td>
                    <td className="px-4 py-3 text-gray-600">
                      ₹{Number(req.salary).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(req)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReqToDelete(req.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-gray-400 text-sm"
                  >
                    No requirements added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Requirements Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg text-black w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingReq ? "Edit" : "Add"} Client Requirements
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRequirements([{ designationId: "", count: "", salary: "" }]);
                  setEditingReq(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRequirements} className="p-5 flex flex-col gap-4">

              {/* Requirement Rows */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    <tr>
                      <th className="px-3 py-2.5 text-left">Designation <span className="text-red-500">*</span></th>
                      <th className="px-3 py-2.5 text-left">Count <span className="text-red-500">*</span></th>
                      <th className="px-3 py-2.5 text-left">Salary (₹) <span className="text-red-500">*</span></th>
                      <th className="px-3 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {requirements.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">
                          <select
                            required
                            value={row.designationId}
                            onChange={(e) =>
                              updateRow(idx, "designationId", e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                          >
                            <option value="">Select Designation</option>
                            {designations.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            required
                            min={1}
                            placeholder="e.g. 2"
                            value={row.count}
                            onChange={(e) =>
                              updateRow(idx, "count", e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="e.g. 1000"
                            value={row.salary}
                            onChange={(e) =>
                              updateRow(idx, "salary", e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {requirements.length > 1 && !editingReq && (
                            <button
                              type="button"
                              onClick={() => removeRow(idx)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Row */}
              {!editingReq && (
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors self-start"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Row
                </button>
              )}

              {/* Footer Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setRequirements([{ designationId: "", count: "", salary: "" }]);
                    setEditingReq(null);
                  }}
                  className="px-4 py-2 w-full text-sm font-medium text-gray-700 bg-white border cursor-pointer border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 w-full text-sm font-medium text-white bg-black rounded-sm cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors shadow-sm disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Requirements"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Requirement Confirmation */}
      <DeleteConfirmationPopup
        isOpen={!!reqToDelete}
        onClose={() => setReqToDelete(null)}
        api={CLIENT_REQUIREMENTS}
        itemId={reqToDelete}
        queryKey={["clientRequirements", id]}
        title="Delete Requirement"
        message="Are you sure you want to delete this requirement? This action cannot be undone."
      />
    </div>
  );
}

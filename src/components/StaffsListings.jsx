import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { newRequest } from '../api';
import useApiMaster from '../hooks/useApiMasters';
import { STAFFS, DESIGNATION_DROPDOWN } from '../api/apis';
import ErrorPopup from './popups/ErrorPopup';
import DeleteConfirmationPopup from './popups/DeleteConfirmationPopup';
import Modal from './popups/Modal';
import { DataTable } from "./ui/DataTable";
import { usePopup } from '../providers/PopupProvider';
import toast from 'react-hot-toast';
import { Search, Filter, Eye, Edit, Trash2, Plus } from 'lucide-react';

const COUNTRY_CODES = [
  { label: '+91', value: '+91' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+971', value: '+971' },
];

export function StaffsListings() {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phoneNumber: '', code: '+91', designationId: '', dateOfJoin: '', aadharNumber: '',
    address: '', emergencyNumber: '', emergencyCode: '+91', bankName: '', ifscCode: '', accountNumber: ''
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccess } = usePopup();

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staffList", currentPage, pageLimit, keyword],
    queryFn: () =>
      newRequest
        .get(STAFFS, {
          params: { keyword, page: currentPage, limit: pageLimit },
        })
        .then((res) => res.data),
  });

  const { data: designationDropdown } = useApiMaster(DESIGNATION_DROPDOWN, "designationDropdown");

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name || '',
        phoneNumber: item.phoneNumber || '',
        designationId: item.designationId || '',
        dateOfJoin: item.dateOfJoin ? item.dateOfJoin.split('T')[0] : '',
        aadharNumber: item.aadharNumber || '',
        address: item.address || '',
        emergencyNumber: item.emergencyNumber || '',
        bankName: item.bankName || '',
        ifscCode: item.ifscCode || '',
        accountNumber: item.accountNumber || ''
      });
    } else {
      setFormData({
        name: '', phoneNumber: '', code: '+91', designationId: '', dateOfJoin: '', aadharNumber: '',
        address: '', emergencyNumber: '', emergencyCode: '+91', bankName: '', ifscCode: '', accountNumber: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const payload = {
        ...formData,
        designationId: Number(formData.designationId),
      };
      const api = editingItem ? `${STAFFS}/${editingItem.id}` : STAFFS;
      const method = editingItem ? 'patch' : 'post';
      const res = await newRequest[method](api, payload);
      if (res?.data?.status) {
        if (editingItem) {
          toast.success(res?.data?.message || "Staff updated successfully");
        } else {
          showSuccess(res?.data?.message || "Staff created successfully");
        }
        queryClient.invalidateQueries(["staffList"]);
        handleCloseModal();
      }
    } catch (error) {
      console.log(error);
      setErrormsg(error?.response?.data?.error || "Something went wrong");
      setErrorPopup(true);
    } finally {
      setLoader(false);
    }
  };

  const columns = useMemo(() => [
    { header: 'Name', accessor: 'name', className: "font-medium text-gray-900" },
    { header: 'Phone', accessor: (staff) => `${staff.code || ''} ${staff.phoneNumber}`, className: "text-gray-500" },
    {
      header: 'Designation',
      accessor: (staff) => {
        const desig = designationDropdown?.data?.find(d => d.value === Number(staff.designationId));
        return desig ? desig.label : '—';
      },
      className: "text-gray-500"
    },
    {
      header: 'Joined',
      accessor: (staff) => staff.dateOfJoin ? new Date(staff.dateOfJoin).toLocaleDateString('en-GB') : '—',
      className: "text-gray-500"
    },
    {
      header: 'Action',
      accessor: (staff) => (
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/staffs/view/${staff.id}`)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#dee8ff] hover:bg-blue-200 transition-colors"
            title="View Details"
          >
            <Eye className="size-3" color="#487fff" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal(staff)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#ddf1e4] hover:bg-green-200 transition-colors"
            title="Edit"
          >
            <Edit className="size-3" color="#45b369" />
          </button>
          <button
            type="button"
            onClick={() => setItemToDelete(staff.id)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#ffe2e2] hover:bg-red-200 transition-colors"
            title="Delete"
          >
            <Trash2 className="size-3" color="#e63946" />
          </button>
        </div>
      ),
    },
  ], [designationDropdown, navigate]);

  return (
    <div className="space-y-6">
      <ErrorPopup popupOpen={errorPopup} setPopupOpen={setErrorPopup} setError={setErrormsg} error={errormsg} />

      <DeleteConfirmationPopup
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        api={STAFFS}
        itemId={itemToDelete}
        queryKey="staffList"
        title="Delete Staff"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Staffs Master</h1>
          <p className="text-sm text-gray-500 mt-1">Manage staff records and details</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

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
            <p className="text-gray-500 text-sm font-medium">Loading staffs...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={staffList?.data || []}
            pagination={true}
            currentPage={currentPage}
            totalPages={staffList?.pagination?.totalPage || 1}
            totalItems={staffList?.pagination?.totalData || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Staff" : "Add Staff"}
        onSubmit={handleSave}
        maxWidth="max-w-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <input required name="name" value={formData.name} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Enter staff name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone Number *</label>
            <div className="flex gap-2">
              <select
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-16 px-1 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white"
              >
                {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Phone number" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Designation *</label>
            <select required name="designationId" value={formData.designationId} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white">
              <option value="">Select Designation</option>
              {designationDropdown?.data?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Date of Joining *</label>
            <input required type="date" name="dateOfJoin" value={formData.dateOfJoin} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Aadhaar Number *</label>
            <input required name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Aadhaar number" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Emergency Number *</label>
            <div className="flex gap-2">
              <select
                name="emergencyCode"
                value={formData.emergencyCode}
                onChange={handleInputChange}
                className="w-16 px-1 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white"
              >
                {COUNTRY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <input required name="emergencyNumber" value={formData.emergencyNumber} onChange={handleInputChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Emergency contact" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address *</label>
            <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={2} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none" placeholder="Full address" />
          </div>

          <div className="sm:col-span-2 mt-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bank Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Bank Name *</label>
                <input required name="bankName" value={formData.bankName} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="e.g. HDFC Bank" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">IFSC Code *</label>
                <input required name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="e.g. HDFC0001234" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Account Number *</label>
                <input required name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Account No." />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button type="button" onClick={handleCloseModal} className="px-4  cursor-pointer py-2 w-full text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loader} className="px-4 py-2 w-full cursor-pointer text-sm font-medium text-white bg-black rounded-sm hover:bg-gray-800 focus:outline-none transition-colors shadow-sm disabled:bg-gray-400 flex items-center justify-center">
            {loader ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

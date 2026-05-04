import React, { useState } from "react";
import { newRequest } from "../../api";
import { useQueryClient } from "@tanstack/react-query";
import { usePopup } from "../../providers/PopupProvider";
import toast from "react-hot-toast";

export default function DeleteConfirmationPopup({
  isOpen,
  onClose,
  api,
  itemId,
  queryKey,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
  const [loader, setLoader] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = usePopup();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!api || !itemId) return;
    try {
      setLoader(true);
      const res = await newRequest.delete(`${api}/${itemId}`);
      if (res?.data?.status) {
        setLoader(false);
        toast.success(res?.data?.message || "Deleted successfully");
        if (queryKey) queryClient.invalidateQueries([queryKey]);
        onClose();
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 pointer-events-auto transition ease-in-out py-10">
      <div
        className="relative w-[23rem] bg-white rounded-lg shadow-lg px-7 pt-8 mx-4 sm:mx-0 pb-5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 items-center justify-center p-2">
          <div className="h-16 w-16 flex items-center justify-center">
            <img
              src="/bin.png"
              alt="warning"
              className="object-contain h-full w-full"
            />
          </div>
          <h5 className="text-[#3A3A3A] text-lg tracking-[0.2px] font-semibold text-center">
            {title}
          </h5>
          <p className="text-[#6B7280] text-sm text-center">
            {message}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            disabled={loader}
            onClick={onClose}
            className="flex-1 h-10 rounded-sm border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loader}
            onClick={handleConfirm}
            className="flex-1 h-10 rounded-sm bg-black/90 text-white text-sm font-medium cursor-pointer hover:bg-black transition shadow-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loader ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

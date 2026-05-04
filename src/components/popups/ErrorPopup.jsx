import React from "react";

export default function ErrorPopup({
  popupOpen,
  setPopupOpen,
  error,
  setError,
}) {
  if (!popupOpen) return null;

  const confirmDismiss = () => {
    setPopupOpen(false);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 pointer-events-auto transition ease-in-out overflow-y-scroll py-10">
      <div
        className="relative w-[23rem] bg-white rounded-lg shadow-lg px-7 pt-8 mx-4 sm:mx-0 pb-5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICON */}
        <div className="flex flex-col gap-4 items-center justify-center p-2">
          <div className="h-16 w-16 flex items-center justify-center">
            <img
              src="/error.png"
              alt="error"
              className="object-contain h-full w-full"
            />
          </div>

          {/* MESSAGE */}
          <h5 className="text-[#3A3A3A] text-base tracking-[0.2px] font-semibold text-center">
            {error}
          </h5>
        </div>

        {/* ACTION */}
        <button
          type="button"
          onClick={confirmDismiss}
          className="mt-5 w-full h-10 rounded bg-black text-white text-sm font-medium cursor-pointer pointer-events-auto transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

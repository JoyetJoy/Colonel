import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPopup({
  popupOpen,
  setPopupOpen,
  message,
  onConfirm,
}) {
  if (!popupOpen) return null;

  const confirmDismiss = () => {
    setPopupOpen(false);
    if (onConfirm) onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto transition ease-in-out py-10">
      <div
        className="relative w-[23rem] bg-white rounded-xl shadow-2xl px-7 pt-8 mx-4 sm:mx-0 pb-6 pointer-events-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 items-center justify-center p-2 text-black">
          <div className="h-16 w-16 flex items-center justify-center bg-emerald-50 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <div className="text-center">
            <h3 className="text-gray-900 text-lg font-bold">Success!</h3>
            <p className="text-gray-500 text-sm mt-1 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={confirmDismiss}
          className="mt-6 w-full h-11 rounded-lg bg-black text-white text-sm font-semibold cursor-pointer pointer-events-auto hover:bg-gray-800 transition shadow-lg active:scale-[0.98]"
        >
          Great, thanks!
        </button>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState } from "react";
import SuccessPopup from "../components/popups/SuccessPopup";
import ErrorPopup from "../components/popups/ErrorPopup";

const PopupContext = createContext(null);

export function PopupProvider({ children }) {
  const [success, setSuccess] = useState({ open: false, message: "" });
  const [error, setError] = useState({ open: false, message: "" });

  const showSuccess = (message) => {
    setSuccess({ open: true, message });
  };

  const showError = (message) => {
    setError({ open: true, message });
  };

  return (
    <PopupContext.Provider value={{ showSuccess, showError }}>
      {children}
      <SuccessPopup
        popupOpen={success.open}
        setPopupOpen={(val) => setSuccess((prev) => ({ ...prev, open: val }))}
        message={success.message}
      />
      <ErrorPopup
        popupOpen={error.open}
        setPopupOpen={(val) => setError((prev) => ({ ...prev, open: val }))}
        error={error.message}
        setError={(val) => setError((prev) => ({ ...prev, message: val }))}
      />
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}

import axios from "axios";

// Axios instances
const baseConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
};

export const basicRequest = axios.create(baseConfig);

export const basicXFormRequest = axios.create({
  ...baseConfig,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// x-www-form-urlencoded requests
export const XFormRequest = axios.create({
  ...baseConfig,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// JSON requests
export const newRequest = axios.create({
  ...baseConfig,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// File download (Excel, blob)
export const fileRequest = axios.create({
  ...baseConfig,
  headers: {
    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  responseType: "blob",
  withCredentials: true,
});

// Multipart/form-data requests
export const newFormRequest = axios.create({
  ...baseConfig,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// ---------------- Auth Interceptor ----------------
const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    // Always get the latest token from localStorage
    const token = localStorage.getItem("coloneltoken");

    const finalToken = token;

    if (finalToken) {
      config.headers["Authorization"] = `Bearer ${finalToken}`;
    }

    return config;
  });
};

// Add interceptor to all instances that need auth
addAuthInterceptor(newRequest);
addAuthInterceptor(newFormRequest);
addAuthInterceptor(XFormRequest);
addAuthInterceptor(basicXFormRequest);
addAuthInterceptor(fileRequest);
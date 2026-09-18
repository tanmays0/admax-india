import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    const isAuthRoute =
      window.location.pathname.includes("/login") || window.location.pathname.includes("/register");

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!isAuthRoute) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (error.response?.status !== 404 && !isAuthRoute) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;

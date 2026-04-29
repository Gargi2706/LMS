import axios from "axios";

// In development, Vite proxy will forward `/api` to the backend server.
// In production, set VITE_API_URL to your deployed backend URL on Vercel/other host.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Avoid forcing a page reload if the user is already on an auth page trying to authenticate
      const isAuthRequest = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
      if (!isAuthRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

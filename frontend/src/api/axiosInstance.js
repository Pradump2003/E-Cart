import axios from "axios";
import { deleteAllCookies } from "../utilities/cookies";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
// Response Interceptor (like middleware after response comes)
AxiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ Unauthorized! Redirecting to login...");
      deleteAllCookies();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

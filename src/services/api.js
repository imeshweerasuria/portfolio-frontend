import axios from "axios";

// ✅ Accept either:
// VITE_API_BASE_URL=http://localhost:8080
// OR
// VITE_API_BASE_URL=http://localhost:8080/api
// and normalize it to always end with /api
function normalizeBaseUrl(raw) {
  const base = (raw || "http://localhost:8080").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 15000,
});

// ✅ Better error messages (so you see REAL reason instead of “Network Error”)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response) {
      const { status, data } = err.response;
      const backendMsg =
        (typeof data === "string" && data) ||
        data?.message ||
        data?.error ||
        "";
      err.message = backendMsg
        ? `HTTP ${status}: ${backendMsg}`
        : `HTTP ${status}: Request failed`;
    } else if (err?.request) {
      err.message =
        "Network Error: Backend not reachable (check backend is running + CORS + URL)";
    }
    return Promise.reject(err);
  }
);

export const fetchSkills = () => api.get("/skills");
export const fetchProjects = () => api.get("/projects");
export const fetchCertifications = () => api.get("/certifications");
// export const fetchAwards = () => api.get("/awards"); // ❌ remove unless you actually create AwardController

export default api;

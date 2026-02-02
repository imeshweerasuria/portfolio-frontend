import axios from "axios";

function normalizeBaseUrl(raw) {
  const base = (raw || "http://localhost:8080").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 15000,
});

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
        "Network Error: Backend not reachable (fallback mode will be used)";
    }
    return Promise.reject(err);
  }
);

// ✅ exports used in pages
export const fetchSkills = () => api.get("/skills");
export const fetchProjects = () => api.get("/projects");
export const fetchCertifications = () => api.get("/certifications");
export const fetchAwards = () => api.get("/awards"); // ✅ add back

export default api;

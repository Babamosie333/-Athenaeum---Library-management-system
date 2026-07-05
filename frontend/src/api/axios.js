import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Call this once from a component that has access to Clerk's getToken (see useApi hook below)
export const attachAuthInterceptor = (getToken) => {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default api;

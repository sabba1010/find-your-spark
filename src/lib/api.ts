const isProd = import.meta.env.PROD;

// In dev, we use the Vite proxy (/api)
// In prod, we point directly to the backend URL
export const API = isProd ? "http://206.162.244.12:5000/api" : "/api";

export default API;

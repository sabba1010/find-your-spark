const isProd = import.meta.env.PROD;

// In dev, we use the Vite proxy (/api)
// In prod, we point directly to the backend URL
export const API = isProd ? "https://amour-et-sincerite.com/api/api" : "/api";

export default API;

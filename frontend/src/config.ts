// Frontend configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000", 10),
  googleAiKey: import.meta.env.VITE_GOOGLE_AI_KEY,
  environment: import.meta.env.VITE_ENVIRONMENT || "development",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;

// API Constants
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const API_TIMEOUT = parseInt(
  import.meta.env.VITE_API_TIMEOUT || "30000",
  10,
);

// Feature Flags
export const Features = {
  EXCEL_EXPORT: import.meta.env.VITE_ENABLE_EXCEL_EXPORT === "true",
  AI_INSIGHTS: import.meta.env.VITE_ENABLE_AI_INSIGHTS === "true",
};

// Categories
export const TRANSACTION_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Entretenimento",
  "Utilidades",
  "Outros",
];

// Date Formats
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

// Messages
export const MESSAGES = {
  SUCCESS: "Operação realizada com sucesso!",
  ERROR: "Ocorreu um erro. Tente novamente.",
  LOADING: "Carregando...",
  DELETE_CONFIRM: "Tem certeza que deseja deletar?",
  SAVE_SUCCESS: "Dados salvos com sucesso!",
  SAVE_ERROR: "Erro ao salvar dados.",
};

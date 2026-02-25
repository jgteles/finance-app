interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_EXCEL_EXPORT: string;
  readonly VITE_ENABLE_AI_INSIGHTS: string;
  readonly VITE_GOOGLE_AI_KEY?: string;
  readonly PROD: string;
  readonly DEV: string;
  readonly VITE_ENVIRONMENT: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}


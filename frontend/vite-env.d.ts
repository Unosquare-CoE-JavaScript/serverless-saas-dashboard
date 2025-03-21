/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TENANT_BASE_URL: string;
  readonly VITE_PLATFORM_BASE_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_JWT_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

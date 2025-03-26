import axios, { type AxiosInstance } from "axios";
import { HttpMethod } from '@/types/httpMethod';

// Environment variables
const TENANT_GATEWAY = import.meta.env.VITE_TENANT_BASE_URL;
const PLATFORM_GATEWAY = import.meta.env.VITE_PLATFORM_BASE_URL;

// Create Axios instances for each API Gateway
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(
    (config) => {
      // Put down your JWT here
      const token = 'eyJraWQiOiJKeUcwUHFldWtZdmtjdjNoaGhwMjFDVXVtR0NKS3VFd0VMYnlsN2JvS2s0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2MThiMjVkMC01MGIxLTcwZGQtZDJiZC04NTU0NGYwM2UyYTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9OdWpIRlluZ00iLCJjbGllbnRfaWQiOiIzZ2FwdjlrZHZvZTk3dDBqZGtjdWo3bHFhYiIsIm9yaWdpbl9qdGkiOiJkNDE5Zjk2Ni1kMzYwLTRjZDQtYjc4Mi1iYTBjZGJjYmUxNzYiLCJldmVudF9pZCI6IjEyMjAzYjcxLTdjYjItNGI5ZS04YTgwLTJiZWRkNzQyZGY0YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDMwMTI2NTMsImV4cCI6MTc0MzAxNjI1MywiaWF0IjoxNzQzMDEyNjUzLCJqdGkiOiJhZWRkM2M0Zi01NDk1LTQxMDEtYjYzMS0wOTQ4ZTUxNWQyZTgiLCJ1c2VybmFtZSI6IjYxOGIyNWQwLTUwYjEtNzBkZC1kMmJkLTg1NTQ0ZjAzZTJhOSJ9.nRVfRzja3yQFj3qG2yTT8zmOh1pmL6tHj5UhdYHOicU8wAlgPB1RRPB1M-R5IInzPBpiox3z9iPUUn4MCU9DXJ06gSZcRMet8SCti2h-v7k6ubPfDgoGk8IU-1Z8DofR5fl0QKt2JBIHnDFm_DBtsox6Ln_m7ep_75QFKzJXEUgNUIk1ZVH7jqAIDeoAwfqDOn0tu09l4MB0o9qMqancuhW-oHSZY2lMLf1uvTg9rVOBEo4jAhd7vRNVWkF4TnJfK_PpPLwj1ZxvVzdktBixtHgRZcUItr-tiZEILJiTjC5t0vPIpK1d6Y9f38oYG2DqLnutKkgHwCQg3JTd65FG1w'
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
        config.headers.set("Accept", "application/json");
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// Initialize APIs
const tenantGateway = createApiInstance(TENANT_GATEWAY);
const platformGateway = createApiInstance(PLATFORM_GATEWAY);

// Function to handle API requests dynamically
const request = async <T>(
  api: AxiosInstance,
  method: HttpMethod,
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url: endpoint,
      data,
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error(`API ${api.defaults.baseURL} Error:`, error.response?.data || error.message);
    throw error;
  }
};

// Export API services
export const tenantApi = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>(tenantGateway, HttpMethod.GET, endpoint, undefined, params),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(tenantGateway, HttpMethod.POST, endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(tenantGateway, HttpMethod.PUT, endpoint, data),
  delete: <T>(endpoint: string) => request<T>(tenantGateway, HttpMethod.DELETE, endpoint),
};

export const platformApi = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>(platformGateway, HttpMethod.GET, endpoint, undefined, params),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(platformGateway, HttpMethod.POST, endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(platformGateway, HttpMethod.PUT, endpoint, data),
  delete: <T>(endpoint: string) => request<T>(platformGateway, HttpMethod.DELETE, endpoint),
};

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
      const token = ''
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

import axios, { type AxiosInstance } from "axios";

// Environment variables
const TENANT_GATEWAY = import.meta.env.VITE_TENANT_BASE_URL;
const PLATFORM_GATEWAY = import.meta.env.VITE_PLATFORM_BASE_URL;

// Create Axios instances for each API Gateway
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(
    (config) => {
      // Put down here your JWT. For testing purposes only.
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
  method: "get" | "post" | "put" | "delete",
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
    request<T>(tenantGateway, "get", endpoint, undefined, params),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(tenantGateway, "post", endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(tenantGateway, "put", endpoint, data),
  delete: <T>(endpoint: string) => request<T>(tenantGateway, "delete", endpoint),
};

export const platformApi = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>(platformGateway, "get", endpoint, undefined, params),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(platformGateway, "post", endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(platformGateway, "put", endpoint, data),
  delete: <T>(endpoint: string) => request<T>(platformGateway, "delete", endpoint),
};

import axios, { type AxiosInstance } from 'axios';

// Environment variables
const TENANT_GATEWAY = import.meta.env.VITE_TENANT_BASE_URL;
const PLATFORM_GATEWAY = import.meta.env.VITE_PLATFORM_BASE_URL;

// Create Axios instances for each API Gateway
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(
    (config) => {
      // Put down here your JWT. For testing purposes only.
      const token =
        'eyJraWQiOiJKeUcwUHFldWtZdmtjdjNoaGhwMjFDVXVtR0NKS3VFd0VMYnlsN2JvS2s0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2MThiMjVkMC01MGIxLTcwZGQtZDJiZC04NTU0NGYwM2UyYTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9OdWpIRlluZ00iLCJjbGllbnRfaWQiOiIzZ2FwdjlrZHZvZTk3dDBqZGtjdWo3bHFhYiIsIm9yaWdpbl9qdGkiOiJjYzE1NDE3Yi1hMTJjLTQwYzUtYTY2MC01OWUzZGRkYjNlYjciLCJldmVudF9pZCI6ImRhODBkY2NjLWYyNzctNDhlZi05YzA1LTc1NzA1ZWRjNDU0OCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDI1OTAwMTIsImV4cCI6MTc0MjU5MzYxMiwiaWF0IjoxNzQyNTkwMDEyLCJqdGkiOiIxMzU5ODQ0Ny0wMjBjLTQzNzQtOTM0Yi05ZmVmZGVhODdkMmYiLCJ1c2VybmFtZSI6IjYxOGIyNWQwLTUwYjEtNzBkZC1kMmJkLTg1NTQ0ZjAzZTJhOSJ9.qnwEhUhTYCiWfcuP6vszmRllMx5xPUr1hDm92Cu2FtAGfbr0Hx1ih80KsJNm9EIXJFADEYPvjJSpmlgZGVzeg06f088FOcHO7C_29J9NWnkMXd14k4Zv0mWBUvwocIjVl1k7amVF5k7RztKnGuvNbZ-3BpDYVXl5XswSZ2UFrCj5EgrG5XEIdjr66wQai2DqY0CBKNjmI06Kb8BvY-yJnzVFQwqk0PjqxHG1nva2fIhfrOuNUKlf0Pr9gUrvJ_E7byYpDRke7YG0KTkGcRZQDfssIryo_SiOYRdrYQiAAXrMEGyycscWZUqgyrG4nj4mJvmZ0v8QJX3GgZwr5iWAYw';
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
        config.headers.set('Accept', 'application/json');
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

// Initialize APIs
const tenantGateway = createApiInstance(TENANT_GATEWAY);
const platformGateway = createApiInstance(PLATFORM_GATEWAY);

// Function to handle API requests dynamically
const request = async <T>(
  api: AxiosInstance,
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>,
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
    console.error(
      `API ${api.defaults.baseURL} Error:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Export API services
export const tenantApi = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>(tenantGateway, 'get', endpoint, undefined, params),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(tenantGateway, 'post', endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(tenantGateway, 'put', endpoint, data),
  delete: <T>(endpoint: string) =>
    request<T>(tenantGateway, 'delete', endpoint),
};

export const platformApi = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>(platformGateway, 'get', endpoint, undefined, params),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(platformGateway, 'post', endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(platformGateway, 'put', endpoint, data),
  delete: <T>(endpoint: string) =>
    request<T>(platformGateway, 'delete', endpoint),
};

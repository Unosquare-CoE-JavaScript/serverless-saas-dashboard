import { defineStore } from 'pinia';
import { tenantApi } from '@/service/httpService';
import type { _File, FileApiResponse, FileCreatePayload } from '@/types/File';
import { AxiosError } from 'axios';

interface FileState {
  files: _File[];
  currentFile: _File | null;
  loading: boolean;
  error: string | null;
}

export const useFileStore = defineStore('file', {
  state: (): FileState => ({
    files: [],
    currentFile: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll(organizationId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tenantApi.get<FileApiResponse<_File[]>>(
          `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files`,
        );
        this.files = response.data;
      } catch (err) {
        if (err instanceof AxiosError || err instanceof Error)
          this.error = err.message;
        if (typeof err === 'string') this.error = err;
        console.log(this.error);
      } finally {
        this.loading = false;
      }
    },

    async createFile(organizationId: string, payload: FileCreatePayload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tenantApi.post<FileApiResponse<_File>>(
          `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files`,
          payload,
        );
        this.files = [...this.files, response.data];
        this.currentFile = null;
      } catch (err) {
        if (err instanceof AxiosError || err instanceof Error)
          this.error = err.message;
        if (typeof err === 'string') this.error = err;
        console.log(this.error);
      } finally {
        this.loading = false;
      }
    },

    async updateFile(organizationId: string, file: Partial<_File>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tenantApi.put<FileApiResponse<_File>>(
          `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files/${file.file_id}`,
          file,
        );
        const updatedFile = response.data;
        this.files = this.files.map((file) => {
          if (file.file_id === updatedFile.file_id) {
            return updatedFile;
          }
          return file;
        });
        this.currentFile = null;
      } catch (err: unknown) {
        if (err instanceof AxiosError || err instanceof Error)
          this.error = err.message;
        if (typeof err === 'string') this.error = err;
        console.log(this.error);
      } finally {
        this.loading = false;
      }
    },

    async deleteFile(organizationId: string, fileId: string) {
      this.loading = true;
      this.error = null;
      try {
        await tenantApi.delete<FileApiResponse<_File>>(
          `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files/${fileId}`,
        );
        this.files = this.files.filter((file) => file.file_id !== fileId);

        this.currentFile = null;
      } catch (err) {
        if (err instanceof AxiosError || err instanceof Error)
          this.error = err.message;
        if (typeof err === 'string') this.error = err;
        console.log(this.error);
      } finally {
        this.loading = false;
      }
    },
    setFiles(files: _File[]) {
      this.files = files;
    },
    setFile(file: _File | null) {
      this.currentFile = file;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  },
});

import type { _File, FileApiResponse, FileCreatePayload } from '@/types/File';
import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: '*/*',
  Authorization: `Bearer ${import.meta.env.VITE_API_JWT_TOKEN}`,
};

const getFiles = (organizationId: string): Promise<FileApiResponse<_File[]>> =>
  axios
    .get(
      `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files`,
      { headers: headers },
    )
    .then((response) => response.data);

const getFile = (
  organizationId: string,
  fileId: string,
): Promise<FileApiResponse<_File>> =>
  axios
    .get(
      `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files/${fileId}`,
      { headers: headers },
    )
    .then((response) => response.data);

const createFile = (
  organizationId: string,
  payload: FileCreatePayload,
): Promise<FileApiResponse<_File>> =>
  axios
    .post(
      `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files`,
      payload,
      { headers: headers },
    )
    .then((response) => response.data);

const updateFile = (
  organizationId: string,
  payload: Partial<_File>,
): Promise<FileApiResponse<_File>> =>
  axios
    .put(
      `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files/${payload.file_id}`,
      payload,
      { headers: headers },
    )
    .then((response) => response.data);

const deleteFile = (
  organizationId: string,
  fileId: string,
): Promise<FileApiResponse<File>> =>
  axios
    .delete(
      `${import.meta.env.VITE_API_BASE_URL}/organizations/${organizationId}/files/${fileId}`,
      { headers: headers },
    )
    .then((response) => response.data);

export { createFile, deleteFile, getFile, getFiles, updateFile };

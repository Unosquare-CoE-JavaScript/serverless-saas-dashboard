export interface _File {
  organization_id: string;
  file_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_status: string;
  file_url?: string;
  file_private: boolean;
  updated_at: string;
  uploaded_at?: string;
}

export interface ProcessedFile {
  file_name: string;
  file_type: string;
  file_size: number;
  file_private: boolean;
  updated_at: string;
}

export interface DeleteModalProps {
  fileId: string | null;
  fileName: string | null;
  loading: boolean;
  open: boolean;
}

export interface DeleteModalEmits {
  (e: 'modal:show', show: boolean): void;
  (e: 'modal:delete', fileId: string): void;
}

export interface FileModalProps {
  file: Partial<_File> | null;
  loading: boolean;
  open: boolean;
  submitted: boolean;
}

export interface FileModalEmits {
  (e: 'modal:show', show: boolean): void;
  (e: 'modal:save', fileToUpload: File | null, file: Partial<_File>): void;
}

export type FileCreatePayload = Partial<
  Omit<_File, 'file_id' | 'organization_id'>
> & {
  file_content: string | null;
};

interface Pagination {
  count: number;
  page?: number;
  limit?: number;
}

interface FileApiResponseSingle<T> {
  data: T;
  message: string;
}

interface FileApiResponseMultiple<T> {
  data: T;
  message: string;
  pagination: Pagination;
}

export type FileApiResponse<T> =
  | FileApiResponseMultiple<T>
  | FileApiResponseSingle<T>;

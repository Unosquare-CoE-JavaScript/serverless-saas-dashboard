<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
// Store
import { useFileStore } from '@/modules/files/store/fileStore';
//components
import DeleteModal from '@/modules/files/components/DeleteModal.vue';
import FileModal from '@/modules/files/components/FileModal.vue';
import { storeToRefs } from 'pinia';
import type { _File, FileCreatePayload } from '@/types/File';

// Variables & constants
const toast = useToast();
const dt = ref();
const showDeleteModal = ref(false);
const showModal = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const organizationId = '98e6c049-073e-456d-9999-4b158f27bce0';

// Variables from store
const fileStore = useFileStore();
const { currentFile, error, files, loading } = storeToRefs(fileStore);
const { fetchAll, createFile, deleteFile, setFile, setLoading, updateFile } =
  fileStore;

// Hooks
onBeforeMount(async () => {
  await fetchAll(organizationId);

  if (error.value) {
    console.log('error', error.value);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch files. details: ${error.value}`,
      life: 6000,
    });
  }
});

// Methods
const openDeleteModal = (show = true, f: _File | null = null): void => {
  setFile(f);
  showDeleteModal.value = show;
};

const openEditModal = (f: _File | null): void => {
  setFile(f);
  showModal.value = true;
};

const openModal = (show = true): void => {
  submitted.value = false;
  if (!show) setFile(null);
  showModal.value = show;
};

const onSave = (...rest: [Blob, Partial<_File>]): void => {
  console.log('rest', rest);
  const [fileToUpload, file] = rest;
  if (fileToUpload) {
    onSaveFile(...rest);
  } else {
    onUpdateFile(file);
  }
};

//Actions
const onDeleteFile = async (fileId: string): Promise<void> => {
  submitted.value = true;
  setLoading(true);
  console.log('fileId', fileId);

  await deleteFile(organizationId, fileId);

  setLoading(false);
  showDeleteModal.value = false;

  if (error.value) {
    console.log('error', error.value);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to delete file. details: ${error.value}`,
      life: 6000,
    });
    return;
  } else {
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'File deleted successfully',
      life: 6000,
    });
  }
};

const onUpdateFile = async (file: Partial<_File>): Promise<void> => {
  submitted.value = true;
  setLoading(true);
  console.log('file', file);

  await updateFile(organizationId, file);

  setLoading(false);
  showModal.value = false;

  if (error.value) {
    console.log('error', error.value);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to update file. details: ${error.value}`,
      life: 6000,
    });
    return;
  } else {
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'File updated successfully',
      life: 6000,
    });
  }
};

const onSaveFile = async (fileToUpload: Blob, file: Partial<_File>) => {
  submitted.value = true;
  setLoading(true);
  const payload: FileCreatePayload = {
    ...file,
    file_content: null,
  };

  console.log('fileToUpload', fileToUpload);
  console.log('file', file);

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const validEvent = !!(
        e.target &&
        e.target.result &&
        typeof e.target.result === 'string'
      );

      console.log('validEvent', validEvent);

      const data = validEvent ? e.target.result.split(',')[1] : '';

      console.log('data', data);
      payload.file_content = data;

      await createFile(organizationId, payload);

      setLoading(false);
      showModal.value = false;

      if (error.value) {
        console.log('error', error.value);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to create file. details: ${error.value}`,
          life: 6000,
        });
        return;
      } else {
        toast.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File created successfully',
          life: 6000,
        });
      }

      // console.log('payload', payload);
    };

    reader.readAsDataURL(fileToUpload);

    //console.log('payload', payload);
  } catch (error) {
    console.log('error', error);
    setLoading(false);
    showModal.value = false;
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to create file. details: ${error}`,
      life: 6000,
    });
  }
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openModal(true)"
          />
        </template>

        <template #end>
          <Button
            label="Export"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV()"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="files"
        dataKey="file_id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} files"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Files</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </IconField>
          </div>
        </template>

        <template #loading> Loading files. Please wait... </template>

        <template #empty> No files found. </template>

        <Column
          field="file_name"
          header="Name"
          sortable
          style="min-width: 16rem"
        />
        <Column
          field="file_type"
          header="Type"
          sortable
          style="min-width: 16rem"
        />
        <Column
          field="file_private"
          header="Private"
          sortable
          style="min-width: 16rem"
        />
        <Column
          field="file_url"
          header="Url"
          :hidden="true"
          sortable
          style="min-width: 16rem"
        />
        <Column
          field="file_status"
          header="Status"
          sortable
          style="min-width: 16rem"
        />
        <Column
          field="updated_at"
          header="Updated At"
          sortable
          style="min-width: 16rem"
        />
        <Column
          field="uploaded_at"
          header="Uploaded At"
          sortable
          style="min-width: 16rem"
        />
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="openEditModal(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="openDeleteModal(true, slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <FileModal
      :file="currentFile"
      :loading="loading"
      :open="showModal"
      :submitted="submitted"
      @modal:show="openModal"
      @modal:save="onSave"
    />

    <DeleteModal
      :fileId="currentFile ? currentFile.file_id : null"
      :fileName="currentFile ? currentFile.file_name : null"
      :loading="loading"
      :open="showDeleteModal"
      @modal:show="openDeleteModal"
      @modal:delete="onDeleteFile"
    />
  </div>
</template>
<style lang="scss" scoped></style>

<script setup lang="ts">
import type {
  _File,
  FileModalEmits,
  FileModalProps,
  ProcessedFile,
} from '@/types/File';
import type { FileUploadSelectEvent } from 'primevue';
import { ref, watch } from 'vue';

//emits
const emits = defineEmits<FileModalEmits>();
// Variables & props
const props = defineProps<FileModalProps>();

const processedFile = ref<ProcessedFile | Partial<_File>>({
  file_name: '',
  file_type: '',
  file_size: 0,
  file_private: false,
  updated_at: '',
});
const fileUpload = ref<File | null>(null);
const fileToUpload = ref<File | null>(null);
const show = ref(props.open);

watch(
  () => props.open,
  (value) => {
    show.value = value;
    console.log('value for prop open:', value);
  },
);

watch(
  () => props.file,
  (value) => {
    if (props.file?.file_name) processedFile.value = props.file;
    else
      processedFile.value = {
        file_name: '',
        file_type: '',
        file_size: 0,
        file_private: false,
        updated_at: '',
      };
    console.log('value for prop file:', value);
  },
  { deep: true },
);

// Methods
const onFileSelect = (e: FileUploadSelectEvent) => {
  console.log('files', e.files);
  const [newfile] = e.files;
  fileToUpload.value = newfile;
  processedFile.value = {
    file_name: newfile.name,
    file_type: newfile.type,
    file_size: parseInt(newfile.size),
    file_private: false,
    //updated_at: newfile.lastModified,
  };
};

const getFileURL = (file: File) => {
  console.log(file);
  return URL.createObjectURL(file);
};
</script>
<template>
  <Dialog
    v-model:visible="show"
    :style="{ width: '450px' }"
    :header="`${props.file ? 'Update' : 'New'} File`"
    :modal="true"
    :closable="false"
  >
    <div class="flex flex-col gap-6">
      <FileUpload
        v-if="!props.file"
        ref="fileUpload"
        name="file[]"
        :multiple="false"
        :maxFileSize="1000000"
        :showUploadButton="false"
        :showCancelButton="false"
        @select="onFileSelect"
      >
        <template #content="{ files, removeFileCallback }">
          <div v-if="files.length > 0" class="flex w-full">
            <div
              v-for="(tempFile, index) of files"
              :key="tempFile.name + tempFile.type + tempFile.size"
              class="flex flex-row border-solid items-center gap-3"
            >
              <div>
                <img
                  role="presentation"
                  :alt="tempFile.name"
                  :src="getFileURL(tempFile)"
                  width="100"
                  height="50"
                />
              </div>
              <div>
                <span class="font-semibold">{{ tempFile.name }}</span>
                <div>{{ tempFile.size }}</div>
              </div>

              <Button
                icon="pi pi-times"
                outlined
                rounded
                severity="danger"
                @click="removeFileCallback(index)"
              />
            </div>
          </div>
        </template>
        <template #empty>
          <span>Drag and drop files here.</span>
        </template>
      </FileUpload>
      <div>
        <label for="name" class="block font-bold mb-3">Name</label>
        <InputText
          id="name"
          :key="processedFile?.file_name"
          v-model.trim="processedFile.file_name"
          required="true"
          autofocus
          disabled
          :invalid="submitted && !processedFile.file_name"
          fluid
        />
        <small v-if="submitted && !processedFile.file_name" class="text-red-500"
          >Name is required.</small
        >
      </div>
      <div>
        <label for="type" class="block font-bold mb-3">Type</label>
        <InputText
          id="type"
          v-model.trim="processedFile.file_type"
          required="true"
          autofocus
          disabled
          :invalid="submitted && !processedFile.file_type"
          fluid
        />
        <small v-if="submitted && !processedFile.file_type" class="text-red-500"
          >Type is required.</small
        >
      </div>
      <div>
        <label for="private" class="block font-bold mb-3">Private?</label>
        <ToggleSwitch v-model="processedFile.file_private" />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="
          () => {
            fileToUpload = null;
            emits('modal:show', false);
          }
        "
      />
      <Button
        label="Save"
        :loading="loading"
        icon="pi pi-check"
        @click="emits('modal:save', fileToUpload, processedFile)"
      />
    </template>
  </Dialog>
</template>
<style lang="scss" scoped></style>

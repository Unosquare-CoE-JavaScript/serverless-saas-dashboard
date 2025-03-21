<script setup lang="ts">
import type { DeleteModalEmits, DeleteModalProps } from '@/types/File';
import { ref, watch } from 'vue';
//emits
const emits = defineEmits<DeleteModalEmits>();
// Variables & props
const props = defineProps<DeleteModalProps>();
// Reactive variable for dialog visibility
const show = ref(props.open);

// Watch for changes in the 'open' prop
watch(
  () => props.open,
  (value) => {
    show.value = value;
    console.log('value for prop open:', value);
  },
);
// Methods
</script>
<template>
  <Dialog
    v-model:visible="show"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="fileId"
        >Are you sure you want to delete <b>{{ fileName }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        text
        @click="emits('modal:show', false)"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        @click="fileId && emits('modal:delete', fileId)"
      />
    </template>
  </Dialog>
</template>
<style lang="scss" scoped></style>

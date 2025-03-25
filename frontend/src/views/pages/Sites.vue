<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV()" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                :value="sites"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sites"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Sites</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="site_name" header="Name" sortable style="min-width: 12rem"></Column>
                <Column field="description" header="Description" sortable style="min-width: 16rem"></Column>
                <Column field="site_url" header="Site URL" sortable style="min-width: 8rem"></Column>
                <Column field="site_status" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.site_status" :severity="getSiteStatusLabel(slotProps.data.site_status)" />
                    </template>
                </Column>
                <Column field="site_keyword" header="Site Keyword" sortable style="min-width: 8rem"></Column>
                <Column header="Site Logo">
                    <template #body="slotProps">
                        <img :src="slotProps.data.site_logo_url" alt="Site Logo" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editSite(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSite(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="siteDialog" :style="{ width: '450px' }" header="Site Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="site_name" class="block font-bold mb-3">Site Name</label>
                    <InputText id="siteName" v-model.trim="site.site_name" required="true" autofocus :invalid="submitted && !site.site_name" fluid />
                    <small v-if="submitted && !site.site_name" class="text-red-500">Name is required.</small>
                </div>

                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="site.description" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    <label for="site_url" class="block font-bold mb-3">Site URL</label>
                    <InputText id="siteUrl" v-model="site.site_url" required="true" autofocus :invalid="submitted && !site.site_url" fluid />
                    <small v-if="submitted && !site.site_url" class="text-red-500">URL is required.</small>
                </div>

                <div>
                    <label for="site_status" class="block font-bold mb-3">Site Status</label>
                    <Select id="siteStatus" v-model="site.site_status" :options="statuses" option-value="value" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>

                <div>
                    <label for="site_keyword" class="block font-bold mb-3">Site Keyword</label>
                    <InputText id="siteKeyword" v-model="site.site_keyword" required="true" autofocus :invalid="submitted && !site.site_keyword" fluid />
                    <small v-if="submitted && !site.site_keyword" class="text-red-500">Keyword is required.</small>
                </div>

                <div>
                    <label for="site_mailers" class="block font-bold mb-3">Site Mailers</label>
                    <MultiSelect  id="siteMailers" v-model="site.site_mailers" :options="mailers" placeholder="Select mailers" required="true" :invalid="submitted && !site.site_mailers.length" fluid />
                    <small v-if="submitted && !site.site_mailers.length" class="text-red-500">At least 1 mailer is required.</small>
                </div>

                <div class="flex flex-col gap-4">
                    <label for="site_image" class="block font-bold">Site Logo</label>

                    <div class="flex items-center gap-4">
                        <!-- Image Preview -->
                        <div class="relative w-32 h-32 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <img v-if="src || site.site_logo_url" :src="src || site.site_logo_url" alt="Site Logo" class="w-full h-full object-cover" />
                            <span v-else class="text-gray-400">No Image</span>
                            
                            <!-- Remove Image Button -->
                            <button v-if="src" @click="clearImage" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>

                        <!-- Upload Button -->
                        <FileUpload
                            mode="basic"
                            @select="onFileSelect"
                            customUpload
                            auto
                            :accept="'image/*'"
                            chooseLabel="Browse"
                            class="p-button p-button-outlined"
                        />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveSite" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteSiteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="site"
                    >Are you sure you want to delete <b>{{ site.site_name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteSiteDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteSite" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useSiteStore } from '@/store/siteStore'
import { type Site } from '@/types/site'
import { type FileUploadSelectEvent } from 'primevue/fileupload';

const siteStore = useSiteStore()

onMounted(async () => {
    await siteStore.fetchAllSites();
});

const sites = computed(() => siteStore.sites as Site[]);

const toast = useToast();
const src = ref<any>(null);
const dt = ref<any>();
const siteDialog = ref<boolean>(false);
const deleteSiteDialog = ref<boolean>(false);
const site = ref<Site>({} as Site);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref<boolean>(false);
    const statuses = ref<{ label: string; value: string }[]>([
    { label: 'ACTIVE', value: 'Active' },
    { label: 'INACTIVE', value: 'Inactive' },
]);
const mailers = ref<string[]>([
    'carlos.terceros@unosquare.com',
    'edison.urquijo@unosquare.com',
    'oscar.lara@unosquare.com',
    'pablo.maestre@unosquare.com',
]);

function onFileSelect(event: FileUploadSelectEvent): void {
    const fileInput = event.files[0];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;

            // Ensure the string includes the proper data prefix
            if (!base64String.startsWith("data:image")) {
                console.error("Invalid Base64 string for image");
                return;
            }

            src.value = base64String;
            site.value.site_logo = base64String;
        };
        reader.readAsDataURL(fileInput);
    }
}

function openNew(): void {
    site.value = {} as Site;
    submitted.value = false;
    siteDialog.value = true;
};

function hideDialog(): void {
    siteDialog.value = false;
    submitted.value = false;
    src.value = null
};

async function saveSite(): Promise<void> {
    submitted.value = true;

    if (site?.value.site_name?.trim()) {
        if (site.value.site_id) {
            await siteStore.updateSite(site.value.site_id, site.value);    
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Site Updated', life: 3000 });
        } else {
            await siteStore.createSite(site.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Site Created', life: 3000 });
        }

        siteDialog.value = false;
        site.value = {} as Site;
    }
};

function editSite(siteToEdit: Site): void {
    site.value = { ...siteToEdit };
    siteDialog.value = true;
};

function confirmDeleteSite(deletedSite: Site): void {
    site.value = deletedSite;
    deleteSiteDialog.value = true;
};

async function deleteSite(): Promise<void> {
    await siteStore.deleteSite(site.value.site_id);
    deleteSiteDialog.value = false;
    site.value = {} as Site;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Site Deleted', life: 3000 });
};

function getSiteStatusLabel(status: string): string {
    switch (status) {
        case 'Active':
            return 'success';

        case 'Inactive':
            return 'danger';

        default:
            return 'success';
    }
};

function exportCSV(): void {
    dt.value.exportCSV();
};

function clearImage(): void {
    src.value = null;
    site.value.site_logo = '';
}
</script>

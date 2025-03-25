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
                :value="organizations"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} organizations"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Organizations</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="organization_name" header="Name" sortable style="min-width: 12rem"></Column>
                <Column field="description" header="Description" sortable style="min-width: 16rem"></Column>
                <Column field="active" header="Active" sortable style="min-width: 8rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editOrganization(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteOrganization(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="organizationDialog" :style="{ width: '450px' }" header="Organization Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="organization_name" class="block font-bold mb-3">Organization Name</label>
                    <InputText id="organizationName" v-model.trim="organization.organization_name" required="true" autofocus :invalid="submitted && !organization.organization_name" fluid />
                    <small v-if="submitted && !organization.organization_name" class="text-red-500">Name is required.</small>
                </div>

                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="organization.description" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveOrganization" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteOrganizationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="organization"
                    >Are you sure you want to delete <b>{{ organization.organization_name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteOrganizationDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteOrganization" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed } from 'vue';
import { useOrganizationStore } from '@/store/organizationStore'
import { type Organization } from '@/types/organization'

const organizationStore = useOrganizationStore()

onMounted(async () => {
    await organizationStore.fetchAllOrganizations();
});

const organizations = computed(() => organizationStore.organizations as Organization[]);

const toast = useToast();
const dt = ref<any>();
const organizationDialog = ref<boolean>(false);
const deleteOrganizationDialog = ref<boolean>(false);
const organization = ref<Organization>({} as Organization);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref<boolean>(false);
function openNew(): void {
    organization.value = {} as Organization;
    submitted.value = false;
    organizationDialog.value = true;
};

function hideDialog(): void {
    organizationDialog.value = false;
    submitted.value = false;
};

async function saveOrganization(): Promise<void> {
    submitted.value = true;

    if (organization?.value.organization_name?.trim()) {
        if (organization.value.organization_id) {
            await organizationStore.updateOrganization(organization.value.organization_id, organization.value);    
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Organization Updated', life: 3000 });
        } else {
            await organizationStore.createOrganization(organization.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Organization Created', life: 3000 });
        }

        organizationDialog.value = false;
        organization.value = {} as Organization;
    }
};

function editOrganization(organizationToEdit: Organization): void {
    organization.value = { ...organizationToEdit };
    organizationDialog.value = true;
};

function confirmDeleteOrganization(deletedOrganization: Organization): void {
    organization.value = deletedOrganization;
    deleteOrganizationDialog.value = true;
};

async function deleteOrganization(): Promise<void> {
    await organizationStore.deleteOrganization(organization.value.organization_id);
    deleteOrganizationDialog.value = false;
    organization.value = {} as Organization;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Organization Deleted', life: 3000 });
};


function exportCSV(): void {
    dt.value.exportCSV();
};
</script>

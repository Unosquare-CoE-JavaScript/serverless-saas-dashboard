import { defineStore } from 'pinia';

export const useOrganizationStore = defineStore('organization', {
    state: () => ({
        organizationId: '123'
    }),
    actions: {
        setOrganizationId(id: string) {
            this.organizationId = id;
        }
    }
});

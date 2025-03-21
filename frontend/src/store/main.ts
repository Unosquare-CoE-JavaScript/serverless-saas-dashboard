import { defineStore } from 'pinia';


export const useMainStore = defineStore('main', {

    state: () => ({
        organizationId: '123'
    }),
    actions: {
        setOrganizationId ( orgId: string ) {
            this.organizationId = orgId;
        }
    }
})

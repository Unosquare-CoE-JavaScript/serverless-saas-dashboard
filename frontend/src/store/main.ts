import { defineStore } from 'pinia';


export const useMainStore = defineStore('main', {

    state: () => ({
        organizationId: ''
    }),
    actions: {
        setOrganizationId ( orgId: string ) {
            this.organizationId = orgId;   
        }
    }
})



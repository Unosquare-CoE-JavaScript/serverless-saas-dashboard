import { defineStore } from 'pinia';
import { organizationService } from '@/service/organizationService';
import { type Organization } from '@/types/organization'

interface OrganizationState {
    organizations: Organization[]
    currentOrganization: Organization | null
    loading: boolean
    error: string | null
};

export const useOrganizationStore = defineStore('organization', {
    state: (): OrganizationState => ({
        organizations: [],
        currentOrganization: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllOrganizations() {
            this.loading = true;
            this.error = null;
            try {
                const organizations = await organizationService.getAllOrganizations();
                this.organizations = organizations;
            } catch (err) {
                this.error = 'Failed to fetch organizations';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async fetchOrganizationById(organizationId: string) {
            this.loading = true;
            this.error = null;
            try {
                const organization = await organizationService.getOrganizationById(organizationId);
                this.currentOrganization = organization;
            } catch (err) {
                this.error = 'Failed to fetch organization details';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async createOrganization(organizationData: Omit<Organization, 'organization_id'>) {
            this.loading = true;
            this.error = null;
            try {
                const newOrganization = await organizationService.createOrganization(organizationData);
                this.organizations.push(newOrganization);
            } catch (err) {
                this.error = 'Failed to create organization';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async updateOrganization(organizationId: string, organizationData: Partial<Omit<Organization, 'organization_id'>>) {
            this.loading = true;
            this.error = null;
            try {
                const updatedOrganization = await organizationService.updateOrganization(organizationId, organizationData);
                const index = this.organizations.findIndex(organization => organization.organization_id === organizationId);
                if (index !== -1) {
                    this.organizations[index] = updatedOrganization;
                }
            } catch (err) {
                this.error = 'Failed to update organization';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async deleteOrganization(organizationId: string) {
            this.loading = true;
            this.error = null;
            try {
                await organizationService.deleteOrganization(organizationId);
                this.organizations = this.organizations.filter(organization => organization.organization_id !== organizationId);
            } catch (err) {
                this.error = 'Failed to delete organization';
                console.error(err);
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        getOrganizationById: (state) => {
            return (organizationId: string) => {
                return state.organizations.find(organization => organization.organization_id === organizationId) || null;
            }
        }
    }
});

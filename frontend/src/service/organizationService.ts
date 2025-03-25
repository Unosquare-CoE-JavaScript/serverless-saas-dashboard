import { platformApi } from '@/service/httpService';
import { type Organization } from '@/types/organization'

const ORGANIZATIONS_ENDPOINT = '/organizations'

export const organizationService = {
    /**
     * Fetch all organizations
     */
    getAllOrganizations: async (): Promise<Organization[]> => {
        const response = await platformApi.get<{ message: string, organizations: Organization[] }>(ORGANIZATIONS_ENDPOINT);
        return response.organizations;
    },

    /**
     * Get organization by ID
     * @param organizationId - The ID of the organization
     */
    getOrganizationById: async (organizationId: string): Promise<Organization> => {
        const response = await platformApi.get<{ message: string, organization: Organization }>(`${ORGANIZATIONS_ENDPOINT}/${organizationId}`);
        return response.organization
    },

    /**
     * Create organization
     * @param organizationData - The organization data
     */
    createOrganization: async (organizationData: Omit<Organization, 'organization_id'>): Promise<Organization> => {
        const response = await platformApi.post<{ message: string, organization: Organization }>(ORGANIZATIONS_ENDPOINT, organizationData);
        return response.organization;
    },

    /**
     * Update organization
     * @param organizationId - The ID of the organization
     * @param organizationData - The updated organization data
     */
    updateOrganization: async (organizationId: string, organizationData: Partial<Omit<Organization, 'organization_id'>>): Promise<Organization> => {
        const response = await platformApi.put<{ message: string, organization: Organization }>(`${ORGANIZATIONS_ENDPOINT}/${organizationId}`, organizationData);
        return response.organization;
    },

    /**
     * Delete organization
     * @param organizationId - The ID of the organization
     */
    deleteOrganization: async (organizationId: string): Promise<void> => {
        return await platformApi.delete(`${ORGANIZATIONS_ENDPOINT}/${organizationId}`);
    }
};

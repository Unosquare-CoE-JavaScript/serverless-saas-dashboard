import { tenantApi } from '@/service/httpService';
import { useMainStore } from '@/store/main';
import { type Site } from '@/types/site'

const store = useMainStore();

const SITES_ENDPOINT = `organizations/${store.organizationId}/sites`;

export const siteService = {
    /**
     * Fetch all sites
     */
    getAllSites: async (): Promise<Site[]> => {
        const response = await tenantApi.get<{ message: string, sites: Site[] }>(SITES_ENDPOINT);
        return response.sites;
    },

    /**
     * Get site by ID
     * @param siteId - The ID of the site
     */
    getSiteById: async (siteId: string): Promise<Site> => {
        const response = await tenantApi.get<{ message: string, site: Site }>(`${SITES_ENDPOINT}/${siteId}`);
        return response.site
    },

    /**
     * Create site
     * @param siteData - The site data
     */
    createSite: async (siteData: Omit<Site, 'site_id' | 'organization_id'>): Promise<Site> => {
        const response = await tenantApi.post<{ message: string, site: Site }>(SITES_ENDPOINT, siteData);
        return response.site;
    },

    /**
     * Update site
     * @param siteId - The ID of the site
     * @param siteData - The updated site data
     */
    updateSite: async (siteId: string, siteData: Partial<Omit<Site, 'site_id' | 'organization_id'>>): Promise<Site> => {
        const response = await tenantApi.put<{ message: string, site: Site }>(`${SITES_ENDPOINT}/${siteId}`, siteData);
        return response.site;
    },

    /**
     * Delete site
     * @param siteId - The ID of the site
     */
    deleteSite: async (siteId: string): Promise<void> => {
        return await tenantApi.delete(`${SITES_ENDPOINT}/${siteId}`);
    }
};

import { defineStore } from 'pinia';
import { siteService } from '@/service/siteService';
import { type Site } from '@/types/site'

interface SiteState {
    sites: Site[]
    currentSite: Site | null
    loading: boolean
    error: string | null
};

export const useSiteStore = defineStore('site', {
    state: (): SiteState => ({
        sites: [],
        currentSite: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllSites() {
            this.loading = true;
            this.error = null;
            try {
                const sites = await siteService.getAllSites();
                this.sites = sites;
            } catch (err) {
                this.error = 'Failed to fetch sites';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async fetchSiteById(siteId: string) {
            this.loading = true;
            this.error = null;
            try {
                const site = await siteService.getSiteById(siteId);
                this.currentSite = site;
            } catch (err) {
                this.error = 'Failed to fetch site details';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async createSite(siteData: Omit<Site, 'site_id' | 'organization_id'>) {
            this.loading = true;
            this.error = null;
            try {
                const newSite = await siteService.createSite(siteData);
                this.sites.push(newSite);
            } catch (err) {
                this.error = 'Failed to create site';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async updateSite(siteId: string, siteData: Partial<Omit<Site, 'site_id' | 'organization_id'>>) {
            this.loading = true;
            this.error = null;
            try {
                const updatedSite = await siteService.updateSite(siteId, siteData);
                const index = this.sites.findIndex(site => site.site_id === siteId);
                if (index !== -1) {
                    this.sites[index] = updatedSite;
                }
            } catch (err) {
                this.error = 'Failed to update site';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async deleteSite(siteId: string) {
            this.loading = true;
            this.error = null;
            try {
                await siteService.deleteSite(siteId);
                this.sites = this.sites.filter(site => site.site_id !== siteId);
            } catch (err) {
                this.error = 'Failed to delete site';
                console.error(err);
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        getSiteById: (state) => {
            return (siteId: string) => {
                return state.sites.find(site => site.site_id === siteId) || null;
            }
        }
    }
});

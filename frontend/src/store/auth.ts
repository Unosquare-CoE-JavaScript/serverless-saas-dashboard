import { defineStore } from 'pinia';
import type { User } from '@/types';
import { isTokenExpired } from '@/modules/auth/utils'

interface AuthProps {
    accessToken: string | null
    refreshToken: string | null,
    idToken: string | null
    user: User
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthProps => ({
        accessToken: localStorage.getItem('access_token') ?? null,
        refreshToken: null,
        idToken: null,
        user: {} as User
    }),
    actions: {
        async getTokens(code: string) {
            const URL = `${import.meta.env.VITE_USER_POOL_DOMAIN}/oauth2/token`
            const params = new URLSearchParams({
                code,
                grant_type: "authorization_code",
                client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
                redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
            })
            try {
                const response = await fetch(`${URL}?${params}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                const parsedResponse = await response.json();
                this.accessToken = parsedResponse.access_token,
                this.refreshToken = parsedResponse.refresh_token,
                this.idToken = parsedResponse.id_token
                localStorage.setItem('access_token', this.accessToken!)
            } catch (error) {
                console.error(error)
            }
        },
        signOut() {
            const domain = import.meta.env.VITE_USER_POOL_DOMAIN
            const clientId = import.meta.env.VITE_OIDC_CLIENT_ID
            const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${this.loginURL}`;
            localStorage.clear()
            window.location.href = logoutUrl;
        },
        async getUserInfo() {
            try {
                const response = await fetch(`${import.meta.env.VITE_USER_POOL_DOMAIN}/oauth2/userInfo`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })
                const parsedResponse = await response.json()
                this.user.email = parsedResponse.email
                this.user.id = parsedResponse.sub,
                this.user.name = parsedResponse.name
            } catch (error) {
                console.error(error)
            }
        },
    },
    getters: {
        loginURL(): string {
            const domain = import.meta.env.VITE_USER_POOL_DOMAIN
            const params = new URLSearchParams({
                client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
                response_type: 'code',
                redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
                scope: 'email openid phone profile'
            })
            return `${domain}/login/continue?${params}`
        },
        isAuthenticated(): boolean {
            // Return true if user has valid token
            return !!this.accessToken && !isTokenExpired(this.accessToken)
        }
    }
})



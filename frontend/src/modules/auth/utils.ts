import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    if (!token) return true
    try {
        const tokenData = jwtDecode(token)
        const expirationTime = tokenData.exp * 1000 // Convert to milliseconds
        return Date.now() >= expirationTime
    } catch {
        return true
    }
}
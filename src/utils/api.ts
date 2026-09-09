// Default to production. Set an explicit empty value to use the Vite/Nginx same-origin proxy.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://api.costrict.ai').replace(/\/+$/, '')

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

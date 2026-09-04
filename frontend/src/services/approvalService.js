import { clearStoredSession, getStoredToken } from '../auth/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5203'

async function request(path, options = {}, authenticated = false) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (authenticated) {
    const token = getStoredToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (response.status === 401 && authenticated) clearStoredSession()

  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const validation = body?.errors
      ? Object.values(body.errors).flat().join(' ')
      : null
    throw new Error(validation || body?.title || body?.message || `Request failed (${response.status}).`)
  }
  return body
}

export const loginAdmin = (credentials) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })

export const submitResourceRequest = (data) =>
  request('/api/resource-addition-requests', { method: 'POST', body: JSON.stringify(data) })

export const submitSafeCentreRequest = (data) =>
  request('/api/safe-centre-addition-requests', { method: 'POST', body: JSON.stringify(data) })

export const getAdminRequests = (type, status = '') =>
  request(`/api/admin/${type}-addition-requests${status ? `?status=${encodeURIComponent(status)}` : ''}`, {}, true)

export const approveRequest = (type, id) =>
  request(`/api/admin/${type}-addition-requests/${id}/approve`, { method: 'POST' }, true)

export const rejectRequest = (type, id, reason) =>
  request(`/api/admin/${type}-addition-requests/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }, true)

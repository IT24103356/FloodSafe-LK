/**
 * Safe Centre API Service
 * Communicates with the ASP.NET Core backend at /api/safecentres
 * Member 2: Maddegoda M.V.S. | IT24101739
 */
import { clearStoredSession, getStoredToken } from '../auth/AuthContext.jsx';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5203';
const API_BASE = `${BASE_URL}/api/safecentres`;

// ── Helper ─────────────────────────────────────────────────────────────────

async function handleResponse(response) {
  if (response.status === 401) clearStoredSession();
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'object') {
        const messages = Object.values(errorData)
          .flat()
          .filter(Boolean);
        if (messages.length > 0) errorMessage = messages.join(' ');
      }
    } catch {
      // Response body not JSON — keep default message
    }
    throw new Error(errorMessage);
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

function adminHeaders() {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── GET ALL (with optional filters) ───────────────────────────────────────
/**
 * Fetches all safe centres, optionally filtered by search term, district, availability.
 * @param {{ search?: string, district?: string, availability?: boolean }} filters
 */
export async function getSafeCentres({ search = '', district = '', availability = null } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (district) params.set('district', district);
  if (availability !== null) params.set('availability', String(availability));

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;

  try {
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    if (error.message.startsWith('HTTP') || error.message.startsWith('Failed')) throw error;
    throw new Error('Network error: Could not reach the server. Is the API running?');
  }
}

// ── GET BY ID ──────────────────────────────────────────────────────────────
/**
 * Fetches a single safe centre by its ID.
 * @param {number} id
 */
export async function getSafeCentreById(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    return await handleResponse(response);
  } catch (error) {
    if (error.message.startsWith('HTTP') || error.message.startsWith('Failed')) throw error;
    throw new Error('Network error: Could not reach the server.');
  }
}

// ── CREATE ─────────────────────────────────────────────────────────────────
/**
 * Creates a new safe centre.
 * @param {object} data
 */
export async function createSafeCentre(data) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.message.startsWith('HTTP') || error.message.startsWith('Failed')) throw error;
    throw new Error('Network error: Could not reach the server.');
  }
}

// ── UPDATE ─────────────────────────────────────────────────────────────────
/**
 * Updates an existing safe centre.
 * @param {number} id
 * @param {object} data
 */
export async function updateSafeCentre(id, data) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.message.startsWith('HTTP') || error.message.startsWith('Failed')) throw error;
    throw new Error('Network error: Could not reach the server.');
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────
/**
 * Deletes a safe centre permanently.
 * @param {number} id
 */
export async function deleteSafeCentre(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.message.startsWith('HTTP') || error.message.startsWith('Failed')) throw error;
    throw new Error('Network error: Could not reach the server.');
  }
}

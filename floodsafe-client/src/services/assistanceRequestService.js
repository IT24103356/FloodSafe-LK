import axios from 'axios';

const API_BASE = '/api/assistancerequests';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error normalisation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

/**
 * Get all assistance requests with optional filters.
 * @param {Object} params - { search, district, requestType, priority, status }
 */
export async function getAssistanceRequests(params = {}) {
  const response = await api.get(API_BASE, { params });
  return response.data;
}

/**
 * Get a single assistance request by ID.
 * @param {number} id
 */
export async function getAssistanceRequestById(id) {
  const response = await api.get(`${API_BASE}/${id}`);
  return response.data;
}

/**
 * Create a new assistance request.
 * @param {Object} data - CreateAssistanceRequestDto fields
 */
export async function createAssistanceRequest(data) {
  const response = await api.post(API_BASE, data);
  return response.data;
}

/**
 * Update an existing assistance request.
 * @param {number} id
 * @param {Object} data - UpdateAssistanceRequestDto fields
 */
export async function updateAssistanceRequest(id, data) {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
}

/**
 * Delete an assistance request by ID.
 * @param {number} id
 */
export async function deleteAssistanceRequest(id) {
  const response = await api.delete(`${API_BASE}/${id}`);
  return response.data;
}

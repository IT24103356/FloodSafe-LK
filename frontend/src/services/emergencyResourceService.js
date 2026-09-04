/**
 * emergencyResourceService.js
 * API service layer for Emergency Resource Management.
 * 
 * Author: Mamalgaha I.G.W.S. (IT24102615)
 * All functions communicate with the ASP.NET Core REST API.
 */

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5203";
const BASE_URL = `${API_BASE}/api/emergencyresources`;

// Axios instance with base config
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 second timeout
});

// ── Error Helper ──────────────────────────────────────────────────────────────
/**
 * Extracts a user-friendly error message from an Axios error.
 * Handles validation errors (400), not found (404), and network errors.
 */
const extractError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 400) {
      // Validation errors — flatten modelState
      if (data.errors) {
        const messages = Object.values(data.errors).flat();
        return messages.join(" | ");
      }
      return data.message || "Validation failed. Please check your inputs.";
    }
    if (status === 404) return data.message || "Resource not found.";
    if (status === 500) return "Server error. Please try again later.";
    return `Unexpected error (${status}).`;
  }
  if (error.request) return "Network error — cannot reach the server. Is the API running?";
  return error.message || "Unknown error occurred.";
};

// ── CREATE ────────────────────────────────────────────────────────────────────
/**
 * Creates a new emergency resource.
 * @param {Object} resourceData - CreateEmergencyResourceDto fields
 * @returns {Promise<Object>} Created EmergencyResourceDto
 */
export const createEmergencyResource = async (resourceData) => {
  try {
    const response = await api.post("/", resourceData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: extractError(error) };
  }
};

// ── READ ALL (with filters) ───────────────────────────────────────────────────
/**
 * Fetches all emergency resources with optional filters.
 * @param {Object} filters - { search, district, resourceType, status }
 * @returns {Promise<Object>} Array of EmergencyResourceDto
 */
export const getEmergencyResources = async (filters = {}) => {
  try {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.district) params.district = filters.district;
    if (filters.resourceType) params.resourceType = filters.resourceType;
    if (filters.status) params.status = filters.status;

    const response = await api.get("/", { params });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: extractError(error) };
  }
};

// ── READ BY ID ────────────────────────────────────────────────────────────────
/**
 * Fetches a single emergency resource by ID.
 * @param {number} id
 * @returns {Promise<Object>} EmergencyResourceDto
 */
export const getEmergencyResourceById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: extractError(error) };
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
/**
 * Updates an existing resource (quantity, status, location, minRequired, notes).
 * @param {number} id
 * @param {Object} updateData - UpdateEmergencyResourceDto fields
 * @returns {Promise<Object>} Updated EmergencyResourceDto
 */
export const updateEmergencyResource = async (id, updateData) => {
  try {
    const response = await api.put(`/${id}`, updateData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: extractError(error) };
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
/**
 * Permanently deletes an emergency resource by ID.
 * @param {number} id
 * @returns {Promise<Object>} { success: boolean, error: string|null }
 */
export const deleteEmergencyResource = async (id) => {
  try {
    await api.delete(`/${id}`);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
};

// ── CONSTANTS (shared with components) ───────────────────────────────────────
export const RESOURCE_TYPES = [
  "Drinking Water",
  "Food",
  "First Aid",
  "Blankets",
  "Hygiene Kits",
  "Flashlights",
  "Other",
];

export const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

export const RESOURCE_STATUSES = ["Available", "Low Stock", "Depleted", "Reserved"];

export const RESOURCE_TYPE_ICONS = {
  "Drinking Water": "💧",
  "Food":           "🍱",
  "First Aid":      "🩺",
  "Blankets":       "🛏️",
  "Hygiene Kits":   "🧴",
  "Flashlights":    "🔦",
  "Other":          "📦",
};

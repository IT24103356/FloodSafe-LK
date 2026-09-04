/**
 * EmergencyResources.jsx
 * Main page for Emergency Resource Management.
 * 
 * Features:
 *  - Resource grid with cards
 *  - Search (name, location, notes)
 *  - Filters: District, ResourceType, Status
 *  - Add / Edit / Delete with confirmation
 *  - Detail side drawer
 *  - Toast notifications
 *  - Stats summary bar
 *
 * Author: Mamalgaha I.G.W.S. (IT24102615)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import "./EmergencyResources.css";
import ResourceCard    from "../components/ResourceCard";
import ResourceForm    from "../components/ResourceForm";
import ResourceDetails from "../components/ResourceDetails";
import {
  getEmergencyResources,
  deleteEmergencyResource,
  RESOURCE_TYPES,
  SRI_LANKA_DISTRICTS,
  RESOURCE_STATUSES,
} from "../services/emergencyResourceService";

// ── Toast Hook ────────────────────────────────────────────────────────────────
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    setToasts(prev => [...prev, { id, message, type }]);
    const timeoutId = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timers.current.delete(id);
    }, 4000);
    timers.current.set(id, timeoutId);
  }, []);

  return { toasts, addToast };
};

// ── Stats Calculator ──────────────────────────────────────────────────────────
const calcStats = (resources) => ({
  total:     resources.length,
  available: resources.filter(r => !r.isLowStock && r.status !== "Depleted" && r.status !== "Reserved").length,
  lowStock:  resources.filter(r => r.isLowStock && r.status !== "Depleted").length,
  depleted:  resources.filter(r => r.status === "Depleted").length,
  reserved:  resources.filter(r => r.status === "Reserved").length,
});

// ── Main Component ────────────────────────────────────────────────────────────
const EmergencyResources = () => {
  const [resources,    setResources]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [stats,        setStats]        = useState({ total: 0, available: 0, lowStock: 0, depleted: 0, reserved: 0 });

  // Filters
  const [search,       setSearch]       = useState("");
  const [districtFlt,  setDistrictFlt]  = useState("");
  const [typeFlt,      setTypeFlt]      = useState("");
  const [statusFlt,    setStatusFlt]    = useState("");

  // Modals
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);   // resource being edited
  const [viewTarget,   setViewTarget]   = useState(null);   // resource detail drawer
  const [deleteTarget, setDeleteTarget] = useState(null);   // resource being deleted
  const [deleting,     setDeleting]     = useState(false);

  const { toasts, addToast } = useToast();
  const searchTimeout = useRef(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchResources = useCallback(async (filters = {}) => {
    setLoading(true);
    setError("");
    const { data, error: err } = await getEmergencyResources(filters);
    if (err) {
      setError(err);
      setResources([]);
      setStats({ total: 0, available: 0, lowStock: 0, depleted: 0, reserved: 0 });
    } else {
      setResources(data);
      setStats(calcStats(data));
    }
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => { fetchResources(); }, [fetchResources]);

  // Debounced search + filter
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchResources({
        search:       search       || undefined,
        district:     districtFlt  || undefined,
        resourceType: typeFlt      || undefined,
        status:       statusFlt    || undefined,
      });
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search, districtFlt, typeFlt, statusFlt, fetchResources]);

  const hasFilters = search || districtFlt || typeFlt || statusFlt;

  const clearFilters = () => {
    setSearch("");
    setDistrictFlt("");
    setTypeFlt("");
    setStatusFlt("");
  };

  // ── CRUD Handlers ─────────────────────────────────────────────────────────
  const handleFormSuccess = (saved, action) => {
    setShowForm(false);
    setEditTarget(null);
    addToast(`✓ Resource "${saved.resourceName}" ${action} successfully!`, "success");
    fetchResources({
      search: search || undefined,
      district: districtFlt || undefined,
      resourceType: typeFlt || undefined,
      status: statusFlt || undefined,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { success, error: err } = await deleteEmergencyResource(deleteTarget.id);
    setDeleting(false);

    if (err) {
      addToast(`⚠ Delete failed: ${err}`, "error");
    } else {
      addToast(`🗑 "${deleteTarget.resourceName}" deleted.`, "info");
      setDeleteTarget(null);
      fetchResources({
        search: search || undefined,
        district: districtFlt || undefined,
        resourceType: typeFlt || undefined,
        status: statusFlt || undefined,
      });
    }
  };

  const openEdit = (resource) => {
    setEditTarget(resource);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="er-page">

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <header className="er-hero">
        <div className="er-hero-content">
          <div className="er-hero-text">
            <h1>🆘 Emergency Resource Management</h1>
            <p>FloodSafe LK — Track, monitor, and manage emergency resources across Sri Lanka</p>
          </div>
          <button
            id="btn-add-resource"
            className="btn-add-resource"
            onClick={openCreate}
          >
            ➕ Add Resource
          </button>
        </div>
      </header>

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <div className="er-stats">
        <div className="stat-chip">
          <span className="stat-chip-icon">📦</span>
          <div className="stat-chip-info">
            <span className="stat-chip-value">{stats.total}</span>
            <span className="stat-chip-label">Total Resources</span>
          </div>
        </div>
        <div className="stat-chip stat-available">
          <span className="stat-chip-icon">✅</span>
          <div className="stat-chip-info">
            <span className="stat-chip-value">{stats.available}</span>
            <span className="stat-chip-label">Available</span>
          </div>
        </div>
        <div className="stat-chip stat-lowstock">
          <span className="stat-chip-icon">⚠</span>
          <div className="stat-chip-info">
            <span className="stat-chip-value">{stats.lowStock}</span>
            <span className="stat-chip-label">Low Stock</span>
          </div>
        </div>
        <div className="stat-chip stat-depleted">
          <span className="stat-chip-icon">🔴</span>
          <div className="stat-chip-info">
            <span className="stat-chip-value">{stats.depleted}</span>
            <span className="stat-chip-label">Depleted</span>
          </div>
        </div>
        <div className="stat-chip">
          <span className="stat-chip-icon">🟣</span>
          <div className="stat-chip-info">
            <span className="stat-chip-value">{stats.reserved}</span>
            <span className="stat-chip-label">Reserved</span>
          </div>
        </div>
      </div>

      {/* ── Filter / Search Bar ─────────────────────────────────────────── */}
      <div className="er-controls">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search resources, locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search resources"
          />
        </div>

        <select
          id="filter-district"
          className="filter-select"
          value={districtFlt}
          onChange={e => setDistrictFlt(e.target.value)}
          aria-label="Filter by district"
        >
          <option value="">All Districts</option>
          {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          id="filter-type"
          className="filter-select"
          value={typeFlt}
          onChange={e => setTypeFlt(e.target.value)}
          aria-label="Filter by resource type"
        >
          <option value="">All Types</option>
          {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          id="filter-status"
          className="filter-select"
          value={statusFlt}
          onChange={e => setStatusFlt(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {RESOURCE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {hasFilters && (
          <button
            id="btn-clear-filters"
            className="btn-clear-filters"
            onClick={clearFilters}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="er-content">

        {/* Results Count */}
        {!loading && !error && (
          <div className="er-results-count">
            {resources.length === 0
              ? "No resources found."
              : `Showing ${resources.length} resource${resources.length !== 1 ? "s" : ""}${hasFilters ? " (filtered)" : ""}`}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="er-loading" aria-live="polite">
            <div className="loading-spinner" />
            <span>Loading emergency resources...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="er-error" role="alert">
            ⚠ {error}
            <br />
            <button
              style={{ marginTop: "0.75rem", background: "none", border: "none", color: "#93c5fd", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => fetchResources()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && resources.length === 0 && (
          <div className="er-empty">
            <div className="er-empty-icon">📦</div>
            <h3>No resources found</h3>
            <p>
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Click \"Add Resource\" to register the first emergency resource."}
            </p>
          </div>
        )}

        {/* Resource Grid */}
        {!loading && !error && resources.length > 0 && (
          <div className="resource-grid" id="resource-grid">
            {resources.map(r => (
              <ResourceCard
                key={r.id}
                resource={r}
                onView={setViewTarget}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}

      </main>

      {/* ── Modals ──────────────────────────────────────────────────────── */}

      {/* Create / Edit Form */}
      {showForm && (
        <ResourceForm
          resource={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Detail Drawer */}
      {viewTarget && (
        <ResourceDetails
          resource={viewTarget}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="confirm-dialog" id="delete-confirm-dialog">
            <div className="confirm-icon">🗑️</div>
            <h2 className="confirm-title" id="confirm-title">Delete Resource</h2>
            <p className="confirm-message">
              Are you sure you want to permanently delete{" "}
              <span className="confirm-resource-name">"{deleteTarget.resourceName}"</span>?
              <br />This action <strong>cannot be undone</strong> and will remove it from PostgreSQL.
            </p>
            <div className="confirm-buttons">
              <button
                id="btn-confirm-cancel"
                className="btn-confirm-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete"
                className="btn-confirm-delete"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting
                  ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} /> Deleting...</>
                  : "🗑 Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notifications ─────────────────────────────────────────── */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            {t.message}
          </div>
        ))}
      </div>

    </div>
  );
};

export default EmergencyResources;

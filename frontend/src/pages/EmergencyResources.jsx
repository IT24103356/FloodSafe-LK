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
import { AlertTriangle, Boxes, CheckCircle2, PackagePlus, Search, Send, ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./EmergencyResources.css";
import ResourceCard    from "../components/ResourceCard";
import ResourceForm    from "../components/ResourceForm";
import ResourceDetails from "../components/ResourceDetails";
import { EmptyState, ErrorState, LoadingState, PageHeader, StatCard } from "../components/common/UIComponents";
import { useToast } from "../components/common/ToastProvider";
import {
  getEmergencyResources,
  deleteEmergencyResource,
  RESOURCE_TYPES,
  SRI_LANKA_DISTRICTS,
  RESOURCE_STATUSES,
} from "../services/emergencyResourceService";

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
  const auth = useAuth();
  const navigate = useNavigate();
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

  const { showToast: addToast } = useToast();
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
    const { error: err } = await deleteEmergencyResource(deleteTarget.id);
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

      <PageHeader
        eyebrow="Emergency inventory"
        title="Emergency resources"
        icon={Boxes}
        description="Browse approved supplies, locations, quantities, and current stock conditions."
        actions={<button
            id="btn-add-resource"
            className="fs-button primary"
            onClick={() => auth.isAdmin ? openCreate() : navigate("/request-resource")}
          >
            {auth.isAdmin ? <PackagePlus size={17} /> : <Send size={17} />}
            {auth.isAdmin ? "Add Resource" : "Request - Add Resource"}
          </button>}
      />

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <div className="fs-stats-grid">
        <StatCard icon={Boxes} label="Total resources" value={stats.total} />
        <StatCard icon={CheckCircle2} label="Available" value={stats.available} tone="success" />
        <StatCard icon={AlertTriangle} label="Low stock" value={stats.lowStock} tone="warning" />
        <StatCard icon={ShieldAlert} label="Depleted" value={stats.depleted} tone="danger" detail={`${stats.reserved} reserved`} />
      </div>

      {/* ── Filter / Search Bar ─────────────────────────────────────────── */}
      <div className="er-controls">
        <div className="search-wrapper">
          <span className="search-icon"><Search size={17} aria-hidden="true" /></span>
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
            <X size={16} /> Clear filters
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
          <LoadingState label="Loading emergency inventory…" cards={4} />
        )}

        {/* Error */}
        {!loading && error && (
          <ErrorState message="Emergency resource records could not be loaded." onRetry={() => fetchResources()} />
        )}

        {/* Empty State */}
        {!loading && !error && resources.length === 0 && (
          <EmptyState
            icon={Boxes}
            title="No emergency resources found"
            message={hasFilters ? "Try adjusting the search or stock filters." : "Approved resource records will appear here."}
          />
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
                canManage={auth.isAdmin}
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
          canManage={auth.isAdmin}
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

    </div>
  );
};

export default EmergencyResources;

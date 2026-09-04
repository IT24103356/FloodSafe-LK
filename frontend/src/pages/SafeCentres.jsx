/**
 * SafeCentresPage — main page orchestrating all Safe Centre UI
 * Handles: listing, search/filter, create, view, edit, delete, toast notifications
 * Author: Maddegoda M.V.S. | IT24101739
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Building2, DoorOpen, Plus, Send, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import SafeCentreCard from '../components/SafeCentreCard.jsx';
import SafeCentreFilters from '../components/SafeCentreFilters.jsx';
import SafeCentreForm from '../components/SafeCentreForm.jsx';
import SafeCentreDetails from '../components/SafeCentreDetails.jsx';
import { EmptyState, ErrorState, LoadingState, PageHeader, StatCard } from '../components/common/UIComponents.jsx';
import { useToast } from '../components/common/ToastProvider.jsx';
import {
  getSafeCentres,
  createSafeCentre,
  updateSafeCentre,
  deleteSafeCentre,
} from '../services/safeCentreService.js';
import '../styles/safecentres.css';

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ centre, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-box narrow" id="sc-confirm-modal">
        <div className="modal-header">
          <h2 id="confirm-title" className="modal-title">Confirm Delete</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Cancel">✕</button>
        </div>
        <div className="modal-body">
          <div className="confirm-icon">🗑</div>
          <p className="confirm-text">
            Are you sure you want to permanently delete{' '}
            <span className="confirm-name">"{centre.name}"</span>?
            <br />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
              This action cannot be undone and will remove the record from the database.
            </span>
          </p>
        </div>
        <div className="modal-footer">
          <button id="btn-confirm-cancel" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button id="btn-confirm-delete" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Deleting…</>
              : '🗑 Yes, Delete'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function SafeCentresPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [filters, setFilters] = useState({ search: '', district: '', availability: '' });

  // Modal states
  const [viewCentre, setViewCentre]     = useState(null);
  const [editCentre, setEditCentre]     = useState(null);  // null = closed, {} = create, {id,...} = edit
  const [deleteCentre, setDeleteCentre] = useState(null);

  const { showToast: addToast } = useToast();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchCentres = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const avail = filters.availability === '' ? null
        : filters.availability === 'true' ? true : false;

      const data = await getSafeCentres({
        search: filters.search,
        district: filters.district,
        availability: avail,
      });
      setCentres(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchCentres, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchCentres]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCentres = centres.length;
  const openCentres  = centres.filter(c => c.availability).length;
  const totalCap     = centres.reduce((s, c) => s + c.capacity, 0);
  const totalOcc     = centres.reduce((s, c) => s + c.currentOccupancy, 0);
  const totalFree    = centres.reduce((s, c) => s + c.availableSpaces, 0);

  // ── CREATE ────────────────────────────────────────────────────────────────
  async function handleCreate(payload) {
    setFormLoading(true);
    try {
      await createSafeCentre(payload);
      setEditCentre(null);
      addToast('✅ Safe centre created successfully!');
      fetchCentres();
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setFormLoading(false);
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async function handleUpdate(payload) {
    setFormLoading(true);
    try {
      await updateSafeCentre(editCentre.id, payload);
      setEditCentre(null);
      addToast('✅ Safe centre updated successfully!');
      fetchCentres();
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setFormLoading(false);
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteSafeCentre(deleteCentre.id);
      setDeleteCentre(null);
      addToast('✅ Safe centre deleted.');
      fetchCentres();
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error');
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Modals */}
      {viewCentre && (
        <SafeCentreDetails
          centre={viewCentre}
          onClose={() => setViewCentre(null)}
          onEdit={c => { setViewCentre(null); setEditCentre(c); }}
          onDelete={c => { setViewCentre(null); setDeleteCentre(c); }}
          canManage={auth.isAdmin}
        />
      )}

      {editCentre !== null && (
        <SafeCentreForm
          initial={editCentre}
          onSubmit={editCentre.id ? handleUpdate : handleCreate}
          onCancel={() => setEditCentre(null)}
          loading={formLoading}
        />
      )}

      {deleteCentre && (
        <ConfirmDialog
          centre={deleteCentre}
          onConfirm={handleDelete}
          onCancel={() => setDeleteCentre(null)}
          loading={deleteLoading}
        />
      )}

      {/* Page content */}
      <div className="page-wrapper">
        <PageHeader
          eyebrow="Shelter network"
          title="Safe centres"
          icon={Building2}
          description="Find approved flood shelters, current capacity, facilities, and contact information."
          actions={<button
            id="btn-add-centre"
            className="fs-button primary"
            onClick={() => auth.isAdmin ? setEditCentre({}) : navigate('/request-safe-centre')}
          >
            {auth.isAdmin ? <Plus size={17} /> : <Send size={17} />}
            {auth.isAdmin ? 'Add Safe Centre' : 'Request - Add Safe Centre'}
          </button>}
        />

        {/* Filters */}
        <SafeCentreFilters filters={filters} onChange={setFilters} />

        {/* Stats bar */}
        {!loading && !apiError && (
          <div className="fs-stats-grid">
            <StatCard icon={Building2} label="Total centres" value={totalCentres} />
            <StatCard icon={DoorOpen} label="Open centres" value={openCentres} tone="success" />
            <StatCard icon={Users} label="Total capacity" value={totalCap.toLocaleString()} detail={`${totalOcc.toLocaleString()} occupied`} />
            <StatCard icon={DoorOpen} label="Available spaces" value={totalFree.toLocaleString()} tone="secondary" />
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <ErrorState message="Safe-centre information could not be loaded." onRetry={fetchCentres} />
        )}

        {/* Loading */}
        {loading && (
          <LoadingState label="Loading approved safe centres…" cards={4} />
        )}

        {/* Empty state */}
        {!loading && !apiError && centres.length === 0 && (
          <EmptyState icon={Building2} title="No safe centres found" message="Try adjusting the search or availability filters." />
        )}

        {/* Cards grid */}
        {!loading && !apiError && centres.length > 0 && (
          <div className="centres-grid" id="centres-grid">
            {centres.map(centre => (
              <SafeCentreCard
                key={centre.id}
                centre={centre}
                onView={setViewCentre}
                onEdit={setEditCentre}
                onDelete={setDeleteCentre}
                canManage={auth.isAdmin}
              />
            ))}
          </div>
        )}
      </div>

    </>
  );
}

export default SafeCentresPage;

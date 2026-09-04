/**
 * SafeCentresPage — main page orchestrating all Safe Centre UI
 * Handles: listing, search/filter, create, view, edit, delete, toast notifications
 * Author: Maddegoda M.V.S. | IT24101739
 */
import React, { useState, useEffect, useCallback } from 'react';
import SafeCentreCard from '../components/SafeCentreCard.jsx';
import SafeCentreFilters from '../components/SafeCentreFilters.jsx';
import SafeCentreForm from '../components/SafeCentreForm.jsx';
import SafeCentreDetails from '../components/SafeCentreDetails.jsx';
import {
  getSafeCentres,
  createSafeCentre,
  updateSafeCentre,
  deleteSafeCentre,
} from '../services/safeCentreService.js';
import '../styles/safecentres.css';

// ── Toast helper ─────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return { toasts, addToast };
}

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

  const { toasts, addToast } = useToasts();

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
        {/* Hero */}
        <section className="page-hero">
          <h1>🏠 Safe Centre Management</h1>
          <p>
            Manage flood safe centres across Sri Lanka — track capacity, availability,
            and facilities in real time.
          </p>
        </section>

        {/* Add button */}
        <div className="page-actions">
          <button
            id="btn-add-centre"
            className="btn btn-primary"
            onClick={() => setEditCentre({})}
          >
            ➕ Add Safe Centre
          </button>
        </div>

        {/* Filters */}
        <SafeCentreFilters filters={filters} onChange={setFilters} />

        {/* Stats bar */}
        {!loading && !apiError && (
          <div className="stats-bar">
            <div className="stat-chip">Total <span className="chip-val">{totalCentres}</span></div>
            <div className="stat-chip">Open <span className="chip-val" style={{ color: '#34d399' }}>{openCentres}</span></div>
            <div className="stat-chip">Total Capacity <span className="chip-val">{totalCap.toLocaleString()}</span></div>
            <div className="stat-chip">Occupied <span className="chip-val">{totalOcc.toLocaleString()}</span></div>
            <div className="stat-chip">Available Spaces <span className="chip-val" style={{ color: 'var(--clr-primary-light)' }}>{totalFree.toLocaleString()}</span></div>
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="alert error" role="alert">
            ⛔ {apiError}
            <button
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              onClick={fetchCentres}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-wrap" aria-live="polite">
            <div className="spinner" />
            <span>Loading safe centres…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !apiError && centres.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <div className="empty-title">No safe centres found</div>
            <p>Try adjusting your search or filters, or add a new centre.</p>
          </div>
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Toasts */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`} role="alert">
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default SafeCentresPage;

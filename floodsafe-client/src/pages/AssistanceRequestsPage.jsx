import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import AssistanceCard from '../components/AssistanceCard';
import AssistanceForm from '../components/AssistanceForm';
import AssistanceDetails from '../components/AssistanceDetails';
import {
  getAssistanceRequests,
  deleteAssistanceRequest,
} from '../services/assistanceRequestService';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function AssistanceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', district: '', requestType: '', priority: '', status: '' });

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.district) params.district = filters.district;
      if (filters.requestType) params.requestType = filters.requestType;
      if (filters.priority) params.priority = filters.priority;
      if (filters.status) params.status = filters.status;
      const data = await getAssistanceRequests(params);
      setRequests(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    const timer = setTimeout(fetchRequests, 300);
    return () => clearTimeout(timer);
  }, [fetchRequests]);

  const handleFormSuccess = (saved, isEdit) => {
    setShowForm(false);
    setEditTarget(null);
    addToast(isEdit ? 'Request updated successfully.' : 'Assistance request submitted!', 'success');
    fetchRequests();
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteAssistanceRequest(confirmDelete.id);
      setConfirmDelete(null);
      addToast('Request deleted successfully.', 'success');
      fetchRequests();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Stats
  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Pending').length;
  const inProgress = requests.filter(r => r.status === 'InProgress').length;
  const resolved = requests.filter(r => r.status === 'Resolved').length;
  const critical = requests.filter(r => r.priority === 'Critical').length;

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <div className="app-logo-icon">🌊</div>
            <div>
              <span className="app-logo-text">FloodSafe LK</span>
              <span className="app-logo-sub">Community Assistance Platform</span>
            </div>
          </div>
          <div className="student-badge">
            <strong>IT24102706</strong> · Priyadarshani G.P.S.D.
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero */}
        <div className="page-hero">
          <div>
            <h1 className="page-hero-title">🆘 Assistance Requests</h1>
            <p className="page-hero-sub">Community flood assistance request management — Sri Lanka</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="sample-notice">⚠ Sample data is clearly labelled</div>
            <button
              id="btn-new-request"
              className="btn btn-primary"
              onClick={() => { setEditTarget(null); setShowForm(true); }}
            >
              + New Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#f0f6ff' }}>{total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--pending)' }}>{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--inprogress)' }}>{inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--resolved)' }}>{resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--critical)' }}>{critical}</div>
            <div className="stat-label">Critical</div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Results */}
        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /></div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No requests found</div>
            <p>Try adjusting your filters or submit a new assistance request.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {requests.map((req) => (
              <AssistanceCard
                key={req.id}
                request={req}
                onView={() => setDetailTarget(req)}
                onEdit={() => { setEditTarget(req); setShowForm(true); }}
                onDelete={() => setConfirmDelete(req)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">{editTarget ? '✏️ Edit Request' : '🆘 New Assistance Request'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <AssistanceForm
              initial={editTarget}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailTarget && (
        <AssistanceDetails
          request={detailTarget}
          onClose={() => setDetailTarget(null)}
          onEdit={() => { setEditTarget(detailTarget); setDetailTarget(null); setShowForm(true); }}
          onDelete={() => { setConfirmDelete(detailTarget); setDetailTarget(null); }}
          onStatusUpdated={() => { setDetailTarget(null); fetchRequests(); addToast('Status updated.', 'success'); }}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal-box confirm-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Delete</h2>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="confirm-icon">🗑️</div>
              <p className="confirm-text">
                Are you sure you want to delete the request from{' '}
                <strong>{confirmDelete.requesterName}</strong>?<br />
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                id="btn-confirm-delete"
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deletingId === confirmDelete.id}
              >
                {deletingId === confirmDelete.id ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}

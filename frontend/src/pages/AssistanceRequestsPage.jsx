import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, HandHeart, ListChecks, Plus, Timer, UsersRound } from 'lucide-react';
import FilterBar from '../components/AssistanceFilterBar';
import AssistanceCard from '../components/AssistanceCard';
import AssistanceForm from '../components/AssistanceForm';
import AssistanceDetails from '../components/AssistanceDetails';
import { EmptyState, LoadingState, PageHeader, StatCard } from '../components/common/UIComponents.jsx';
import { useToast } from '../components/common/ToastProvider.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import {
  getAssistanceRequests,
  deleteAssistanceRequest,
} from '../services/assistanceRequestService';
import '../styles/assistance.css';

export default function AssistanceRequestsPage() {
  const auth = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', district: '', requestType: '', priority: '', status: '' });

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { showToast: addToast } = useToast();

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
      <div className="main-content">
        <PageHeader
          eyebrow="Community support"
          title="Assistance requests"
          icon={HandHeart}
          description="Coordinate food, water, medical support, transport, evacuation, and shelter needs."
          actions={<button
              id="btn-new-request"
              className="fs-button primary"
              onClick={() => { setEditTarget(null); setShowForm(true); }}
            >
              <Plus size={17} /> New request
            </button>}
        />

        {/* Stats */}
        <div className="fs-stats-grid">
          <StatCard icon={ListChecks} label="Total requests" value={total} />
          <StatCard icon={Timer} label="Pending" value={pending} tone="warning" detail={`${inProgress} in progress`} />
          <StatCard icon={UsersRound} label="Resolved" value={resolved} tone="success" />
          <StatCard icon={AlertTriangle} label="Critical priority" value={critical} tone="danger" />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Results */}
        {loading ? (
          <LoadingState label="Loading community assistance requests…" cards={4} />
        ) : requests.length === 0 ? (
          <EmptyState icon={HandHeart} title="No assistance requests found" message="Try adjusting the filters or submit a new request." />
        ) : (
          <div className="cards-grid">
            {requests.map((req) => (
              <AssistanceCard
                key={req.id}
                request={req}
                canManage={auth.isAdmin}
                onView={() => setDetailTarget(req)}
                onEdit={() => { setEditTarget(req); setShowForm(true); }}
                onDelete={() => setConfirmDelete(req)}
              />
            ))}
          </div>
        )}
      </div>

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
          canManage={auth.isAdmin}
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
    </div>
  );
}

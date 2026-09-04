import React, { useState } from 'react';
import { CheckCircle2, Clock3, Edit3, Settings2, Trash2, X } from 'lucide-react';
import { updateAssistanceRequest } from '../services/assistanceRequestService';

function statusLabel(s) { return s === 'InProgress' ? 'In Progress' : s; }
function statusClass(s) {
  if (s === 'InProgress') return 'badge badge-inprogress';
  return `badge badge-${s?.toLowerCase()}`;
}
function priorityClass(p) { return `badge badge-${p?.toLowerCase()}`; }
function formatDate(dt) {
  return new Date(dt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
}

const STATUSES = ['Pending', 'InProgress', 'Resolved'];
const STATUS_ICONS = { Pending: Clock3, InProgress: Settings2, Resolved: CheckCircle2 };

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value ?? '—'}</span>
    </div>
  );
}

export default function AssistanceDetails({ request, canManage = false, onClose, onEdit, onDelete, onStatusUpdated }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');

  const handleStatusChange = async (newStatus) => {
    if (newStatus === request.status) return;
    setUpdatingStatus(true);
    setStatusError('');
    try {
      await updateAssistanceRequest(request.id, { status: newStatus });
      onStatusUpdated();
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Request Details</h2>
          </div>
          <button className="modal-close" id={`btn-close-detail-${request.id}`} onClick={onClose} aria-label="Close details"><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span className={priorityClass(request.priority)}>{request.priority} Priority</span>
            <span className={statusClass(request.status)}>{statusLabel(request.status)}</span>
            <span className="badge badge-type">{request.requestType}</span>
          </div>

          {/* Info Grid */}
          <div className="detail-grid">
            <DetailItem label="Request ID" value={`#${request.id}`} />
            <DetailItem label="Requester Name" value={request.requesterName} />
            <DetailItem label="Phone" value={request.phone} />
            <DetailItem label="District" value={request.district} />
            <DetailItem label="Location" value={request.location} />
            <DetailItem label="People Affected" value={`${request.numberOfPeople} ${request.numberOfPeople === 1 ? 'person' : 'people'}`} />
            <DetailItem label="Created" value={formatDate(request.createdAt)} />
            <DetailItem label="Last Updated" value={formatDate(request.updatedAt)} />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.4rem' }}>Description</div>
            <div className="detail-desc">{request.description}</div>
          </div>

          {/* Admin-only status workflow */}
          {canManage && (
            <div style={{ marginTop: '1.25rem' }}>
              <div className="detail-label" style={{ marginBottom: '0.65rem' }}>Update Status</div>
              <div className="status-workflow">
                {STATUSES.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="workflow-step">
                      {(() => {
                        const StatusIcon = STATUS_ICONS[s];
                        return (
                          <button
                            id={`btn-status-${s.toLowerCase()}-${request.id}`}
                            className={`btn btn-sm ${request.status === s ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => handleStatusChange(s)}
                            disabled={updatingStatus || request.status === s}
                            style={request.status === s ? { opacity: 1 } : {}}
                          >
                            <StatusIcon size={15} /> {statusLabel(s)}
                          </button>
                        );
                      })()}
                    </div>
                    {i < STATUSES.length - 1 && <span className="workflow-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
              {statusError && <p className="form-error" style={{ marginTop: '0.5rem' }}>⚠ {statusError}</p>}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {canManage && (
            <button className="btn btn-danger btn-sm" id={`btn-detail-delete-${request.id}`} onClick={onDelete}><Trash2 size={16} /> Delete</button>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {canManage && (
            <button className="btn btn-primary" id={`btn-detail-edit-${request.id}`} onClick={onEdit}><Edit3 size={16} /> Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

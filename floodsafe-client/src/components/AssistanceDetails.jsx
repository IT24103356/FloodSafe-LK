import React, { useState } from 'react';
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

export default function AssistanceDetails({ request, onClose, onEdit, onDelete, onStatusUpdated }) {
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

  const D = ({ label, value }) => (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value ?? '—'}</span>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Request Details</h2>
            {request.isSample && (
              <span className="badge badge-sample" style={{ marginTop: 4, display: 'inline-flex' }}>⚠ DEMO / SAMPLE DATA</span>
            )}
          </div>
          <button className="modal-close" id={`btn-close-detail-${request.id}`} onClick={onClose}>✕</button>
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
            <D label="Request ID" value={`#${request.id}`} />
            <D label="Requester Name" value={request.requesterName} />
            <D label="Phone" value={request.phone} />
            <D label="District" value={request.district} />
            <D label="Location" value={request.location} />
            <D label="People Affected" value={`${request.numberOfPeople} ${request.numberOfPeople === 1 ? 'person' : 'people'}`} />
            <D label="Created" value={formatDate(request.createdAt)} />
            <D label="Last Updated" value={formatDate(request.updatedAt)} />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.4rem' }}>Description</div>
            <div className="detail-desc">{request.description}</div>
          </div>

          {/* Status Workflow */}
          <div style={{ marginTop: '1.25rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.65rem' }}>Update Status</div>
            <div className="status-workflow">
              {STATUSES.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="workflow-step">
                    <button
                      id={`btn-status-${s.toLowerCase()}-${request.id}`}
                      className={`btn btn-sm ${request.status === s ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleStatusChange(s)}
                      disabled={updatingStatus || request.status === s}
                      style={request.status === s ? { opacity: 1 } : {}}
                    >
                      {s === 'Pending' ? '⏳' : s === 'InProgress' ? '⚙️' : '✅'} {statusLabel(s)}
                    </button>
                  </div>
                  {i < STATUSES.length - 1 && <span className="workflow-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
            {statusError && <p className="form-error" style={{ marginTop: '0.5rem' }}>⚠ {statusError}</p>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger btn-sm" id={`btn-detail-delete-${request.id}`} onClick={onDelete}>🗑 Delete</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" id={`btn-detail-edit-${request.id}`} onClick={onEdit}>✏️ Edit</button>
        </div>
      </div>
    </div>
  );
}

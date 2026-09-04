import React from 'react';

function priorityClass(p) {
  return `badge badge-${p?.toLowerCase()}`;
}
function statusClass(s) {
  if (s === 'InProgress') return 'badge badge-inprogress';
  return `badge badge-${s?.toLowerCase()}`;
}
function statusLabel(s) {
  return s === 'InProgress' ? 'In Progress' : s;
}
function formatDate(dt) {
  return new Date(dt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AssistanceCard({ request, onView, onEdit, onDelete }) {
  const { id, requesterName, district, location, requestType, priority, status, numberOfPeople, description, createdAt, isSample } = request;

  return (
    <article
      id={`card-${id}`}
      className={`a-card priority-${priority}${isSample ? ' sample-card' : ''}`}
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onView()}
      aria-label={`Assistance request from ${requesterName}`}
    >
      <div className="card-header">
        <div>
          <div className="card-title">{requesterName}</div>
          <div className="card-id">#{id} · {district}</div>
        </div>
        <div className="card-badges">
          {isSample && <span className="badge badge-sample">DEMO</span>}
          <span className={priorityClass(priority)}>{priority}</span>
          <span className={statusClass(status)}>{statusLabel(status)}</span>
        </div>
      </div>

      <div className="card-meta">
        <div className="card-meta-row">
          <span>📍</span>
          <span>{location}</span>
        </div>
        <div className="card-meta-row">
          <span>🏷️</span>
          <span className="badge badge-type">{requestType}</span>
          <span style={{ color: '#8ba3c7', marginLeft: 4 }}>·</span>
          <span>👥 {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</span>
        </div>
      </div>

      <p className="card-desc">{description}</p>

      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="card-date">🕐 {formatDate(createdAt)}</span>
        <div className="card-actions">
          <button id={`btn-view-${id}`} className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onView(); }} aria-label="View details">👁 View</button>
          <button id={`btn-edit-${id}`} className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }} aria-label="Edit request">✏️ Edit</button>
          <button id={`btn-delete-${id}`} className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }} aria-label="Delete request">🗑</button>
        </div>
      </div>
    </article>
  );
}

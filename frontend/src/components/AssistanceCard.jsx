import React from 'react';
import { Clock3, Edit3, Eye, MapPin, Tag, Trash2, Users } from 'lucide-react';

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
  const { id, requesterName, district, location, requestType, priority, status, numberOfPeople, description, createdAt } = request;

  return (
    <article
      id={`card-${id}`}
      className={`a-card priority-${priority}`}
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
          <span className={priorityClass(priority)}>{priority}</span>
          <span className={statusClass(status)}>{statusLabel(status)}</span>
        </div>
      </div>

      <div className="card-meta">
        <div className="card-meta-row">
          <MapPin size={15} aria-hidden="true" />
          <span>{location}</span>
        </div>
        <div className="card-meta-row">
          <Tag size={15} aria-hidden="true" />
          <span className="badge badge-type">{requestType}</span>
          <span className="meta-divider">·</span>
          <span><Users size={15} aria-hidden="true" /> {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</span>
        </div>
      </div>

      <p className="card-desc">{description}</p>

      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="card-date"><Clock3 size={14} aria-hidden="true" /> {formatDate(createdAt)}</span>
        <div className="card-actions">
          <button id={`btn-view-${id}`} className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onView(); }} aria-label="View details"><Eye size={15} /> View</button>
          <button id={`btn-edit-${id}`} className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }} aria-label="Edit request"><Edit3 size={15} /> Edit</button>
          <button id={`btn-delete-${id}`} className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }} aria-label="Delete request"><Trash2 size={15} /></button>
        </div>
      </div>
    </article>
  );
}

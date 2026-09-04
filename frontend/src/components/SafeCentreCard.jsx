/**
 * SafeCentreCard component
 * Displays a single safe centre in a card layout.
 * Author: Maddegoda M.V.S. | IT24101739
 */
import React from 'react';
import { Edit3, Eye, MapPin, Trash2 } from 'lucide-react';

function getOccupancyClass(pct) {
  if (pct >= 90) return 'high';
  if (pct >= 60) return 'medium';
  return 'low';
}

function SafeCentreCard({ centre, onView, onEdit, onDelete, canManage = false }) {
  const pct = centre.capacity > 0
    ? Math.min(100, Math.round((centre.currentOccupancy / centre.capacity) * 100))
    : 0;

  const occupancyClass = getOccupancyClass(pct);

  const facilities = centre.facilities
    ? centre.facilities.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  return (
    <article
      className="sc-card"
      onClick={() => onView(centre)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onView(centre)}
      aria-label={`View details for ${centre.name}`}
      id={`sc-card-${centre.id}`}
    >
      {/* Header */}
      <div className="sc-card-header">
        <div className="sc-card-title-group">
          <div className="sc-card-name" title={centre.name}>{centre.name}</div>
          <div className="sc-card-district">
            <MapPin size={14} aria-hidden="true" />
            {centre.district} District
          </div>
        </div>
        <div className="sc-card-badges">
          <span className={`avail-badge ${centre.availability ? 'open' : 'closed'}`}>
            {centre.availability ? '● Open' : '● Closed'}
          </span>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="capacity-section">
        <div className="capacity-labels">
          <span>Occupancy</span>
          <span className="available-spaces">
            {centre.availableSpaces} spaces free
          </span>
        </div>
        <div className="capacity-bar-track" aria-label={`Capacity ${pct}%`}>
          <div
            className={`capacity-bar-fill ${occupancyClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="capacity-nums">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            {centre.currentOccupancy} / {centre.capacity}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {pct}% full
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="sc-card-address">
        <span>🏠</span>
        <span>{centre.address}</span>
      </div>

      {/* Facilities */}
      {facilities.length > 0 && (
        <div className="sc-facilities" aria-label="Facilities">
          {facilities.slice(0, 4).map(f => (
            <span key={f} className="facility-tag">{f}</span>
          ))}
          {facilities.length > 4 && (
            <span className="facility-tag" style={{ opacity: 0.7 }}>
              +{facilities.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Card Actions */}
      <div className="sc-card-actions" onClick={e => e.stopPropagation()}>
        <button
          id={`btn-view-${centre.id}`}
          className="btn btn-ghost btn-sm"
          onClick={() => onView(centre)}
          aria-label={`View ${centre.name}`}
        >
          <Eye size={15} /> View
        </button>
        {canManage && (
          <>
            <button
              id={`btn-edit-${centre.id}`}
              className="btn btn-secondary btn-sm"
              onClick={() => onEdit(centre)}
              aria-label={`Edit ${centre.name}`}
            >
              <Edit3 size={15} /> Edit
            </button>
            <button
              id={`btn-delete-${centre.id}`}
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(centre)}
              aria-label={`Delete ${centre.name}`}
            >
              <Trash2 size={15} /> Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default SafeCentreCard;

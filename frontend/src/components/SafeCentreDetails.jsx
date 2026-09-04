/**
 * SafeCentreDetails component
 * Detail modal for a single safe centre — read-only view.
 * Author: Maddegoda M.V.S. | IT24101739
 */
import React from 'react';

function getOccupancyClass(pct) {
  if (pct >= 90) return 'high';
  if (pct >= 60) return 'medium';
  return 'low';
}

function SafeCentreDetails({ centre, onClose, onEdit, onDelete }) {
  if (!centre) return null;

  const pct = centre.capacity > 0
    ? Math.min(100, Math.round((centre.currentOccupancy / centre.capacity) * 100))
    : 0;

  const facilities = centre.facilities
    ? centre.facilities.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="details-title">
      <div className="modal-box" id="sc-details-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div
              id="details-title"
              className="modal-title"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}
            >
              {centre.name}
              <span className={`avail-badge ${centre.availability ? 'open' : 'closed'}`}>
                {centre.availability ? '● Open' : '● Closed'}
              </span>
              {centre.isSample && <span className="sample-badge">DEMO DATA</span>}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--clr-primary-light)', marginTop: '0.25rem' }}>
              📍 {centre.district} District
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close details">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {centre.isSample && (
            <div className="alert warning" style={{ marginBottom: '1.25rem' }}>
              ⚠️ <strong>Demo Data</strong> — This is a sample record used for demonstration. It does not represent a real active safe centre.
            </div>
          )}

          <div className="details-grid">
            {/* Capacity block */}
            <div className="detail-capacity-wrap">
              <div className="detail-cap-row">
                <span>Total Capacity</span>
                <span>{centre.capacity} people</span>
              </div>
              <div className="capacity-bar-track">
                <div
                  className={`capacity-bar-fill ${getOccupancyClass(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="detail-cap-row">
                <span>Current Occupancy</span>
                <span>{centre.currentOccupancy} ({pct}%)</span>
              </div>
              <div className="detail-cap-row">
                <span>Available Spaces</span>
                <span style={{ color: 'var(--clr-primary-light)' }}>
                  {centre.availableSpaces} spaces free
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="detail-item full">
              <div className="detail-label">Address</div>
              <div className="detail-value">🏠 {centre.address}</div>
            </div>

            {/* Contact */}
            <div className="detail-item">
              <div className="detail-label">Contact Number</div>
              <div className="detail-value">📞 <a href={`tel:${centre.contactNumber}`} style={{ color: 'var(--clr-primary-light)' }}>{centre.contactNumber}</a></div>
            </div>

            {/* Opening Date */}
            <div className="detail-item">
              <div className="detail-label">Opening Date</div>
              <div className="detail-value">📅 {formatDate(centre.openingDate)}</div>
            </div>

            {/* Facilities */}
            {facilities.length > 0 && (
              <div className="detail-item full">
                <div className="detail-label">Facilities</div>
                <div className="sc-facilities" style={{ marginTop: '0.4rem' }}>
                  {facilities.map(f => (
                    <span key={f} className="facility-tag">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {centre.notes && (
              <div className="detail-item full">
                <div className="detail-label">Notes</div>
                <div className="detail-value" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {centre.notes}
                </div>
              </div>
            )}

            {/* ID */}
            <div className="detail-item">
              <div className="detail-label">Record ID</div>
              <div className="detail-value" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{centre.id}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button id="btn-details-close" className="btn btn-ghost" onClick={onClose}>Close</button>
          <button id="btn-details-delete" className="btn btn-danger" onClick={() => { onClose(); onDelete(centre); }}>🗑 Delete</button>
          <button id="btn-details-edit" className="btn btn-primary" onClick={() => { onClose(); onEdit(centre); }}>✏️ Edit Centre</button>
        </div>
      </div>
    </div>
  );
}

export default SafeCentreDetails;

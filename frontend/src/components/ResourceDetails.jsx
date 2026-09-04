/**
 * ResourceDetails.jsx
 * Slide-in side drawer showing full resource details.
 * Prominently displays the low-stock rule and current stock status.
 *
 * Author: Mamalgaha I.G.W.S. (IT24102615)
 */
import "./ResourceDetails.css";
import { RESOURCE_TYPE_ICONS } from "../services/emergencyResourceService";

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-LK", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

const getProgressPercent = (quantity, minRequired) => {
  if (minRequired <= 0) return 100;
  return Math.min(Math.max((quantity / (minRequired * 2)) * 100, 0), 100);
};

const ResourceDetails = ({ resource, onEdit, onDelete, onClose }) => {
  const {
    id, resourceName, resourceType, district, location,
    quantity, unit, minimumRequired, status, lastUpdated,
    notes, isLowStock, isSample
  } = resource;

  const icon       = RESOURCE_TYPE_ICONS[resourceType] || "📦";
  const progressPct = getProgressPercent(quantity, minimumRequired);
  const isLow      = isLowStock || status === "Depleted";

  return (
    <div
      className="details-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside className="details-drawer" id={`details-drawer-${id}`}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="details-header">
          <div className="details-header-top">
            <h2 className="details-title" id="details-title">
              {icon} {resourceName}
            </h2>
            <button className="details-close" onClick={onClose} aria-label="Close details">✕</button>
          </div>
          <div className="details-badges">
            <span className="details-badge badge-type">{resourceType}</span>
            <span className="details-badge badge-type">📍 {district}</span>
            {isSample && (
              <span className="details-badge" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                SAMPLE DATA
              </span>
            )}
          </div>
        </div>

        <div className="details-body">

          {/* ── Stock Hero ──────────────────────────────────────────────── */}
          <div className={`stock-hero ${isLow ? "is-low" : ""}`}>
            <div className="stock-hero-qty">{quantity.toLocaleString()}</div>
            <div className="stock-hero-unit">{unit} available</div>
            <div className="stock-hero-bar-track">
              <div
                className={`stock-hero-bar-fill ${isLow ? "low-bar" : ""}`}
                style={{ width: `${progressPct}%` }}
                role="progressbar"
                aria-valuenow={quantity}
                aria-valuemin={0}
                aria-valuemax={minimumRequired * 2}
              />
            </div>
            <div className="stock-hero-legend">
              <span>0</span>
              <span>Min: {minimumRequired.toLocaleString()} {unit}</span>
            </div>
          </div>

          {/* ── Low Stock Alert ─────────────────────────────────────────── */}
          {isLowStock && (
            <div className="details-low-stock-alert" role="alert">
              <h4>⚠ Low Stock Alert</h4>
              <p>
                Current quantity ({quantity.toLocaleString()} {unit}) is at or below the
                minimum required threshold ({minimumRequired.toLocaleString()} {unit}).
                Immediate replenishment is recommended.
              </p>
            </div>
          )}

          {/* ── Low Stock Rule Explanation ───────────────────────────────── */}
          <div className="low-stock-rule-box">
            <strong>📋 Low Stock Rule:</strong><br/>
            A resource is marked <em>Low Stock</em> when:<br/>
            <code>Quantity ≤ Minimum Required</code><br/>
            Current: <strong>{quantity}</strong> {unit} {isLowStock ? "≤" : ">"} <strong>{minimumRequired}</strong> {unit}
            → <strong style={{ color: isLowStock ? "#fcd34d" : "#6ee7b7" }}>
              {isLowStock ? "⚠ Low Stock" : "✓ Sufficient"}
            </strong>
          </div>

          {/* ── Resource Details ─────────────────────────────────────────── */}
          <div className="details-section">
            <div className="details-section-title">Resource Details</div>
            <div className="details-field">
              <span className="details-field-label">ID</span>
              <span className="details-field-value">#{id}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">Type</span>
              <span className="details-field-value">{icon} {resourceType}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">District</span>
              <span className="details-field-value">📍 {district}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">Location</span>
              <span className="details-field-value">{location}</span>
            </div>
          </div>

          {/* ── Stock Information ─────────────────────────────────────────── */}
          <div className="details-section">
            <div className="details-section-title">Stock Information</div>
            <div className="details-field">
              <span className="details-field-label">Quantity</span>
              <span className="details-field-value">{quantity.toLocaleString()} {unit}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">Minimum Required</span>
              <span className="details-field-value">{minimumRequired.toLocaleString()} {unit}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">Status</span>
              <span className="details-field-value">{status}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">Stock Status</span>
              <span
                className="details-field-value"
                style={{
                  color:
                    status === "Depleted" ? "#fca5a5" :
                    status === "Reserved" ? "#c4b5fd" :
                    isLowStock ? "#fcd34d" : "#6ee7b7",
                  fontWeight: 700,
                }}
              >
                {status === "Depleted"
                  ? "🔴 Depleted"
                  : status === "Reserved"
                    ? "🟣 Reserved"
                    : (isLowStock ? "⚠ Low Stock" : "✓ Available")}
              </span>
            </div>
          </div>

          {/* ── Notes ───────────────────────────────────────────────────── */}
          {notes && (
            <div className="details-section">
              <div className="details-section-title">Notes</div>
              <div className="notes-text">{notes}</div>
            </div>
          )}

          {/* ── Metadata ────────────────────────────────────────────────── */}
          <div className="details-section">
            <div className="details-section-title">Metadata</div>
            <div className="details-field">
              <span className="details-field-label">Last Updated</span>
              <span className="details-field-value">{formatDate(lastUpdated)}</span>
            </div>
            <div className="details-field">
              <span className="details-field-label">Sample Data</span>
              <span className="details-field-value">{isSample ? "Yes (Demo)" : "No"}</span>
            </div>
          </div>

        </div>

        {/* ── Footer Actions ───────────────────────────────────────────── */}
        <div className="details-actions">
          <button
            id={`btn-details-edit-${id}`}
            className="btn-details-edit"
            onClick={() => { onClose(); onEdit(resource); }}
          >
            ✏ Edit Resource
          </button>
          <button
            id={`btn-details-delete-${id}`}
            className="btn-details-delete"
            onClick={() => { onClose(); onDelete(resource); }}
          >
            🗑 Delete
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ResourceDetails;

/**
 * ResourceCard.jsx
 * Displays a single emergency resource as a styled card.
 *
 * LOW STOCK RULE (transparent):
 *   isLowStock (from API) = Quantity <= MinimumRequired
 *   Shown as: ⚠ Low Stock badge + orange accent + progress bar
 *
 * Author: Mamalgaha I.G.W.S. (IT24102615)
 */
import "./ResourceCard.css";
import { RESOURCE_TYPE_ICONS } from "../services/emergencyResourceService";

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-LK", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

const getStatusClass = (status, isLowStock) => {
  if (isLowStock || status === "Low Stock") return "low-stock";
  if (status === "Depleted") return "depleted";
  if (status === "Reserved") return "reserved";
  return "";
};

const getStockBadge = (status, isLowStock) => {
  if (status === "Depleted")  return { cls: "badge-depleted",  label: "🔴 Depleted" };
  if (status === "Reserved")  return { cls: "badge-reserved",  label: "🟣 Reserved" };
  if (isLowStock)             return { cls: "badge-lowstock",  label: "⚠ Low Stock" };
  return                             { cls: "badge-available", label: "✓ Available" };
};

const getProgressPercent = (quantity, minRequired) => {
  if (minRequired <= 0) return 100;
  const pct = (quantity / (minRequired * 2)) * 100;
  return Math.min(Math.max(pct, 0), 100);
};

const ResourceCard = ({ resource, onView, onEdit, onDelete }) => {
  const {
    id, resourceName, resourceType, district, location,
    quantity, unit, minimumRequired, status, lastUpdated,
    isLowStock, isSample
  } = resource;

  const icon       = RESOURCE_TYPE_ICONS[resourceType] || "📦";
  const statusCls  = getStatusClass(status, isLowStock);
  const badge      = getStockBadge(status, isLowStock);
  const progressPct = getProgressPercent(quantity, minimumRequired);
  const isLow      = isLowStock || status === "Low Stock" || status === "Depleted";

  return (
    <article className={`resource-card ${statusCls}`} id={`resource-card-${id}`}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="card-header">
        <div className="card-icon-name">
          <span className="card-icon" aria-label={resourceType}>{icon}</span>
          <h3 className="card-name">{resourceName}</h3>
        </div>
        <div className="badge-group">
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
          {isSample && <span className="badge badge-sample">SAMPLE</span>}
        </div>
      </div>

      {/* ── Info Grid ───────────────────────────────────────────────────── */}
      <div className="card-info">
        <div className="info-item">
          <span className="info-label">Type</span>
          <span className="info-value">{resourceType}</span>
        </div>
        <div className="info-item">
          <span className="info-label">District</span>
          <span className="info-value">📍 {district}</span>
        </div>
        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
          <span className="info-label">Location</span>
          <span className="info-value">{location}</span>
        </div>
      </div>

      {/* ── Quantity ────────────────────────────────────────────────────── */}
      <div className="quantity-section">
        <div className="quantity-header">
          <span className="quantity-label">Stock Level</span>
          <div className="quantity-values">
            <span className="quantity-current">{quantity.toLocaleString()}</span>
            <span className="quantity-unit">{unit}</span>
          </div>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${isLow ? "low" : ""}`}
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={quantity}
            aria-valuemin={0}
            aria-valuemax={Math.max(minimumRequired * 2, quantity, 1)}
        </div>
        <div className="quantity-min">Min. Required: {minimumRequired.toLocaleString()} {unit}</div>
      </div>

      {/* ── Low Stock Warning ────────────────────────────────────────────── */}
      {/*
         LOW STOCK RULE:
         This warning displays whenever isLowStock is true.
         isLowStock = (Quantity <= MinimumRequired) — computed by the API.
      */}
      {isLowStock && (
        <div className="low-stock-warning" role="alert">
          ⚠ Low stock — quantity at or below minimum threshold
          ({quantity} ≤ {minimumRequired} {unit})
        </div>
      )}

      {/* ── Action Buttons ───────────────────────────────────────────────── */}
      <div className="card-actions">
        <button
          id={`btn-view-${id}`}
          className="btn-card btn-card-view"
          onClick={() => onView(resource)}
          aria-label={`View details of ${resourceName}`}
        >
          👁 View
        </button>
        <button
          id={`btn-edit-${id}`}
          className="btn-card btn-card-edit"
          onClick={() => onEdit(resource)}
          aria-label={`Edit ${resourceName}`}
        >
          ✏ Edit
        </button>
        <button
          id={`btn-delete-${id}`}
          className="btn-card btn-card-delete"
          onClick={() => onDelete(resource)}
          aria-label={`Delete ${resourceName}`}
        >
          🗑
        </button>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="card-footer">Updated: {formatDate(lastUpdated)}</div>
    </article>
  );
};

export default ResourceCard;

/**
 * ResourceForm.jsx
 * Create / Edit modal form for Emergency Resources.
 * Includes frontend validation with friendly messages.
 *
 * In CREATE mode: all fields shown
 * In EDIT mode:   only Quantity, Status, Location, MinimumRequired, Notes
 *
 * Author: Mamalgaha I.G.W.S. (IT24102615)
 */
import { useState, useEffect } from "react";
import "./ResourceForm.css";
import {
  RESOURCE_TYPES,
  SRI_LANKA_DISTRICTS,
  RESOURCE_STATUSES,
  createEmergencyResource,
  updateEmergencyResource,
} from "../services/emergencyResourceService";

// ── Validation ───────────────────────────────────────────────────────────────
const validate = (fields, isEdit) => {
  const errors = {};

  if (!isEdit) {
    if (!fields.resourceName?.trim())
      errors.resourceName = "Resource name is required.";
    else if (fields.resourceName.length > 200)
      errors.resourceName = "Name cannot exceed 200 characters.";

    if (!fields.resourceType)
      errors.resourceType = "Please select a resource type.";
    else if (!RESOURCE_TYPES.includes(fields.resourceType))
      errors.resourceType = "Invalid resource type selected.";

    if (!fields.district)
      errors.district = "Please select a district.";

    if (!fields.unit?.trim())
      errors.unit = "Unit is required (e.g. Bottles, Kits).";
  }

  if (!fields.location?.trim())
    errors.location = "Location is required.";

  const qty = parseFloat(fields.quantity);
  if (isNaN(qty) || qty < 0)
    errors.quantity = "Quantity must be 0 or greater.";

  const minReq = parseFloat(fields.minimumRequired);
  if (isNaN(minReq) || minReq < 0)
    errors.minimumRequired = "Minimum required must be 0 or greater.";

  if (!fields.status)
    errors.status = "Status is required.";

  return errors;
};

// ── Defaults ─────────────────────────────────────────────────────────────────
const blankForm = {
  resourceName:    "",
  resourceType:    "",
  district:        "",
  location:        "",
  quantity:        "",
  unit:            "",
  minimumRequired: "",
  status:          "Available",
  notes:           "",
};

const ResourceForm = ({ resource, onClose, onSuccess }) => {
  const isEdit = Boolean(resource);

  const [fields, setFields] = useState(() => {
    if (isEdit) {
      return {
        resourceName:    resource.resourceName,
        resourceType:    resource.resourceType,
        district:        resource.district,
        location:        resource.location,
        quantity:        String(resource.quantity),
        unit:            resource.unit,
        minimumRequired: String(resource.minimumRequired),
        status:          resource.status,
        notes:           resource.notes || "",
      };
    }
    return { ...blankForm };
  });

  const [errors,    setErrors]    = useState({});
  const [apiError,  setApiError]  = useState("");
  const [loading,   setLoading]   = useState(false);

  // Live low-stock preview
  const qty    = parseFloat(fields.quantity)        || 0;
  const minReq = parseFloat(fields.minimumRequired) || 0;
  const previewLowStock = qty <= minReq && (fields.quantity !== "" || fields.minimumRequired !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(fields, isEdit);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    setApiError("");

    const payload = isEdit
      ? {
          quantity:        parseFloat(fields.quantity),
          status:          fields.status,
          location:        fields.location,
          minimumRequired: parseFloat(fields.minimumRequired),
          notes:           fields.notes,
        }
      : {
          resourceName:    fields.resourceName,
          resourceType:    fields.resourceType,
          district:        fields.district,
          location:        fields.location,
          quantity:        parseFloat(fields.quantity),
          unit:            fields.unit,
          minimumRequired: parseFloat(fields.minimumRequired),
          status:          fields.status,
          notes:           fields.notes,
          isSample:        false,
        };

    const result = isEdit
      ? await updateEmergencyResource(resource.id, payload)
      : await createEmergencyResource(payload);

    setLoading(false);

    if (result.error) {
      setApiError(result.error);
    } else {
      onSuccess(result.data, isEdit ? "updated" : "created");
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true"
      aria-labelledby="form-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="modal-panel">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="modal-header">
          <h2 className="modal-title" id="form-modal-title">
            {isEdit ? "✏ Edit Resource" : "➕ Add Emergency Resource"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close form">✕</button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {apiError && <div className="form-api-error" role="alert">⚠ {apiError}</div>}

            <div className="form-grid">

              {/* ── Identification ────────────────────────────── */}
              {!isEdit && (
                <>
                  <div className="form-section-label">Resource Information</div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="resourceName">
                      Resource Name <span className="required">*</span>
                    </label>
                    <input
                      id="resourceName" name="resourceName" type="text"
                      className={`form-input ${errors.resourceName ? "error" : ""}`}
                      value={fields.resourceName}
                      onChange={handleChange}
                      placeholder="e.g. Bottled Drinking Water 500ml"
                      maxLength={200}
                    />
                    {errors.resourceName && <span className="field-error">⚠ {errors.resourceName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="resourceType">
                      Resource Type <span className="required">*</span>
                    </label>
                    <select
                      id="resourceType" name="resourceType"
                      className={`form-select ${errors.resourceType ? "error" : ""}`}
                      value={fields.resourceType}
                      onChange={handleChange}
                    >
                      <option value="">— Select Type —</option>
                      {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.resourceType && <span className="field-error">⚠ {errors.resourceType}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="district">
                      District <span className="required">*</span>
                    </label>
                    <select
                      id="district" name="district"
                      className={`form-select ${errors.district ? "error" : ""}`}
                      value={fields.district}
                      onChange={handleChange}
                    >
                      <option value="">— Select District —</option>
                      {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.district && <span className="field-error">⚠ {errors.district}</span>}
                  </div>
                </>
              )}

              {/* ── Location ──────────────────────────────────── */}
              <div className="form-section-label">
                {isEdit ? "Editable Fields" : "Location & Stock"}
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="location">
                  Location <span className="required">*</span>
                </label>
                <input
                  id="location" name="location" type="text"
                  className={`form-input ${errors.location ? "error" : ""}`}
                  value={fields.location}
                  onChange={handleChange}
                  placeholder="e.g. Colombo District Secretariat, Cinnamon Gardens"
                  maxLength={300}
                />
                {errors.location && <span className="field-error">⚠ {errors.location}</span>}
              </div>

              {/* ── Quantity & Unit ───────────────────────────── */}
              <div className="form-group">
                <label className="form-label" htmlFor="quantity">
                  Quantity <span className="required">*</span>
                </label>
                <input
                  id="quantity" name="quantity" type="number"
                  className={`form-input ${errors.quantity ? "error" : ""}`}
                  value={fields.quantity}
                  onChange={handleChange}
                  min={0} step="any"
                  placeholder="0"
                />
                {errors.quantity && <span className="field-error">⚠ {errors.quantity}</span>}
              </div>

              {!isEdit ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="unit">
                    Unit <span className="required">*</span>
                  </label>
                  <input
                    id="unit" name="unit" type="text"
                    className={`form-input ${errors.unit ? "error" : ""}`}
                    value={fields.unit}
                    onChange={handleChange}
                    placeholder="e.g. Bottles, Kits, Packs"
                    maxLength={50}
                  />
                  {errors.unit && <span className="field-error">⚠ {errors.unit}</span>}
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input className="form-input" value={resource.unit} disabled style={{ opacity: 0.4 }} />
                </div>
              )}

              {/* ── Minimum Required ─────────────────────────── */}
              <div className="form-group">
                <label className="form-label" htmlFor="minimumRequired">
                  Minimum Required <span className="required">*</span>
                </label>
                <input
                  id="minimumRequired" name="minimumRequired" type="number"
                  className={`form-input ${errors.minimumRequired ? "error" : ""}`}
                  value={fields.minimumRequired}
                  onChange={handleChange}
                  min={0} step="any"
                  placeholder="0"
                />
                {errors.minimumRequired && <span className="field-error">⚠ {errors.minimumRequired}</span>}
              </div>

              {/* ── Status ───────────────────────────────────── */}
              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Status <span className="required">*</span>
                </label>
                <select
                  id="status" name="status"
                  className={`form-select ${errors.status ? "error" : ""}`}
                  value={fields.status}
                  onChange={handleChange}
                >
                  {RESOURCE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <span className="field-error">⚠ {errors.status}</span>}
              </div>

              {/* ── Low Stock Preview ─────────────────────────── */}
              {previewLowStock && (
                <div className="lowstock-info">
                  ⚠ <strong>Low Stock Preview:</strong> With Qty = {qty} and Min Required = {minReq},
                  this resource will be flagged as <em>Low Stock</em> (Qty ≤ Min Required).
                </div>
              )}

              {/* ── Notes ───────────────────────────────────── */}
              <div className="form-section-label">Additional Notes</div>
              <div className="form-group full-width">
                <label className="form-label" htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes" name="notes"
                  className="form-textarea"
                  value={fields.notes}
                  onChange={handleChange}
                  placeholder="Additional information about this resource..."
                  maxLength={1000}
                  rows={3}
                />
              </div>

            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} id="btn-form-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading} id="btn-form-submit">
              {loading && <span className="spinner" />}
              {loading ? "Saving..." : (isEdit ? "💾 Save Changes" : "➕ Add Resource")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;

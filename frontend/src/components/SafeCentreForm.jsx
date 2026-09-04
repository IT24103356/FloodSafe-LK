/**
 * SafeCentreForm component
 * Controlled form for creating and editing safe centres.
 * Includes client-side validation before submitting to the API.
 * Author: Maddegoda M.V.S. | IT24101739
 */
import React, { useState, useEffect } from 'react';
import { SRI_LANKA_DISTRICTS } from './SafeCentreFilters.jsx';

const EMPTY_FORM = {
  name: '',
  district: '',
  address: '',
  contactNumber: '',
  capacity: '',
  currentOccupancy: '',
  facilities: '',
  availability: true,
  openingDate: new Date().toISOString().split('T')[0],
  notes: '',
  isSample: false,
};

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required.';
  if (!fields.district) errors.district = 'District is required.';
  if (!fields.address.trim()) errors.address = 'Address is required.';

  const phoneRegex = /^(?:\+94|0)(?:[ -]?[0-9]){9}$/;
  if (!fields.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!phoneRegex.test(fields.contactNumber.trim())) {
    errors.contactNumber = 'Enter a Sri Lankan number such as 0112345678 or +94112345678.';
  }

  const cap = parseInt(fields.capacity, 10);
  const occ = parseInt(fields.currentOccupancy, 10);

  if (!fields.capacity || isNaN(cap) || cap < 1) {
    errors.capacity = 'Capacity must be greater than 0.';
  }
  if (fields.currentOccupancy === '' || isNaN(occ) || occ < 0) {
    errors.currentOccupancy = 'Occupancy must be 0 or more.';
  } else if (!isNaN(cap) && occ > cap) {
    errors.currentOccupancy = 'Occupancy cannot exceed capacity.';
  }

  return errors;
}

function SafeCentreForm({ initial, onSubmit, onCancel, loading }) {
  const isEdit = Boolean(initial?.id);

  const [fields, setFields] = useState(() => {
    if (!initial) return EMPTY_FORM;
    return {
      name: initial.name || '',
      district: initial.district || '',
      address: initial.address || '',
      contactNumber: initial.contactNumber || '',
      capacity: String(initial.capacity ?? ''),
      currentOccupancy: String(initial.currentOccupancy ?? ''),
      facilities: initial.facilities || '',
      availability: initial.availability ?? true,
      openingDate: initial.openingDate
        ? new Date(initial.openingDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      notes: initial.notes || '',
      isSample: initial.isSample ?? false,
    };
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Re-validate on change if the user has already attempted submit
  useEffect(() => {
    if (submitted) setErrors(validate(fields));
  }, [fields, submitted]);

  function handle(field, value) {
    setFields(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      name: fields.name.trim(),
      district: fields.district,
      address: fields.address.trim(),
      contactNumber: fields.contactNumber.trim(),
      capacity: parseInt(fields.capacity, 10),
      currentOccupancy: parseInt(fields.currentOccupancy, 10),
      facilities: fields.facilities.trim(),
      availability: fields.availability,
      openingDate: new Date(fields.openingDate).toISOString(),
      notes: fields.notes.trim(),
      isSample: fields.isSample,
    };

    await onSubmit(payload);
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="modal-box" id="sc-form-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 id="form-title" className="modal-title">
            {isEdit ? '✏️ Edit Safe Centre' : '➕ Add New Safe Centre'}
          </h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close form">✕</button>
        </div>

        {/* Body */}
        <form id="sc-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">

              {/* Name */}
              <div className="form-group full">
                <label className="form-label" htmlFor="f-name">Centre Name <span className="req">*</span></label>
                <input
                  id="f-name"
                  type="text"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  placeholder="e.g. Colombo Civic Centre Emergency Shelter"
                  value={fields.name}
                  onChange={e => handle('name', e.target.value)}
                  maxLength={200}
                  aria-required="true"
                  aria-describedby={errors.name ? 'err-name' : undefined}
                />
                {errors.name && <span id="err-name" className="form-error">⚠ {errors.name}</span>}
              </div>

              {/* District */}
              <div className="form-group">
                <label className="form-label" htmlFor="f-district">District <span className="req">*</span></label>
                <select
                  id="f-district"
                  className={`form-select${errors.district ? ' error' : ''}`}
                  value={fields.district}
                  onChange={e => handle('district', e.target.value)}
                  aria-required="true"
                >
                  <option value="">— Select District —</option>
                  {SRI_LANKA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <span className="form-error">⚠ {errors.district}</span>}
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="f-contact">Contact Number <span className="req">*</span></label>
                <input
                  id="f-contact"
                  type="tel"
                  className={`form-input${errors.contactNumber ? ' error' : ''}`}
                  placeholder="+94112345678"
                  value={fields.contactNumber}
                  onChange={e => handle('contactNumber', e.target.value)}
                  maxLength={20}
                  aria-required="true"
                />
                {errors.contactNumber && <span className="form-error">⚠ {errors.contactNumber}</span>}
              </div>

              {/* Address */}
              <div className="form-group full">
                <label className="form-label" htmlFor="f-address">Address <span className="req">*</span></label>
                <input
                  id="f-address"
                  type="text"
                  className={`form-input${errors.address ? ' error' : ''}`}
                  placeholder="No. 1, Town Hall Place, Colombo 07"
                  value={fields.address}
                  onChange={e => handle('address', e.target.value)}
                  maxLength={500}
                  aria-required="true"
                />
                {errors.address && <span className="form-error">⚠ {errors.address}</span>}
              </div>

              {/* Capacity */}
              <div className="form-group">
                <label className="form-label" htmlFor="f-capacity">Total Capacity <span className="req">*</span></label>
                <input
                  id="f-capacity"
                  type="number"
                  className={`form-input${errors.capacity ? ' error' : ''}`}
                  placeholder="500"
                  value={fields.capacity}
                  onChange={e => handle('capacity', e.target.value)}
                  min={1}
                  aria-required="true"
                />
                {errors.capacity && <span className="form-error">⚠ {errors.capacity}</span>}
              </div>

              {/* Current Occupancy */}
              <div className="form-group">
                <label className="form-label" htmlFor="f-occupancy">Current Occupancy <span className="req">*</span></label>
                <input
                  id="f-occupancy"
                  type="number"
                  className={`form-input${errors.currentOccupancy ? ' error' : ''}`}
                  placeholder="0"
                  value={fields.currentOccupancy}
                  onChange={e => handle('currentOccupancy', e.target.value)}
                  min={0}
                  aria-required="true"
                />
                {errors.currentOccupancy && <span className="form-error">⚠ {errors.currentOccupancy}</span>}
              </div>

              {/* Opening Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="f-opening-date">Opening Date</label>
                <input
                  id="f-opening-date"
                  type="date"
                  className="form-input"
                  value={fields.openingDate}
                  onChange={e => handle('openingDate', e.target.value)}
                />
              </div>

              {/* Availability Toggle */}
              <div className="form-group">
                <label className="form-label">Availability</label>
                <div className="toggle-row">
                  <span className="toggle-label">
                    {fields.availability ? '● Currently Open' : '● Currently Closed'}
                  </span>
                  <label className="toggle" aria-label="Toggle availability">
                    <input
                      id="f-availability"
                      type="checkbox"
                      checked={fields.availability}
                      onChange={e => handle('availability', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              {/* Facilities */}
              <div className="form-group full">
                <label className="form-label" htmlFor="f-facilities">
                  Facilities <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span>
                </label>
                <input
                  id="f-facilities"
                  type="text"
                  className="form-input"
                  placeholder="Toilets, Drinking Water, Medical Aid, Food Distribution"
                  value={fields.facilities}
                  onChange={e => handle('facilities', e.target.value)}
                  maxLength={1000}
                />
              </div>

              {/* Notes */}
              <div className="form-group full">
                <label className="form-label" htmlFor="f-notes">Notes</label>
                <textarea
                  id="f-notes"
                  className="form-textarea"
                  placeholder="Additional information about this centre…"
                  value={fields.notes}
                  onChange={e => handle('notes', e.target.value)}
                  maxLength={1000}
                  rows={3}
                />
              </div>

              {/* Is Sample */}
              <div className="form-group full">
                <div className="toggle-row">
                  <span className="toggle-label">Mark as Demo / Sample Data</span>
                  <label className="toggle" aria-label="Mark as sample data">
                    <input
                      id="f-is-sample"
                      type="checkbox"
                      checked={fields.isSample}
                      onChange={e => handle('isSample', e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" id="btn-form-cancel" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" id="btn-form-submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
                : isEdit ? '💾 Save Changes' : '➕ Create Centre'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SafeCentreForm;

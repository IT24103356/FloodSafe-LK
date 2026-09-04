import React, { useState } from 'react';
import { createAssistanceRequest, updateAssistanceRequest } from '../services/assistanceRequestService';

const DISTRICTS = [
  'Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha',
  'Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala',
  'Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa',
  'Puttalam','Ratnapura','Trincomalee','Vavuniya'
];

const REQUEST_TYPES = ['Food','Water','Medical','Transport','Evacuation','Shelter','Other'];
const PRIORITIES = ['Low','Medium','High','Critical'];
const STATUSES = ['Pending','InProgress','Resolved'];

function validate(form, isEdit) {
  const errs = {};
  if (!form.requesterName.trim()) errs.requesterName = 'Requester name is required.';
  else if (form.requesterName.trim().length > 100) errs.requesterName = 'Name must not exceed 100 characters.';

  const phoneRe = /^(\+94|0)[0-9]{9}$/;
  if (!form.phone.trim()) errs.phone = 'Phone number is required.';
  else if (!phoneRe.test(form.phone.trim())) errs.phone = 'Enter a valid Sri Lankan phone number (e.g. 0771234567).';

  if (!form.district) errs.district = 'District is required.';
  if (!form.location.trim()) errs.location = 'Location is required.';
  if (!form.requestType) errs.requestType = 'Request type is required.';
  if (!form.priority) errs.priority = 'Priority is required.';
  if (!form.description.trim()) errs.description = 'Description is required.';
  else if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters.';
  else if (form.description.trim().length > 1000) errs.description = 'Description must not exceed 1000 characters.';

  const np = parseInt(form.numberOfPeople, 10);
  if (!form.numberOfPeople) errs.numberOfPeople = 'Number of people is required.';
  else if (isNaN(np) || np < 1 || np > 10000) errs.numberOfPeople = 'Must be a number between 1 and 10,000.';

  if (isEdit && !form.status) errs.status = 'Status is required.';
  return errs;
}

export default function AssistanceForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    requesterName: initial?.requesterName || '',
    phone: initial?.phone || '',
    district: initial?.district || '',
    location: initial?.location || '',
    requestType: initial?.requestType || '',
    priority: initial?.priority || '',
    description: initial?.description || '',
    numberOfPeople: initial?.numberOfPeople?.toString() || '',
    status: initial?.status || 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate(form, isEdit);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateAssistanceRequest(initial.id, {
          location: form.location,
          requestType: form.requestType,
          priority: form.priority,
          description: form.description,
          numberOfPeople: parseInt(form.numberOfPeople, 10),
          status: form.status,
        });
        onSuccess(null, true);
      } else {
        const created = await createAssistanceRequest({
          requesterName: form.requesterName,
          phone: form.phone,
          district: form.district,
          location: form.location,
          requestType: form.requestType,
          priority: form.priority,
          description: form.description,
          numberOfPeople: parseInt(form.numberOfPeople, 10),
        });
        onSuccess(created, false);
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const F = ({ id, label, required, children, error }) => (
    <div className="form-field">
      <label htmlFor={id}>{label}{required && <span className="required">*</span>}</label>
      {children}
      {error && <span className="form-error">⚠ {error}</span>}
    </div>
  );

  return (
    <form id="assistance-request-form" onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        {serverError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
            ⚠ {serverError}
          </div>
        )}

        <p className="form-section-title">Requester Information</p>
        <div className="form-grid">
          <F id="requesterName" label="Requester Name" required error={errors.requesterName}>
            <input id="requesterName" type="text" value={form.requesterName} onChange={set('requesterName')}
              className={errors.requesterName ? 'error' : ''} placeholder="Full name" disabled={isEdit} />
          </F>
          <F id="phone" label="Phone Number" required error={errors.phone}>
            <input id="phone" type="tel" value={form.phone} onChange={set('phone')}
              className={errors.phone ? 'error' : ''} placeholder="0771234567 or +94771234567" disabled={isEdit} />
          </F>
          <F id="district" label="District" required error={errors.district}>
            <select id="district" value={form.district} onChange={set('district')}
              className={errors.district ? 'error' : ''} disabled={isEdit}>
              <option value="">Select district…</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </F>
          <F id="location" label="Location / Address" required error={errors.location}>
            <input id="location" type="text" value={form.location} onChange={set('location')}
              className={errors.location ? 'error' : ''} placeholder="Street, village, landmark…" />
          </F>
        </div>

        <p className="form-section-title">Request Details</p>
        <div className="form-grid">
          <F id="requestType" label="Request Type" required error={errors.requestType}>
            <select id="requestType" value={form.requestType} onChange={set('requestType')}
              className={errors.requestType ? 'error' : ''}>
              <option value="">Select type…</option>
              {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </F>
          <F id="priority" label="Priority" required error={errors.priority}>
            <select id="priority" value={form.priority} onChange={set('priority')}
              className={errors.priority ? 'error' : ''}>
              <option value="">Select priority…</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </F>
          <F id="numberOfPeople" label="Number of People" required error={errors.numberOfPeople}>
            <input id="numberOfPeople" type="number" min={1} max={10000} value={form.numberOfPeople}
              onChange={set('numberOfPeople')} className={errors.numberOfPeople ? 'error' : ''} placeholder="e.g. 4" />
          </F>
          {isEdit && (
            <F id="status" label="Status" required error={errors.status}>
              <select id="status" value={form.status} onChange={set('status')} className={errors.status ? 'error' : ''}>
                {STATUSES.map(s => <option key={s} value={s}>{s === 'InProgress' ? 'In Progress' : s}</option>)}
              </select>
            </F>
          )}
          <F id="description" label="Description" required error={errors.description} className="full">
            <textarea id="description" value={form.description} onChange={set('description')}
              className={`full ${errors.description ? 'error' : ''}`}
              placeholder="Describe the situation and what assistance is needed (min 20 characters)…"
              style={{ gridColumn: '1 / -1' }} rows={4} />
          </F>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" id="btn-cancel-form" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" id="btn-submit-form" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? '✓ Save Changes' : '🆘 Submit Request'}
        </button>
      </div>
    </form>
  );
}

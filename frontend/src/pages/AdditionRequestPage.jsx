import { useState } from 'react'
import { ArrowLeft, Boxes, CheckCircle2, Send, TentTree } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge } from '../components/common/UIComponents.jsx'
import { submitResourceRequest, submitSafeCentreRequest } from '../services/approvalService.js'

const requesterDefaults = { requesterName: '', requesterPhone: '' }
const resourceDefaults = {
  ...requesterDefaults, resourceName: '', resourceType: 'Drinking Water', district: '',
  location: '', quantity: 0, unit: '', minimumRequired: 0, status: 'Available', notes: '',
}
const centreDefaults = {
  ...requesterDefaults, name: '', district: '', address: '', contactNumber: '',
  capacity: 1, currentOccupancy: 0, facilities: '', availability: true,
  openingDate: new Date().toISOString(), notes: '',
}
const SRI_LANKAN_PHONE = /^(?:\+94|0)(?:[ -]?[0-9]){9}$/

function Field({ label, name, form, setForm, type = 'text', required = false, min, maxLength, inputMode, placeholder, error, children }) {
  const props = {
    name, required, min, maxLength, inputMode, placeholder, value: form[name],
    'aria-invalid': Boolean(error),
    onChange: (e) => setForm({ ...form, [name]: type === 'number' ? Number(e.target.value) : e.target.value }),
  }
  return (
    <label>{label}
      {children ? <select {...props}>{children}</select> : <input type={type} {...props} />}
      {error && <small className="form-error">{error}</small>}
    </label>
  )
}

function validateProposal(form, isResource) {
  const errors = {}
  if (form.requesterName.trim().length < 2) errors.requesterName = 'Enter your name using at least 2 characters.'
  if (!SRI_LANKAN_PHONE.test(form.requesterPhone.trim())) {
    errors.requesterPhone = 'Use a Sri Lankan number such as 0771234567 or +94771234567.'
  }
  if (isResource) {
    if (!form.resourceName.trim()) errors.resourceName = 'Resource name is required.'
    if (!form.district.trim()) errors.district = 'District is required.'
    if (!form.location.trim()) errors.location = 'Location is required.'
    if (form.quantity < 0) errors.quantity = 'Quantity cannot be negative.'
    if (!form.unit.trim()) errors.unit = 'Unit is required.'
    if (form.minimumRequired < 0) errors.minimumRequired = 'Minimum required cannot be negative.'
  } else {
    if (!form.name.trim()) errors.name = 'Safe centre name is required.'
    if (!form.district.trim()) errors.district = 'District is required.'
    if (!form.address.trim()) errors.address = 'Address is required.'
    if (!SRI_LANKAN_PHONE.test(form.contactNumber.trim())) {
      errors.contactNumber = 'Use a Sri Lankan contact such as 0112345678 or +94112345678.'
    }
    if (form.capacity < 1) errors.capacity = 'Capacity must be greater than zero.'
    if (form.currentOccupancy < 0) errors.currentOccupancy = 'Current occupancy cannot be negative.'
    else if (form.currentOccupancy > form.capacity) errors.currentOccupancy = 'Current occupancy cannot exceed capacity.'
  }
  if (form.notes.length > 1000) errors.notes = 'Notes cannot exceed 1,000 characters.'
  return errors
}

export default function AdditionRequestPage({ type }) {
  const isResource = type === 'resource'
  const [form, setForm] = useState(isResource ? resourceDefaults : centreDefaults)
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const nextErrors = validateProposal(form, isResource)
    setValidationErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setLoading(true)
    setError('')
    try {
      const result = isResource
        ? await submitResourceRequest(form)
        : await submitSafeCentreRequest(form)
      setReceipt(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (receipt) {
    return (
      <section className="workflow-page narrow-page">
        <div className="workflow-panel success-panel">
          <span className="success-mark"><CheckCircle2 size={32} /></span>
          <h1>Request submitted</h1>
          <p>Your proposal is private and will be reviewed by an administrator.</p>
          <div className="reference-number">Reference #{receipt.referenceId}</div>
          <p>Status: <StatusBadge tone="warning">{receipt.status}</StatusBadge></p>
          <Link className="fs-button primary" to={isResource ? '/resources' : '/safe-centres'}><ArrowLeft size={16} /> Return to public list</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="workflow-page">
      <PageHeader
        eyebrow="Community proposal"
        title={`Request - Add ${isResource ? 'Resource' : 'Safe Centre'}`}
        icon={isResource ? Boxes : TentTree}
        description="Your proposal remains private until an administrator reviews and approves it."
      />
      <div className="workflow-panel">
        <h2>Proposal details</h2>
        <p>Provide accurate contact and location information so the review team can assess the request.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <form className="workflow-form request-grid" onSubmit={submit} noValidate>
          <Field label="Your name" name="requesterName" form={form} setForm={setForm} required maxLength={120} error={validationErrors.requesterName} />
          <Field label="Your phone" name="requesterPhone" form={form} setForm={setForm} required maxLength={20} inputMode="tel" placeholder="0771234567 or +94771234567" error={validationErrors.requesterPhone} />
          {isResource ? (
            <>
              <Field label="Resource name" name="resourceName" form={form} setForm={setForm} required maxLength={200} error={validationErrors.resourceName} />
              <Field label="Resource type" name="resourceType" form={form} setForm={setForm} required>
                {['Drinking Water', 'Food', 'First Aid', 'Blankets', 'Hygiene Kits', 'Flashlights', 'Other']
                  .map((value) => <option key={value}>{value}</option>)}
              </Field>
              <Field label="District" name="district" form={form} setForm={setForm} required maxLength={100} error={validationErrors.district} />
              <Field label="Location" name="location" form={form} setForm={setForm} required maxLength={300} error={validationErrors.location} />
              <Field label="Quantity" name="quantity" type="number" min="0" form={form} setForm={setForm} required error={validationErrors.quantity} />
              <Field label="Unit" name="unit" form={form} setForm={setForm} required maxLength={50} error={validationErrors.unit} />
              <Field label="Minimum required" name="minimumRequired" type="number" min="0" form={form} setForm={setForm} error={validationErrors.minimumRequired} />
              <Field label="Status" name="status" form={form} setForm={setForm} required>
                {['Available', 'Low Stock', 'Depleted', 'Reserved'].map((value) => <option key={value}>{value}</option>)}
              </Field>
            </>
          ) : (
            <>
              <Field label="Centre name" name="name" form={form} setForm={setForm} required maxLength={200} error={validationErrors.name} />
              <Field label="District" name="district" form={form} setForm={setForm} required maxLength={100} error={validationErrors.district} />
              <Field label="Address" name="address" form={form} setForm={setForm} required maxLength={500} error={validationErrors.address} />
              <Field label="Centre contact" name="contactNumber" form={form} setForm={setForm} required maxLength={20} inputMode="tel" placeholder="0112345678 or +94112345678" error={validationErrors.contactNumber} />
              <Field label="Capacity" name="capacity" type="number" min="1" form={form} setForm={setForm} required error={validationErrors.capacity} />
              <Field label="Current occupancy" name="currentOccupancy" type="number" min="0" form={form} setForm={setForm} error={validationErrors.currentOccupancy} />
              <Field label="Facilities (comma separated)" name="facilities" form={form} setForm={setForm} />
            </>
          )}
          <label className="full-field">Notes
            <textarea rows="4" maxLength="1000" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} aria-invalid={Boolean(validationErrors.notes)} />
            {validationErrors.notes && <small className="form-error">{validationErrors.notes}</small>}
          </label>
          <div className="full-field form-actions">
            <Link className="fs-button secondary" to={isResource ? '/resources' : '/safe-centres'}>Cancel</Link>
            <button className="fs-button primary" disabled={loading}><Send size={16} /> {loading ? 'Submitting…' : 'Submit for review'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
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

function Field({ label, name, form, setForm, type = 'text', required = false, min, children }) {
  const props = {
    name, required, min, value: form[name],
    onChange: (e) => setForm({ ...form, [name]: type === 'number' ? Number(e.target.value) : e.target.value }),
  }
  return <label>{label}{children ? <select {...props}>{children}</select> : <input type={type} {...props} />}</label>
}

export default function AdditionRequestPage({ type }) {
  const isResource = type === 'resource'
  const [form, setForm] = useState(isResource ? resourceDefaults : centreDefaults)
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
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
          <h1>Request submitted</h1>
          <p>Your proposal is private and will be reviewed by an administrator.</p>
          <div className="reference-number">Reference #{receipt.referenceId}</div>
          <p>Status: <span className="status-badge pending">{receipt.status}</span></p>
          <Link className="btn btn-primary" to={isResource ? '/resources' : '/safe-centres'}>Return to public list</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="workflow-page">
      <div className="workflow-panel">
        <h1>Request {isResource ? 'Emergency Resource' : 'Safe Centre'}</h1>
        <p>This submits a private proposal. It will not appear publicly until an administrator approves it.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <form className="workflow-form request-grid" onSubmit={submit}>
          <Field label="Your name" name="requesterName" form={form} setForm={setForm} required />
          <Field label="Your phone" name="requesterPhone" form={form} setForm={setForm} required />
          {isResource ? (
            <>
              <Field label="Resource name" name="resourceName" form={form} setForm={setForm} required />
              <Field label="Resource type" name="resourceType" form={form} setForm={setForm} required>
                {['Drinking Water', 'Food', 'First Aid', 'Blankets', 'Hygiene Kits', 'Flashlights', 'Other']
                  .map((value) => <option key={value}>{value}</option>)}
              </Field>
              <Field label="District" name="district" form={form} setForm={setForm} required />
              <Field label="Location" name="location" form={form} setForm={setForm} required />
              <Field label="Quantity" name="quantity" type="number" min="0" form={form} setForm={setForm} required />
              <Field label="Unit" name="unit" form={form} setForm={setForm} required />
              <Field label="Minimum required" name="minimumRequired" type="number" min="0" form={form} setForm={setForm} />
              <Field label="Status" name="status" form={form} setForm={setForm} required>
                {['Available', 'Low Stock', 'Depleted', 'Reserved'].map((value) => <option key={value}>{value}</option>)}
              </Field>
            </>
          ) : (
            <>
              <Field label="Centre name" name="name" form={form} setForm={setForm} required />
              <Field label="District" name="district" form={form} setForm={setForm} required />
              <Field label="Address" name="address" form={form} setForm={setForm} required />
              <Field label="Centre contact" name="contactNumber" form={form} setForm={setForm} required />
              <Field label="Capacity" name="capacity" type="number" min="1" form={form} setForm={setForm} required />
              <Field label="Current occupancy" name="currentOccupancy" type="number" min="0" form={form} setForm={setForm} />
              <Field label="Facilities (comma separated)" name="facilities" form={form} setForm={setForm} />
            </>
          )}
          <label className="full-field">Notes
            <textarea rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <div className="full-field form-actions">
            <Link className="btn btn-ghost" to={isResource ? '/resources' : '/safe-centres'}>Cancel</Link>
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit for review'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}

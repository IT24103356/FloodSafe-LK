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
            <Link className="fs-button secondary" to={isResource ? '/resources' : '/safe-centres'}>Cancel</Link>
            <button className="fs-button primary" disabled={loading}><Send size={16} /> {loading ? 'Submitting…' : 'Submit for review'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}

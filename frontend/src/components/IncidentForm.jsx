import { useMemo, useState } from 'react'
import {
  DISTRICTS,
  INCIDENT_TYPES,
  PHONE_PATTERN,
  ROAD_ACCESS,
  SEVERITIES,
} from '../constants'

const EMPTY = {
  reporterName: '',
  phone: '',
  district: '',
  location: '',
  incidentType: '',
  severity: '',
  description: '',
  dateTime: '',
  waterLevel: '',
  affectedPeople: '',
  roadAccessibility: '',
}

function toLocalInput(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromIncident(incident) {
  if (!incident) return { ...EMPTY }
  return {
    reporterName: incident.reporterName ?? '',
    phone: incident.phone ?? '',
    district: incident.district ?? '',
    location: incident.location ?? '',
    incidentType: incident.incidentType ?? '',
    severity: incident.severity ?? '',
    description: incident.description ?? '',
    dateTime: toLocalInput(incident.dateTime),
    waterLevel: incident.waterLevel ?? '',
    affectedPeople: incident.affectedPeople ?? '',
    roadAccessibility: incident.roadAccessibility ?? '',
  }
}

export default function IncidentForm({ initial, submitLabel, onSubmit }) {
  const starting = useMemo(() => fromIncident(initial), [initial])
  const [values, setValues] = useState(starting)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function validate() {
    const next = {}
    if (!values.reporterName.trim() || values.reporterName.trim().length < 2) {
      next.reporterName = 'Enter the reporter name (at least 2 characters).'
    }
    if (!PHONE_PATTERN.test(values.phone.trim())) {
      next.phone = 'Use a Sri Lankan mobile number such as 0771234567 or +94771234567.'
    }
    if (!DISTRICTS.includes(values.district)) {
      next.district = 'Select a Sri Lankan district.'
    }
    if (!values.location.trim() || values.location.trim().length < 3) {
      next.location = 'Describe the location (at least 3 characters).'
    }
    if (!INCIDENT_TYPES.some((item) => item.value === values.incidentType)) {
      next.incidentType = 'Select an incident type.'
    }
    if (!SEVERITIES.includes(values.severity)) {
      next.severity = 'Select a severity.'
    }
    const description = values.description.trim()
    if (description.length < 20) {
      next.description = 'Description must be at least 20 characters.'
    } else if (description.length > 1000) {
      next.description = 'Description must be 1000 characters or fewer.'
    }
    if (!values.dateTime) {
      next.dateTime = 'Choose the date and time of the incident.'
    }
    const water = Number(values.waterLevel)
    if (values.waterLevel === '' || Number.isNaN(water) || water < 0 || water > 2000) {
      next.waterLevel = 'Water level must be a number between 0 and 2000 cm.'
    }
    const people = Number(values.affectedPeople)
    if (
      values.affectedPeople === '' ||
      !Number.isInteger(people) ||
      people < 0 ||
      people > 1_000_000
    ) {
      next.affectedPeople = 'Affected people must be a whole number between 0 and 1,000,000.'
    }
    if (!ROAD_ACCESS.some((item) => item.value === values.roadAccessibility)) {
      next.roadAccessibility = 'Select road accessibility.'
    }
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    const body = {
      reporterName: values.reporterName.trim(),
      phone: values.phone.trim(),
      district: values.district,
      location: values.location.trim(),
      incidentType: values.incidentType,
      severity: values.severity,
      description: values.description.trim(),
      dateTime: new Date(values.dateTime).toISOString(),
      waterLevel: Number(values.waterLevel),
      affectedPeople: Number(values.affectedPeople),
      roadAccessibility: values.roadAccessibility,
    }

    setBusy(true)
    try {
      await onSubmit(body)
    } catch (error) {
      setErrors(error.fieldErrors || {})
      setFormError(error.message || 'Could not save the incident.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="incident-form" onSubmit={handleSubmit} noValidate>
      {formError ? <p className="banner error">{formError}</p> : null}

      <div className="form-grid">
        <Field label="Reporter name" error={errors.reporterName}>
          <input
            value={values.reporterName}
            onChange={(e) => setField('reporterName', e.target.value)}
            maxLength={100}
            autoComplete="name"
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="0771234567"
            inputMode="tel"
            maxLength={15}
          />
        </Field>
        <Field label="District" error={errors.district}>
          <select value={values.district} onChange={(e) => setField('district', e.target.value)}>
            <option value="">Select district</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" error={errors.location}>
          <input
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
            placeholder="Road, GN division, or landmark"
            maxLength={200}
          />
        </Field>
        <Field label="Incident type" error={errors.incidentType}>
          <select
            value={values.incidentType}
            onChange={(e) => setField('incidentType', e.target.value)}
          >
            <option value="">Select type</option>
            {INCIDENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Severity" error={errors.severity}>
          <select value={values.severity} onChange={(e) => setField('severity', e.target.value)}>
            <option value="">Select severity</option>
            {SEVERITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date / time" error={errors.dateTime}>
          <input
            type="datetime-local"
            value={values.dateTime}
            onChange={(e) => setField('dateTime', e.target.value)}
          />
        </Field>
        <Field label="Water level (cm)" error={errors.waterLevel}>
          <input
            type="number"
            min="0"
            max="2000"
            step="1"
            value={values.waterLevel}
            onChange={(e) => setField('waterLevel', e.target.value)}
          />
        </Field>
        <Field label="Number of affected people" error={errors.affectedPeople}>
          <input
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={values.affectedPeople}
            onChange={(e) => setField('affectedPeople', e.target.value)}
          />
        </Field>
        <Field label="Road accessibility" error={errors.roadAccessibility}>
          <select
            value={values.roadAccessibility}
            onChange={(e) => setField('roadAccessibility', e.target.value)}
          >
            <option value="">Select accessibility</option>
            {ROAD_ACCESS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          rows={5}
          maxLength={1000}
          value={values.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="What happened, who is affected, and what you observed."
        />
      </Field>

      <p className="hint">{values.description.trim().length}/1000 characters (minimum 20)</p>

      <button className="btn primary" type="submit" disabled={busy}>
        {busy ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      {children}
      {error ? <em>{error}</em> : null}
    </label>
  )
}

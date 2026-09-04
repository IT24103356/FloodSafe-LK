import { ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from './common/UIComponents.jsx'
import { formatDateTime, RISK_DISCLAIMER, typeLabel } from '../constants'

export default function IncidentDetails({ incident, onDelete, deleting, message }) {
  if (!incident) return null

  const riskClass = `risk-${(incident.riskLevel || 'low').toLowerCase()}`

  return (
    <article className="details-card">
      {message ? <p className="banner success">{message}</p> : null}

      <header className="details-head">
        <div>
          <p className="eyebrow">{incident.district}</p>
          <h1>{incident.location}</h1>
        </div>
        <StatusBadge className={riskClass} tone={incident.riskLevel === 'Critical' ? 'danger' : incident.riskLevel === 'High' ? 'warning' : 'info'}>{incident.riskLevel} risk</StatusBadge>
      </header>

      {incident.isSample ? (
        <p className="sample-flag">Sample demonstration data — not a live government report.</p>
      ) : null}

      <dl className="details-grid">
        <Item label="Incident type" value={typeLabel(incident.incidentType)} />
        <Item label="Severity" value={incident.severity} />
        <Item label="Date / time" value={formatDateTime(incident.dateTime)} />
        <Item label="Affected people" value={incident.affectedPeople} />
        <Item label="Water level" value={`${incident.waterLevel} cm`} />
        <Item label="Road accessibility" value={incident.roadAccessibility} />
        <Item label="Reporter" value={incident.reporterName} />
        <Item label="Phone" value={incident.phone} />
        <Item label="Risk score" value={incident.riskScore} />
        <Item label="Risk level" value={incident.riskLevel} />
      </dl>

      <section className="details-body">
        <h2>What was reported</h2>
        <p>{incident.description}</p>
      </section>

      <p className="disclaimer">{RISK_DISCLAIMER}</p>

      <div className="details-actions">
        <Link className="btn primary" to={`/incidents/${incident.id}/edit`}>
          <Edit3 size={16} /> Edit incident
        </Link>
        <button className="btn danger" type="button" onClick={onDelete} disabled={deleting}>
          <Trash2 size={16} /> {deleting ? 'Deleting…' : 'Delete incident'}
        </button>
        <Link className="btn ghost" to="/incidents">
          <ArrowLeft size={16} /> Back to list
        </Link>
      </div>
    </article>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

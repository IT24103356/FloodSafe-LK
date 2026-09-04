import { Link } from 'react-router-dom'
import { formatDateTime, typeLabel } from '../constants'

export default function IncidentCard({ incident }) {
  const riskClass = `risk-${(incident.riskLevel || 'low').toLowerCase()}`
  const severityClass = `sev-${(incident.severity || 'low').toLowerCase()}`

  return (
    <article className={`incident-card ${riskClass}`}>
      <div className="card-top">
        <p className="card-place">
          {incident.location}
          <span>{incident.district}</span>
        </p>
        <span className={`pill ${riskClass}`}>{incident.riskLevel} risk</span>
      </div>
      <dl className="card-meta">
        <div>
          <dt>Type</dt>
          <dd>{typeLabel(incident.incidentType)}</dd>
        </div>
        <div>
          <dt>Severity</dt>
          <dd className={severityClass}>{incident.severity}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>{formatDateTime(incident.dateTime)}</dd>
        </div>
        <div>
          <dt>People affected</dt>
          <dd>{incident.affectedPeople}</dd>
        </div>
      </dl>
      {incident.isSample ? <p className="sample-flag">Sample demonstration data</p> : null}
      <Link className="card-link" to={`/incidents/${incident.id}`}>
        View details
      </Link>
    </article>
  )
}

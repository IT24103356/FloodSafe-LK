import { ArrowRight, CalendarClock, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from './common/UIComponents.jsx'
import { formatDateTime, typeLabel } from '../constants'

export default function IncidentCard({ incident }) {
  const riskClass = `risk-${(incident.riskLevel || 'low').toLowerCase()}`
  const severityClass = `sev-${(incident.severity || 'low').toLowerCase()}`

  return (
    <article className={`incident-card ${riskClass}`}>
      <div className="card-top">
        <p className="card-place">
          <MapPin size={17} aria-hidden="true" /> {incident.location}
          <span>{incident.district}</span>
        </p>
        <StatusBadge className={riskClass} tone={incident.riskLevel === 'Critical' ? 'danger' : incident.riskLevel === 'High' ? 'warning' : 'info'}>
          {incident.riskLevel} risk
        </StatusBadge>
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
          <dt><CalendarClock size={13} aria-hidden="true" /> When</dt>
          <dd>{formatDateTime(incident.dateTime)}</dd>
        </div>
        <div>
          <dt><Users size={13} aria-hidden="true" /> People affected</dt>
          <dd>{incident.affectedPeople}</dd>
        </div>
      </dl>
      <Link className="card-link" to={`/incidents/${incident.id}`}>
        View details <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  )
}

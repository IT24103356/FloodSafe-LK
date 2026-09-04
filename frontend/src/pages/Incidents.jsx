import { useEffect, useState } from 'react'
import { AlertTriangle, Plus, Waves } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import IncidentCard from '../components/IncidentCard'
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../components/common/UIComponents.jsx'
import { DISTRICTS, INCIDENT_TYPES, SEVERITIES } from '../constants'
import { getAll } from '../services/incidentService'

const EMPTY_FILTERS = {
  search: '',
  district: '',
  severity: '',
  incidentType: '',
  sortBy: 'date',
  sortDir: 'desc',
}

export default function Incidents() {
  const location = useLocation()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(location.state?.notice || '')

  useEffect(() => {
    let cancelled = false
    getAll(applied)
      .then((data) => {
        if (!cancelled) setIncidents(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setIncidents([])
          setError(err.message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [applied])

  function applyFilters(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    setApplied({ ...filters })
  }

  function resetFilters() {
    setError('')
    setLoading(true)
    setFilters(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
  }

  return (
    <section>
      <PageHeader
        eyebrow="Incident board"
        title="Flood incidents"
        description="Search verified platform records by district, severity, and incident type."
        icon={Waves}
        actions={<Link className="fs-button danger" to="/report"><Plus size={17} /> Report incident</Link>}
      />

      {notice ? (
        <p className="banner success" role="status">
          {notice}
          <button type="button" className="banner-close" onClick={() => setNotice('')}>
            Dismiss
          </button>
        </p>
      ) : null}

      <form className="filters" onSubmit={applyFilters}>
        <label>
          Search
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Location, district, reporter…"
          />
        </label>
        <label>
          District
          <select
            value={filters.district}
            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
          >
            <option value="">All districts</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
        <label>
          Severity
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          >
            <option value="">All severities</option>
            {SEVERITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Incident type
          <select
            value={filters.incidentType}
            onChange={(e) => setFilters({ ...filters, incidentType: e.target.value })}
          >
            <option value="">All types</option>
            {INCIDENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="date">Date</option>
            <option value="severity">Severity</option>
            <option value="risk">Risk score</option>
            <option value="affectedPeople">Affected people</option>
          </select>
        </label>
        <label>
          Direction
          <select
            value={filters.sortDir}
            onChange={(e) => setFilters({ ...filters, sortDir: e.target.value })}
          >
            <option value="desc">Newest / highest first</option>
            <option value="asc">Oldest / lowest first</option>
          </select>
        </label>
        <div className="filter-actions">
          <button className="btn primary" type="submit">
            Apply
          </button>
          <button className="btn ghost" type="button" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </form>

      {loading ? <LoadingState label="Loading flood incidents…" cards={4} /> : null}
      {error ? <ErrorState message="Flood incident records could not be loaded. Check the API and try again." onRetry={() => {
        setError('')
        setLoading(true)
        setApplied({ ...applied })
      }} /> : null}
      {!loading && !error && incidents.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No flood incidents found"
          message="Try changing your filters or report a new community incident."
          action={<Link className="fs-button primary" to="/report"><Plus size={16} /> Report incident</Link>}
        />
      ) : null}

      <div className="card-list" aria-live="polite">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </section>
  )
}

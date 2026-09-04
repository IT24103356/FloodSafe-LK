import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowRight, Boxes, HandHeart, MapPin, ShieldCheck,
  TentTree, Users, Waves,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/floodsafe-hero.webp'
import { EmptyState, ErrorState, LoadingState, StatCard, StatusBadge } from '../components/common/UIComponents.jsx'
import { getAll as getIncidents } from '../services/incidentService.js'
import { getSafeCentres } from '../services/safeCentreService.js'
import { getEmergencyResources } from '../services/emergencyResourceService.js'
import { getAssistanceRequests } from '../services/assistanceRequestService.js'

export default function Home() {
  const [snapshot, setSnapshot] = useState(null)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)

  const loadSnapshot = useCallback(async () => {
    setLoading(true)
    setErrors([])
    const results = await Promise.allSettled([
      getIncidents(),
      getSafeCentres(),
      getEmergencyResources(),
      getAssistanceRequests(),
    ])
    const failures = results
      .map((result, index) => result.status === 'rejected' ? ['incidents', 'safe centres', 'resources', 'assistance'][index] : null)
      .filter(Boolean)
    const value = (index, fallback = []) => results[index].status === 'fulfilled' ? results[index].value : fallback
    const resourceResult = value(2, { data: [] })
    setSnapshot({
      incidents: Array.isArray(value(0)) ? value(0) : [],
      centres: Array.isArray(value(1)) ? value(1) : [],
      resources: Array.isArray(resourceResult?.data) ? resourceResult.data : [],
      assistance: Array.isArray(value(3)) ? value(3) : [],
    })
    setErrors(failures)
    setLoading(false)
  }, [])

  useEffect(() => { loadSnapshot() }, [loadSnapshot])

  const data = useMemo(() => {
    if (!snapshot) return null
    const openCentres = snapshot.centres.filter((item) => item.availability)
    const freeSpaces = openCentres.reduce((sum, item) => sum + Math.max(0, item.availableSpaces), 0)
    const lowStock = snapshot.resources.filter((item) => item.isLowStock || item.status === 'Depleted').length
    const openAssistance = snapshot.assistance.filter((item) => item.status !== 'Resolved')
    const severity = ['Low', 'Moderate', 'High', 'Severe'].map((label) => ({
      label,
      value: snapshot.incidents.filter((item) => item.severity === label).length,
    }))
    const assistanceStatus = ['Pending', 'InProgress', 'Resolved'].map((status) => ({
      label: status === 'InProgress' ? 'In Progress' : status,
      value: snapshot.assistance.filter((item) => item.status === status).length,
    }))
    const recent = [...snapshot.incidents]
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      .slice(0, 4)
    return { openCentres, freeSpaces, lowStock, openAssistance, severity, assistanceStatus, recent }
  }, [snapshot])

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <img src={heroImage} alt="Sri Lankan community volunteers helping residents during a flood response" />
        <div className="dashboard-hero-overlay" />
        <div className="dashboard-hero-content">
          <span className="hero-kicker"><ShieldCheck size={16} /> Sri Lanka community safety network</span>
          <h1>Stay informed.<br />Stay safe.</h1>
          <p>One trusted place to report local flood conditions, find safe shelter, check emergency supplies, and request community assistance.</p>
          <div className="hero-actions">
            <Link className="fs-button danger" to="/report"><AlertTriangle size={18} /> Report flood incident</Link>
            <Link className="fs-button hero-secondary" to="/safe-centres"><TentTree size={18} /> Find safe centres</Link>
            <Link className="fs-button hero-secondary" to="/assistance"><HandHeart size={18} /> Request assistance</Link>
          </div>
        </div>
      </section>

      <section className="dashboard-section" aria-labelledby="snapshot-title">
        <div className="dashboard-section-heading">
          <div>
            <span className="fs-eyebrow">Live from platform records</span>
            <h2 id="snapshot-title">Community safety snapshot</h2>
          </div>
          <Link to="/incidents">View all activity <ArrowRight size={16} /></Link>
        </div>
        {loading && <LoadingState label="Loading the community safety snapshot…" cards={4} />}
        {!loading && !snapshot && <ErrorState onRetry={loadSnapshot} />}
        {!loading && data && (
          <>
            {errors.length > 0 && (
              <div className="dashboard-partial-warning" role="status">
                Some {errors.join(', ')} data could not be loaded. Available information is shown below.
              </div>
            )}
            <div className="fs-stats-grid">
              <StatCard icon={Waves} label="Flood incidents" value={snapshot.incidents.length} detail="Community reports" />
              <StatCard icon={TentTree} label="Available safe centres" value={data.openCentres.length} detail={`${data.freeSpaces.toLocaleString()} open spaces`} tone="success" />
              <StatCard icon={Boxes} label="Emergency resources" value={snapshot.resources.length} detail={`${data.lowStock} low or depleted`} tone={data.lowStock ? 'warning' : 'secondary'} />
              <StatCard icon={HandHeart} label="Open assistance requests" value={data.openAssistance.length} detail="Pending or in progress" tone="secondary" />
            </div>

            <div className="dashboard-grid">
              <DashboardBreakdown title="Incident severity" icon={AlertTriangle} items={data.severity} />
              <DashboardBreakdown title="Assistance workflow" icon={Users} items={data.assistanceStatus} />
              <article className="dashboard-card recent-incidents">
                <div className="dashboard-card-title">
                  <div><Waves size={19} /><h3>Recent incident reports</h3></div>
                  <Link to="/incidents">See all</Link>
                </div>
                {data.recent.length === 0 ? (
                  <EmptyState title="No reports yet" message="Community incident reports will appear here." />
                ) : data.recent.map((incident) => (
                  <Link key={incident.id} className="activity-row" to={`/incidents/${incident.id}`}>
                    <span className="activity-icon"><MapPin size={16} /></span>
                    <span><strong>{incident.location}</strong><small>{incident.district} · {new Date(incident.dateTime).toLocaleDateString()}</small></span>
                    <StatusBadge tone={incident.riskLevel === 'Critical' ? 'danger' : incident.riskLevel === 'High' ? 'warning' : 'info'}>{incident.riskLevel}</StatusBadge>
                  </Link>
                ))}
              </article>
            </div>
            <p className="dashboard-disclaimer">FloodSafe LK contains community-submitted information and is not an official government alert service.</p>
          </>
        )}
      </section>
    </div>
  )
}

function DashboardBreakdown({ title, icon: Icon, items }) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <article className="dashboard-card">
      <div className="dashboard-card-title"><div><Icon size={19} /><h3>{title}</h3></div></div>
      <div className="breakdown-list">
        {items.map((item) => (
          <div key={item.label} className="breakdown-row">
            <div><span>{item.label}</span><strong>{item.value}</strong></div>
            <span className="breakdown-track"><span style={{ width: `${(item.value / max) * 100}%` }} /></span>
          </div>
        ))}
      </div>
    </article>
  )
}

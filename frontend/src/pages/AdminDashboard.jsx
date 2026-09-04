import { useCallback, useEffect, useState } from 'react'
import { approveRequest, getAdminRequests, rejectRequest } from '../services/approvalService.js'

const hiddenKeys = new Set(['id', 'status', 'submittedAt', 'reviewedAt', 'reviewedByEmail', 'rejectionReason', 'publishedResourceId', 'publishedCentreId'])

function labelFor(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase())
}

function RequestCard({ request, type, onReviewed }) {
  const [working, setWorking] = useState(false)
  const fields = Object.entries(request).filter(([key, value]) => !hiddenKeys.has(key) && value !== null && value !== '')

  async function review(action) {
    const reason = action === 'reject'
      ? window.prompt('Enter a short rejection reason:')
      : null
    if (action === 'reject' && !reason) return
    if (action === 'approve' && !window.confirm('Approve and publish this proposal?')) return

    setWorking(true)
    try {
      if (action === 'approve') await approveRequest(type, request.id)
      else await rejectRequest(type, request.id, reason)
      onReviewed()
    } catch (error) {
      window.alert(error.message)
    } finally {
      setWorking(false)
    }
  }

  return (
    <article className="approval-card">
      <div className="approval-card-heading">
        <div>
          <strong>Request #{request.id}</strong>
          <span>Submitted {new Date(request.submittedAt).toLocaleString()}</span>
        </div>
        <span className={`status-badge ${request.status.toLowerCase()}`}>{request.status}</span>
      </div>
      <div className="approval-fields">
        {fields.map(([key, value]) => (
          <div key={key}>
            <span>{labelFor(key)}</span>
            <strong>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</strong>
          </div>
        ))}
      </div>
      {request.rejectionReason && <div className="alert error">Reason: {request.rejectionReason}</div>}
      {request.status === 'Pending' && (
        <div className="approval-actions">
          <button className="btn btn-danger" disabled={working} onClick={() => review('reject')}>Reject</button>
          <button className="btn btn-primary" disabled={working} onClick={() => review('approve')}>Approve & publish</button>
        </div>
      )}
    </article>
  )
}

export default function AdminDashboard() {
  const [type, setType] = useState('resource')
  const [status, setStatus] = useState('Pending')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRequests(await getAdminRequests(type, status))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [type, status])

  useEffect(() => { load() }, [load])

  return (
    <section className="workflow-page admin-dashboard">
      <div className="workflow-panel">
        <h1>Private Approval Queue</h1>
        <p>Requester contact details on this page are available only to authenticated administrators.</p>
        <div className="dashboard-filters">
          <div className="tab-buttons">
            <button className={type === 'resource' ? 'active' : ''} onClick={() => setType('resource')}>Resources</button>
            <button className={type === 'safe-centre' ? 'active' : ''} onClick={() => setType('safe-centre')}>Safe centres</button>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        {error && <div className="alert error">{error}</div>}
        {loading ? <p>Loading private requests…</p> : requests.length === 0 ? (
          <div className="empty-state"><p>No requests match this filter.</p></div>
        ) : (
          <div className="approval-list">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} type={type} onReviewed={load} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

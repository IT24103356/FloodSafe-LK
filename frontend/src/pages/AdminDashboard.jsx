import { useCallback, useEffect, useState } from 'react'
import { Boxes, Check, ClipboardCheck, Send, TentTree, X } from 'lucide-react'
import { ConfirmModal, EmptyState, ErrorState, LoadingState, Modal, PageHeader, StatusBadge } from '../components/common/UIComponents.jsx'
import { useToast } from '../components/common/ToastProvider.jsx'
import { approveRequest, getAdminRequests, rejectRequest } from '../services/approvalService.js'

const hiddenKeys = new Set(['id', 'status', 'submittedAt', 'reviewedAt', 'reviewedByEmail', 'rejectionReason', 'publishedResourceId', 'publishedCentreId'])

function labelFor(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase())
}

function RequestCard({ request, type, onReviewed }) {
  const [working, setWorking] = useState(false)
  const [reviewAction, setReviewAction] = useState(null)
  const [reason, setReason] = useState('')
  const { showToast } = useToast()
  const fields = Object.entries(request).filter(([key, value]) => !hiddenKeys.has(key) && value !== null && value !== '')

  async function review(action) {
    setWorking(true)
    try {
      if (action === 'approve') await approveRequest(type, request.id)
      else await rejectRequest(type, request.id, reason)
      showToast(action === 'approve' ? 'Request approved and published.' : 'Request rejected.', 'success')
      setReviewAction(null)
      setReason('')
      onReviewed()
    } catch (error) {
      showToast(error.message, 'error')
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
        <StatusBadge tone={request.status === 'Approved' ? 'success' : request.status === 'Rejected' ? 'danger' : 'warning'}>{request.status}</StatusBadge>
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
          <button className="fs-button danger" disabled={working} onClick={() => setReviewAction('reject')}><X size={16} /> Reject</button>
          <button className="fs-button primary" disabled={working} onClick={() => setReviewAction('approve')}><Check size={16} /> Approve & publish</button>
        </div>
      )}
      <ConfirmModal
        open={reviewAction === 'approve'}
        title="Approve and publish?"
        message="This creates a new public record from the proposal. The action is transactional and cannot be reviewed twice."
        confirmLabel="Approve & publish"
        danger={false}
        busy={working}
        onClose={() => setReviewAction(null)}
        onConfirm={() => review('approve')}
      />
      <Modal
        open={reviewAction === 'reject'}
        title="Reject proposal"
        description="Give the requester record a short, clear reason."
        onClose={() => setReviewAction(null)}
        size="small"
        footer={(
          <>
            <button className="fs-button secondary" type="button" onClick={() => setReviewAction(null)}>Cancel</button>
            <button className="fs-button danger" type="button" disabled={working || reason.trim().length < 3} onClick={() => review('reject')}>
              <X size={16} /> Reject request
            </button>
          </>
        )}
      >
        <label className="workflow-form">Rejection reason
          <textarea rows="4" maxLength="500" value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
      </Modal>
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
      <PageHeader
        eyebrow="Administrator workspace"
        title="Private approval queue"
        icon={ClipboardCheck}
        description="Review private addition proposals. Requester contact details are restricted to authenticated administrators."
      />
      <div className="workflow-panel">
        <div className="dashboard-filters">
          <div className="tab-buttons">
            <button className={type === 'resource' ? 'active' : ''} onClick={() => setType('resource')}><Boxes size={16} /> Resources</button>
            <button className={type === 'safe-centre' ? 'active' : ''} onClick={() => setType('safe-centre')}><TentTree size={16} /> Safe centres</button>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        {error && <ErrorState message={error} onRetry={load} />}
        {loading ? <LoadingState label="Loading private proposals…" cards={3} /> : requests.length === 0 ? (
          <EmptyState icon={Send} title="No proposals found" message="No requests match the selected type and status." />
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

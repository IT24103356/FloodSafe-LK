import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IncidentDetails from '../components/IncidentDetails'
import { ConfirmModal, ErrorState, LoadingState } from '../components/common/UIComponents.jsx'
import { useToast } from '../components/common/ToastProvider.jsx'
import { getById, remove } from '../services/incidentService'

export default function IncidentView() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message] = useState(location.state?.notice || '')
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    let cancelled = false
    getById(id)
      .then((data) => {
        if (!cancelled) setIncident(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await remove(id)
      showToast('Incident deleted successfully.')
      navigate('/incidents', { state: { notice: 'Incident deleted from PostgreSQL.' } })
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <section className="narrow">
      {loading ? <LoadingState label="Loading incident details…" cards={2} /> : null}
      {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
      {!loading && !error && incident ? (
        <IncidentDetails
          incident={incident}
          onDelete={() => setConfirmDelete(true)}
          deleting={deleting}
          message={message}
        />
      ) : null}
      <ConfirmModal
        open={confirmDelete}
        title="Delete flood incident?"
        message={`This will permanently delete the report for ${incident?.location || 'this location'}. This action cannot be undone.`}
        confirmLabel="Delete incident"
        busy={deleting}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </section>
  )
}

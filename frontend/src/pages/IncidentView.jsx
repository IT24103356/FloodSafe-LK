import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IncidentDetails from '../components/IncidentDetails'
import { getById, remove } from '../services/incidentService'

export default function IncidentView() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState(location.state?.notice || '')
  const [deleting, setDeleting] = useState(false)

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
    const confirmed = window.confirm(
      'Delete this incident from the database? This cannot be undone.',
    )
    if (!confirmed) {
      setMessage('Delete cancelled. The incident was not removed.')
      return
    }
    setDeleting(true)
    try {
      await remove(id)
      navigate('/incidents', { state: { notice: 'Incident deleted from PostgreSQL.' } })
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <section className="narrow">
      {loading ? <p className="muted">Loading incident…</p> : null}
      {error ? <p className="banner error">{error}</p> : null}
      {!loading && !error && incident ? (
        <IncidentDetails
          incident={incident}
          onDelete={handleDelete}
          deleting={deleting}
          message={message}
        />
      ) : null}
    </section>
  )
}

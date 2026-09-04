import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import IncidentForm from '../components/IncidentForm'
import { create, getById, update } from '../services/incidentService'

export default function ReportIncident() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    getById(id)
      .then((data) => {
        if (!cancelled) setInitial(data)
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
  }, [id, isEdit])

  async function handleSubmit(body) {
    if (isEdit) {
      await update(id, body)
      navigate(`/incidents/${id}`, { state: { notice: 'Incident updated and saved to PostgreSQL.' } })
      return
    }
    const created = await create(body)
    navigate(`/incidents/${created.id}`, {
      state: { notice: 'Incident reported. Risk score was calculated on the server.' },
    })
  }

  return (
    <section className="narrow">
      <header className="page-head">
        <div>
          <p className="eyebrow">{isEdit ? 'Update record' : 'New report'}</p>
          <h1>{isEdit ? 'Edit flood incident' : 'Report a flood incident'}</h1>
          <p>
            {isEdit
              ? 'Change the details below. Saving recalculates the prototype risk score.'
              : 'Describe what you can see on the ground. Required fields are validated in the browser and again by the API.'}
          </p>
        </div>
      </header>

      {loading ? <p className="muted">Loading incident…</p> : null}
      {error ? <p className="banner error">{error}</p> : null}
      {!loading && !error ? (
        <IncidentForm
          key={id || 'create'}
          initial={initial}
          submitLabel={isEdit ? 'Save changes' : 'Submit report'}
          onSubmit={handleSubmit}
        />
      ) : null}
    </section>
  )
}

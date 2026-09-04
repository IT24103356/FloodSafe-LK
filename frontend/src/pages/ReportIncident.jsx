import { useEffect, useState } from 'react'
import { ClipboardPenLine } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import IncidentForm from '../components/IncidentForm'
import { ErrorState, LoadingState, PageHeader } from '../components/common/UIComponents.jsx'
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
      <PageHeader
        eyebrow={isEdit ? 'Update record' : 'Emergency reporting'}
        title={isEdit ? 'Edit flood incident' : 'Report a flood incident'}
        icon={ClipboardPenLine}
        description={isEdit
          ? 'Update the report carefully. Saving recalculates the transparent prototype risk score.'
          : 'Describe current ground conditions. Required fields are checked here and securely validated by the API.'}
      />

      {loading ? <LoadingState label="Loading incident form…" cards={2} /> : null}
      {error ? <ErrorState message={error} /> : null}
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

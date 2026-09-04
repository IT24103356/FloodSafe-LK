import { useState } from 'react'
import { AlertCircle, LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/common/ToastProvider.jsx'
import { loginAdmin } from '../services/approvalService.js'

export default function AdminLogin() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (auth.isAdmin) return <Navigate to="/admin" replace />

  async function submit(event) {
    event.preventDefault()
    const email = form.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const message = 'Enter a valid administrator email address.'
      setError(message)
      showToast(message, 'error')
      return
    }
    if (!form.password) {
      const message = 'Enter your administrator password.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setLoading(true)
    setError('')
    try {
      const session = await loginAdmin({ ...form, email })
      auth.login(session)
      navigate(location.state?.from ?? '/admin', { replace: true })
    } catch (err) {
      const message =
        err.message === 'Failed to fetch'
          ? 'Unable to reach the authentication service. Check that the API is running.'
          : err.message || 'The email or password is incorrect.'
      setError(message)
      showToast(message, 'error')
      setForm((current) => ({ ...current, password: '' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="workflow-page narrow-page">
      <div className="workflow-panel">
        <span className="login-shield"><ShieldCheck size={28} aria-hidden="true" /></span>
        <span className="fs-eyebrow">Restricted access</span>
        <h1>Administrator sign in</h1>
        <p>Sign in to review private proposals and manage published records.</p>
        {error && (
          <div className="login-error" role="alert" aria-live="assertive">
            <AlertCircle size={21} aria-hidden="true" />
            <div>
              <strong>Sign-in failed</strong>
              <span>{error}</span>
            </div>
          </div>
        )}
        <form className="workflow-form" onSubmit={submit} noValidate>
          <label>Email
            <input type="email" required autoComplete="username" value={form.email} aria-invalid={Boolean(error)}
              onChange={(e) => { setError(''); setForm({ ...form, email: e.target.value }) }} />
          </label>
          <label>Password
            <input type="password" required autoComplete="current-password" value={form.password} aria-invalid={Boolean(error)}
              onChange={(e) => { setError(''); setForm({ ...form, password: e.target.value }) }} />
          </label>
          <button className="fs-button primary" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={17} /> : <LockKeyhole size={17} />}
            {loading ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>
      </div>
    </section>
  )
}

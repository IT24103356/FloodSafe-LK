import { useState } from 'react'
import { LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { loginAdmin } from '../services/approvalService.js'

export default function AdminLogin() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (auth.isAdmin) return <Navigate to="/admin" replace />

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const session = await loginAdmin(form)
      auth.login(session)
      navigate(location.state?.from ?? '/admin', { replace: true })
    } catch (err) {
      setError(err.message)
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
        {error && <div className="alert error" role="alert">{error}</div>}
        <form className="workflow-form" onSubmit={submit}>
          <label>Email
            <input type="email" required autoComplete="username" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Password
            <input type="password" required autoComplete="current-password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
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

import { useState } from 'react'
import {
  AlertTriangle, Boxes, HandHeart, Home, LogIn, LogOut,
  Menu, ShieldCheck, TentTree, Waves, X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/', label: 'Dashboard', Icon: Home, end: true },
  { to: '/incidents', label: 'Flood Incidents', Icon: Waves },
  { to: '/safe-centres', label: 'Safe Centres', Icon: TentTree },
  { to: '/resources', label: 'Resources', Icon: Boxes },
  { to: '/assistance', label: 'Assistance', Icon: HandHeart },
]

export default function AppHeader() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function logout() {
    auth.logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="app-header-shell">
      <div className="app-header-inner">
        <NavLink className="brand-lockup" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={25} />
            <Waves className="brand-wave" size={14} />
          </span>
          <span>
            <strong>FloodSafe LK</strong>
            <small>Community safety network</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="mobile-menu-button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`header-navigation ${open ? 'open' : ''}`} id="primary-navigation">
          <nav aria-label="Primary navigation">
            {links.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}>
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <NavLink className="report-nav-button" to="/report" onClick={() => setOpen(false)}>
              <AlertTriangle size={17} aria-hidden="true" />
              Report incident
            </NavLink>
            <ThemeToggle />
            {auth.isAdmin ? (
              <>
                <NavLink className="admin-link" to="/admin" onClick={() => setOpen(false)}>Admin Queue</NavLink>
                <button type="button" className="icon-text-button" onClick={logout}>
                  <LogOut size={17} aria-hidden="true" /> Logout
                </button>
              </>
            ) : (
              <NavLink className="icon-text-button" to="/admin/login" onClick={() => setOpen(false)}>
                <LogIn size={17} aria-hidden="true" /> Admin
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

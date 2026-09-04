import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function App() {
  const auth = useAuth()
  const navigate = useNavigate()

  function logout() {
    auth.logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand">
          FloodSafe LK
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/incidents">Incidents</NavLink>
          <NavLink to="/report">Report</NavLink>
          <NavLink to="/safe-centres">Safe Centres</NavLink>
          <NavLink to="/resources">Emergency Resources</NavLink>
          <NavLink to="/assistance">Assistance Requests</NavLink>
          {auth.isAdmin ? (
            <>
              <NavLink to="/admin">Admin Queue</NavLink>
              <button className="nav-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <NavLink to="/admin/login">Admin Login</NavLink>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          Flood Incident Management (IT24103356) · Safe Centre Management (IT24101739) · Emergency
          Resources (IT24102615) · Community Assistance (IT24102706)
        </p>
        <p>Demonstration prototype — not official disaster information.</p>
      </footer>
    </div>
  )
}

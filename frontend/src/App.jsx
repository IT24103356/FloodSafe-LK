import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
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
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Flood Incident Management · Member: Kowdu.A.B (IT24103356)</p>
        <p>Demonstration prototype — not official disaster information.</p>
      </footer>
    </div>
  )
}

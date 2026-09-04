import { Outlet } from 'react-router-dom'
import AppHeader from './components/common/AppHeader.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>
            <strong>FloodSafe LK</strong>
            <p>Community flood information and rapid assistance for Sri Lanka.</p>
          </div>
          <div>
            <strong>University demonstration prototype</strong>
            <p>Not official disaster information. Verify emergencies with Sri Lankan authorities.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import './styles/tokens.css'
import './styles/base.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './components/common/ToastProvider.jsx'
import Home from './pages/Home.jsx'
import IncidentView from './pages/IncidentView.jsx'
import Incidents from './pages/Incidents.jsx'
import ReportIncident from './pages/ReportIncident.jsx'
import EmergencyResources from './pages/EmergencyResources.jsx'
import SafeCentres from './pages/SafeCentres.jsx'
import AssistanceRequestsPage from './pages/AssistanceRequestsPage.jsx'
import AdditionRequestPage from './pages/AdditionRequestPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import './index.css'
import './styles/unified-theme.css'
import './styles/components.css'
import './styles/dashboard.css'
import './styles/features.css'
import './styles/responsive.css'

function ProtectedRoute({ children }) {
  const auth = useAuth()
  const location = useLocation()
  return auth.isAdmin ? children : <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/incidents/:id" element={<IncidentView />} />
            <Route path="/incidents/:id/edit" element={<ReportIncident />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/resources" element={<EmergencyResources />} />
            <Route path="/safe-centres" element={<SafeCentres />} />
            <Route path="/request-resource" element={<AdditionRequestPage type="resource" />} />
            <Route path="/request-safe-centre" element={<AdditionRequestPage type="safe-centre" />} />
            <Route path="/assistance" element={<AssistanceRequestsPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

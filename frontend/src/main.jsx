import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import IncidentView from './pages/IncidentView.jsx'
import Incidents from './pages/Incidents.jsx'
import ReportIncident from './pages/ReportIncident.jsx'
import EmergencyResources from './pages/EmergencyResources.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<IncidentView />} />
          <Route path="/incidents/:id/edit" element={<ReportIncident />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/resources" element={<EmergencyResources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

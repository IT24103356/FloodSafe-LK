import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="home">
      <div className="hero-copy">
        <p className="eyebrow">FloodSafe LK · Sri Lanka</p>
        <h1>Community flood incident reporting for places that flood every monsoon.</h1>
        <p className="lede">
          Families in Kolonnawa, Kaduwela, Ratnapura and the Kelani and Kalu basins often learn
          about flooded roads and rising water from neighbours — not from a single, simple record.
          FloodSafe LK lets residents log what they see so a community can share one picture of
          the incident.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/report">
            Report an incident
          </Link>
          <Link className="btn ghost" to="/incidents">
            Browse reports
          </Link>
          <Link className="btn secondary" to="/safe-centres">
            Find Safe Centres
          </Link>
        </div>
      </div>

      <aside className="home-panel">
        <h2>Who this helps</h2>
        <ul>
          <li>Households deciding whether a road is still passable</li>
          <li>Neighbours checking water level and how many people are affected nearby</li>
          <li>Families finding nearby emergency shelters and available capacity</li>
          <li>Local volunteers triaging reports by district, type and severity</li>
        </ul>
        <p className="disclaimer">
          Sample records in this prototype are demonstration data. They are not official alerts
          from the Disaster Management Centre, NBRO, or any government agency.
        </p>
      </aside>
    </section>
  )
}

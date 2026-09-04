/**
 * SafeCentreFilters component
 * Search bar + district dropdown + availability filter
 * Author: Maddegoda M.V.S. | IT24101739
 */
import React from 'react';

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

function SafeCentreFilters({ filters, onChange }) {
  function handle(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="filters-bar">
      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          id="filter-search"
          type="search"
          className="search-input"
          placeholder="Search by name, address, or facilities…"
          value={filters.search}
          onChange={e => handle('search', e.target.value)}
          aria-label="Search safe centres"
        />
      </div>

      {/* District */}
      <select
        id="filter-district"
        className="filter-select"
        value={filters.district}
        onChange={e => handle('district', e.target.value)}
        aria-label="Filter by district"
      >
        <option value="">All Districts</option>
        {SRI_LANKA_DISTRICTS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Availability */}
      <select
        id="filter-availability"
        className="filter-select"
        value={filters.availability}
        onChange={e => handle('availability', e.target.value)}
        aria-label="Filter by availability"
      >
        <option value="">All Status</option>
        <option value="true">Open</option>
        <option value="false">Closed</option>
      </select>
    </div>
  );
}

export { SRI_LANKA_DISTRICTS };
export default SafeCentreFilters;

import React from 'react';

const DISTRICTS = [
  'Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha',
  'Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala',
  'Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa',
  'Puttalam','Ratnapura','Trincomalee','Vavuniya'
];

const REQUEST_TYPES = ['Food','Water','Medical','Transport','Evacuation','Shelter','Other'];
const PRIORITIES = ['Low','Medium','High','Critical'];
const STATUSES = [
  { value: 'Pending', label: 'Pending' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

export default function FilterBar({ filters, onChange }) {
  const set = (field) => (e) => onChange((f) => ({ ...f, [field]: e.target.value }));
  const clear = () => onChange({ search: '', district: '', requestType: '', priority: '', status: '' });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="filter-bar" role="search" aria-label="Filter assistance requests">
      {/* Search */}
      <div className="filter-group" style={{ flex: 2, minWidth: 220 }}>
        <label htmlFor="filter-search">Search</label>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="filter-search"
            type="search"
            value={filters.search}
            onChange={set('search')}
            placeholder="Name, location, description…"
            className="with-icon"
            aria-label="Search requests"
          />
        </div>
      </div>

      {/* District */}
      <div className="filter-group">
        <label htmlFor="filter-district">District</label>
        <select id="filter-district" value={filters.district} onChange={set('district')} aria-label="Filter by district">
          <option value="">All Districts</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Request Type */}
      <div className="filter-group">
        <label htmlFor="filter-type">Request Type</label>
        <select id="filter-type" value={filters.requestType} onChange={set('requestType')} aria-label="Filter by request type">
          <option value="">All Types</option>
          {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Priority */}
      <div className="filter-group">
        <label htmlFor="filter-priority">Priority</label>
        <select id="filter-priority" value={filters.priority} onChange={set('priority')} aria-label="Filter by priority">
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Status */}
      <div className="filter-group">
        <label htmlFor="filter-status">Status</label>
        <select id="filter-status" value={filters.status} onChange={set('status')} aria-label="Filter by status">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <div className="filter-group" style={{ minWidth: 'auto', justifyContent: 'flex-end' }}>
          <label style={{ visibility: 'hidden' }}>_</label>
          <button id="btn-clear-filters" className="btn btn-secondary btn-sm" onClick={clear} aria-label="Clear all filters">
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  );
}

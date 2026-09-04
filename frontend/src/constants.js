export const DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
]

export const INCIDENT_TYPES = [
  { value: 'FlashFlood', label: 'Flash flood' },
  { value: 'RiverOverflow', label: 'River overflow' },
  { value: 'UrbanFlooding', label: 'Urban flooding' },
  { value: 'LandslideRelated', label: 'Landslide-related flooding' },
  { value: 'CoastalFlooding', label: 'Coastal flooding' },
  { value: 'ReservoirOverflow', label: 'Reservoir overflow' },
]

export const SEVERITIES = ['Low', 'Moderate', 'High', 'Severe']

export const ROAD_ACCESS = [
  { value: 'Open', label: 'Open' },
  { value: 'Restricted', label: 'Restricted' },
  { value: 'Closed', label: 'Closed' },
]

export const PHONE_PATTERN = /^(\+94|0)7[0-9]{8}$/

export const RISK_DISCLAIMER =
  'This is a prototype risk calculation for demonstration purposes and is not an official disaster prediction.'

export function typeLabel(value) {
  return INCIDENT_TYPES.find((item) => item.value === value)?.label ?? value
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

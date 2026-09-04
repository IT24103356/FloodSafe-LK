const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5203'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      ...options,
    })
  } catch {
    const error = new Error(
      'Could not reach the FloodSafe LK API. Check that the backend is running on http://localhost:5203.',
    )
    error.status = 0
    error.fieldErrors = {}
    throw error
  }

  if (response.status === 204) {
    return null
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const error = new Error(messageFrom(response.status, payload))
    error.status = response.status
    error.fieldErrors = fieldErrorsFrom(payload)
    error.payload = payload
    throw error
  }

  return payload
}

async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { title: text }
  }
}

function messageFrom(status, payload) {
  if (status === 400) {
    return payload?.title || payload?.detail || 'Please correct the highlighted fields and try again.'
  }
  if (status === 404) {
    return payload?.detail || payload?.title || 'That incident could not be found.'
  }
  if (status >= 500) {
    return 'The server ran into a problem. Please try again in a moment.'
  }
  return payload?.detail || payload?.title || 'Something went wrong. Please try again.'
}

function fieldErrorsFrom(payload) {
  const errors = payload?.errors
  if (!errors || typeof errors !== 'object') return {}
  const mapped = {}
  for (const [key, value] of Object.entries(errors)) {
    const name = key.replace(/^\$\.?/, '').replace(/^\w/, (c) => c.toLowerCase())
    const camel = name.includes('.') ? name.split('.').pop() : name
    const field = camel.charAt(0).toLowerCase() + camel.slice(1)
    mapped[field] = Array.isArray(value) ? value[0] : String(value)
  }
  return mapped
}

function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, String(value).trim())
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function getAll(params) {
  return request(`/api/incidents${toQuery(params)}`)
}

export function getById(id) {
  return request(`/api/incidents/${id}`)
}

export function create(body) {
  return request('/api/incidents', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function update(id, body) {
  return request(`/api/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function remove(id) {
  return request(`/api/incidents/${id}`, {
    method: 'DELETE',
  })
}

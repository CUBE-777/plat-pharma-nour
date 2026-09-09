const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function getPharmacyStatus(openingHours) {
  const now = new Date()
  const dayKey = DAY_KEYS[now.getDay()]
  const today = openingHours?.[dayKey]

  if (!today || today.closed || !today.open || !today.close) {
    return { isOpen: false, today }
  }

  const openParts = String(today.open).split(':').map(Number)
  const closeParts = String(today.close).split(':').map(Number)
  if (openParts.length < 2 || closeParts.length < 2 || isNaN(openParts[0]) || isNaN(closeParts[0])) {
    return { isOpen: false, today }
  }

  const openMinutes = openParts[0] * 60 + (openParts[1] || 0)
  const closeMinutes = closeParts[0] * 60 + (closeParts[1] || 0)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  // Support overnight shifts (e.g. 20:00 to 02:00)
  const isOpen = closeMinutes >= openMinutes
    ? nowMinutes >= openMinutes && nowMinutes <= closeMinutes
    : nowMinutes >= openMinutes || nowMinutes <= closeMinutes

  return { isOpen, today }
}

export const DAY_ORDER = DAY_KEYS

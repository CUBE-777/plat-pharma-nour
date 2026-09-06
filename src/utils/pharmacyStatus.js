const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function getPharmacyStatus(openingHours) {
  const now = new Date()
  const dayKey = DAY_KEYS[now.getDay()]
  const today = openingHours?.[dayKey]

  if (!today || today.closed) {
    return { isOpen: false, today }
  }

  const [openH, openM] = today.open.split(':').map(Number)
  const [closeH, closeM] = today.close.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const isOpen = nowMinutes >= openMinutes && nowMinutes <= closeMinutes
  return { isOpen, today }
}

export const DAY_ORDER = DAY_KEYS

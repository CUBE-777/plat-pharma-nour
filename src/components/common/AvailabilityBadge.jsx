import { useLang } from '../../i18n/LanguageContext'

const MAP = {
  available: { cls: 'badge-success', dot: '🟢', key: 'status.available' },
  limited: { cls: 'badge-warning', dot: '🟠', key: 'status.limited' },
  out: { cls: 'badge-danger', dot: '🔴', key: 'status.outOfStock' },
}

export default function AvailabilityBadge({ status }) {
  const { t } = useLang()
  const info = MAP[status] || MAP.available
  return (
    <span className={`badge ${info.cls}`}>
      <span>{info.dot}</span>
      {t(info.key)}
    </span>
  )
}

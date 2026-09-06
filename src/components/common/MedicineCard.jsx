import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import AvailabilityBadge from './AvailabilityBadge'

export default function MedicineCard({ medicine }) {
  const { t, tf } = useLang()
  return (
    <Link to={`/medicines/${medicine.id}`} className="card fade-up" style={{ overflow: 'hidden', display: 'block' }}>
      <div style={{ height: 150, overflow: 'hidden', position: 'relative', background: 'var(--bg-elevated)' }}>
        <img src={medicine.image} alt={medicine.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, insetInlineEnd: 10 }}>
          <AvailabilityBadge status={medicine.availability} />
        </div>
      </div>
      <div className="card-pad" style={{ paddingTop: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 4 }}>{medicine.name}</div>
        <div className="text-secondary" style={{ fontSize: 13, marginBottom: 10 }}>
          {tf(medicine.activeIngredient)} · {tf(medicine.form)} · {medicine.concentration}
        </div>
        <div className="flex-between">
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--accent)' }}>
            {medicine.price} {t('common.currency')}
          </span>
          <span className="text-muted" style={{ fontSize: 12.5, fontWeight: 700 }}>{t('common.viewDetails')} ←</span>
        </div>
      </div>
    </Link>
  )
}

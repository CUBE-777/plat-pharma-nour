import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import { getPharmacyStatus } from '../../utils/pharmacyStatus'

export default function PharmacyStatus({ compact = false }) {
  const { t } = useLang()
  const { pharmacyInfo } = useData()
  const { isOpen, today } = getPharmacyStatus(pharmacyInfo.openingHours)

  if (compact) {
    return (
      <span className="badge" style={{ background: isOpen ? 'color-mix(in srgb, var(--success) 16%, transparent)' : 'color-mix(in srgb, var(--danger) 16%, transparent)', color: isOpen ? 'var(--success)' : 'var(--danger)' }}>
        <span className={`dot ${isOpen ? 'dot-success' : 'dot-danger'}`} />
        {isOpen ? t('status.open') : t('status.closed')}
      </span>
    )
  }

  return (
    <div className="card card-pad flex-between fade-up" style={{ flexWrap: 'wrap', gap: 16 }}>
      <div className="flex-center gap-3">
        <span
          className={isOpen ? 'pulse' : ''}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            background: isOpen ? 'color-mix(in srgb, var(--success) 18%, transparent)' : 'color-mix(in srgb, var(--danger) 18%, transparent)',
          }}
        >
          {isOpen ? '🟢' : '🔴'}
        </span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{isOpen ? t('status.open') : t('status.closed')}</div>
          {today && !today.closed && (
            <div className="text-secondary" style={{ fontSize: 13 }}>
              {t('status.opensAt')} {today.open} — {t('status.closesAt')} {today.close}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'

export default function ServicesPreview() {
  const { t, tf } = useLang()
  const { services } = useData()
  const active = services.filter((s) => s.active).slice(0, 6)

  return (
    <section className="section" style={{ background: 'var(--bg-elevated)' }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">🩺 {t('nav.services')}</span>
          <h2 className="section-title">{t('home.servicesTitle')}</h2>
          <p className="section-subtitle">{t('home.servicesSubtitle')}</p>
        </div>
        <div className="grid grid-3">
          {active.map((s) => (
            <div key={s.id} className="card card-pad fade-up">
              <div
                className="flex-center"
                style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--gradient-accent)', fontSize: 24, marginBottom: 16 }}
              >
                {s.icon}
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{tf(s.name)}</div>
              <p className="text-secondary truncate-2" style={{ fontSize: 13.5, lineHeight: 1.7 }}>{tf(s.shortDesc)}</p>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 32 }}>
          <Link to="/services" className="btn btn-secondary">{t('common.viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}

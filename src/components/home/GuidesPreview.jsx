import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'

export default function GuidesPreview() {
  const { t, tf } = useLang()
  const { healthGuides } = useData()
  const active = healthGuides.filter((g) => g.active).slice(0, 3)

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">📘 {t('nav.guides')}</span>
          <h2 className="section-title">{t('home.guidesTitle')}</h2>
          <p className="section-subtitle">{t('home.guidesSubtitle')}</p>
        </div>
        <div className="grid grid-3">
          {active.map((g) => (
            <Link to={`/health-guides/${g.id}`} key={g.id} className="card fade-up" style={{ overflow: 'hidden', display: 'block' }}>
              <div style={{ height: 150, overflow: 'hidden' }}>
                <img src={g.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-pad">
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{tf(g.title)}</div>
                <p className="text-secondary truncate-2" style={{ fontSize: 13, lineHeight: 1.7 }}>{tf(g.intro)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 32 }}>
          <Link to="/health-guides" className="btn btn-secondary">{t('common.viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}

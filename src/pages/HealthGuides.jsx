import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'

export default function HealthGuides() {
  const { t, tf } = useLang()
  const { healthGuides, guideCategories } = useData()
  const [activeCat, setActiveCat] = useState('all')

  const filtered = useMemo(() => {
    return healthGuides.filter((g) => g.active && (activeCat === 'all' || g.categoryId === activeCat))
  }, [healthGuides, activeCat])

  return (
    <div className="page">
      <div className="section-sm" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">📘 {t('nav.guides')}</span>
          <h1 className="section-title">{t('guides.title')}</h1>
          <p className="section-subtitle">{t('guides.subtitle')}</p>
        </div>
      </div>

      <div className="container section">
        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: 30 }}>
          <button
            className="btn btn-sm"
            style={{ background: activeCat === 'all' ? 'var(--gradient-accent)' : 'var(--bg-card)', color: activeCat === 'all' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)' }}
            onClick={() => setActiveCat('all')}
          >
            {t('common.all')}
          </button>
          {guideCategories.map((c) => (
            <button
              key={c.id}
              className="btn btn-sm"
              style={{ background: activeCat === c.id ? 'var(--gradient-accent)' : 'var(--bg-card)', color: activeCat === c.id ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)' }}
              onClick={() => setActiveCat(c.id)}
            >
              {c.icon} {tf(c.name)}
            </button>
          ))}
        </div>

        <div className="grid grid-3">
          {filtered.map((g) => (
            <Link to={`/health-guides/${g.id}`} key={g.id} className="card fade-up" style={{ overflow: 'hidden', display: 'block' }}>
              <div style={{ height: 160, overflow: 'hidden' }}>
                <img src={g.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-pad">
                <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 8 }}>{tf(g.title)}</div>
                <p className="text-secondary truncate-3" style={{ fontSize: 13, lineHeight: 1.7 }}>{tf(g.intro)}</p>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted" style={{ padding: '40px 0' }}>{t('common.noResults')}</p>}
      </div>
    </div>
  )
}

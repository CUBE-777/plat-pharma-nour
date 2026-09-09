import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'

export default function HealthGuideDetail() {
  const { id } = useParams()
  const { t, tf, dir } = useLang()
  const { healthGuides, guideCategories } = useData()

  const guide = healthGuides.find((g) => g.id === id)
  if (!guide) return <Navigate to="/health-guides" replace />

  const category = guideCategories.find((c) => c.id === guide.categoryId)
  const keyPoints = Array.isArray(tf(guide.keyPoints)) ? tf(guide.keyPoints).filter(Boolean) : []
  const tips = Array.isArray(tf(guide.tips)) ? tf(guide.tips).filter(Boolean) : []

  return (
    <div className="page">
      <div className="container section-sm">
        <Link to="/health-guides" className="text-muted" style={{ fontSize: 13.5, fontWeight: 700 }}>
          {dir === 'rtl' ? '→' : '←'} {t('nav.guides')}
        </Link>

        <div className="fade-up" style={{ marginTop: 18 }}>
          {category && <span className="eyebrow">{category.icon} {tf(category.name)}</span>}
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: '10px 0 20px' }}>{tf(guide.title)}</h1>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 28 }}>
            <img
              src={guide.cover || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&auto=format&fit=crop&q=80'}
              alt={tf(guide.title) || ''}
              style={{ width: '100%', maxHeight: 340, objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&auto=format&fit=crop&q=80' }}
            />
          </div>
        </div>

        <div className="article-grid">
          <div className="card card-pad fade-up">
            <div style={{ fontWeight: 800, color: 'var(--accent)', marginBottom: 10, fontSize: 14 }}>{t('guides.intro')}</div>
            <p style={{ lineHeight: 1.9, color: 'var(--text-secondary)' }}>{tf(guide.intro)}</p>
          </div>

          <div className="card card-pad fade-up">
            <div style={{ fontWeight: 800, color: 'var(--accent)', marginBottom: 14, fontSize: 14 }}>{t('guides.keyPoints')}</div>
            <ul style={{ margin: 0, paddingInlineStart: 20, color: 'var(--text-secondary)', lineHeight: 2 }}>
              {keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="card card-pad fade-up">
            <div style={{ fontWeight: 800, color: 'var(--accent)', marginBottom: 14, fontSize: 14 }}>{t('guides.tips')}</div>
            <ul style={{ margin: 0, paddingInlineStart: 20, color: 'var(--text-secondary)', lineHeight: 2 }}>
              {tips.map((tip, i) => (
                <li key={i}>💡 {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="glass"
          style={{ marginTop: 28, padding: '16px 20px', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)', borderColor: 'color-mix(in srgb, var(--warning) 40%, var(--border))' }}
        >
          ⚠️ {t('guides.disclaimer')}
        </div>
      </div>
      <style>{`.article-grid { display:grid; gap:20px; }`}</style>
    </div>
  )
}

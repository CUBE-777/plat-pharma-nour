import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import PharmacyStatus from '../common/PharmacyStatus'

export default function Hero() {
  const { t } = useLang()
  return (
    <section
      style={{
        background: 'var(--gradient-hero)',
        padding: '76px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="hero-grid">
          <div className="fade-up">
            <span className="eyebrow">💊 Pharma+ Digital Platform</span>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
              {t('hero.title')}
            </h1>
            <p className="text-secondary" style={{ fontSize: 16.5, lineHeight: 1.8, maxWidth: 520, marginBottom: 30 }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex-center gap-3" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: 28 }}>
              <Link to="/medicines" className="btn btn-primary">🔍 {t('hero.ctaSearch')}</Link>
              <Link to="/services" className="btn btn-secondary">{t('hero.ctaServices')}</Link>
            </div>
            <div className="flex-center gap-4 hero-trust" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <span className="text-secondary" style={{ fontSize: 13, fontWeight: 600 }}>✅ {t('hero.trust1')}</span>
              <span className="text-secondary" style={{ fontSize: 13, fontWeight: 600 }}>🛡️ {t('hero.trust2')}</span>
              <span className="text-secondary" style={{ fontSize: 13, fontWeight: 600 }}>⚡ {t('hero.trust3')}</span>
            </div>
          </div>

          <div className="fade-up" style={{ animationDelay: '0.1s' }}>
            <PharmacyStatus />
            <div className="card card-pad" style={{ marginTop: 16 }}>
              <div className="flex-center gap-3">
                <span style={{ fontSize: 30 }}>🧪</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>+ 500 {t('nav.medicines')}</div>
                  <div className="text-muted" style={{ fontSize: 12.5 }}>Demo catalogue</div>
                </div>
              </div>
            </div>
            <div className="card card-pad" style={{ marginTop: 16 }}>
              <div className="flex-center gap-3">
                <span style={{ fontSize: 30 }}>👨‍⚕️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t('team.title')}</div>
                  <div className="text-muted" style={{ fontSize: 12.5 }}>{t('hero.trust1')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 48px; align-items: center; }
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  )
}

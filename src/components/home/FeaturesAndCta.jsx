import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import InquiryModal from '../common/InquiryModal'
import AskPharmacistModal from '../common/AskPharmacistModal'

export function FeaturesStrip() {
  const { t } = useLang()
  const features = [
    { icon: '⚡', title: t('home.feature1Title'), desc: t('home.feature1Desc') },
    { icon: '🛡️', title: t('home.feature2Title'), desc: t('home.feature2Desc') },
    { icon: '📍', title: t('home.feature3Title'), desc: t('home.feature3Desc') },
  ]
  return (
    <section className="section" style={{ background: 'var(--bg-elevated)' }}>
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">{t('home.featuresTitle')}</h2>
        </div>
        <div className="grid grid-3">
          {features.map((f, i) => (
            <div key={i} className="card card-pad text-center fade-up">
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <p className="text-secondary" style={{ fontSize: 13.5, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AskCta() {
  const { t } = useLang()
  const [askOpen, setAskOpen] = useState(false)
  const [inquireOpen, setInquireOpen] = useState(false)

  return (
    <section className="section">
      <div className="container">
        <div
          className="card card-pad text-center fade-up"
          style={{
            padding: '52px 32px',
            background: 'var(--gradient-accent)',
            border: 'none',
            color: '#fff',
          }}
        >
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, margin: '0 0 10px' }}>{t('home.ctaAskTitle')}</h2>
          <p style={{ opacity: 0.92, marginBottom: 26 }}>{t('home.ctaAskSubtitle')}</p>
          <div className="flex-center gap-3" style={{ flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#fff', color: '#0d9488' }} onClick={() => setAskOpen(true)}>
              💬 {t('home.askPharmacist')}
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }} onClick={() => setInquireOpen(true)}>
              💊 {t('home.inquireMedicine')}
            </button>
          </div>
        </div>
      </div>
      <AskPharmacistModal open={askOpen} onClose={() => setAskOpen(false)} />
      <InquiryModal open={inquireOpen} onClose={() => setInquireOpen(false)} />
    </section>
  )
}

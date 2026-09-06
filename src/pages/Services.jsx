import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'
import Modal from '../components/common/Modal'

export default function Services() {
  const { t, tf } = useLang()
  const { services } = useData()
  const [selected, setSelected] = useState(null)
  const active = services.filter((s) => s.active)

  return (
    <div className="page">
      <div className="section-sm" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">🩺 {t('nav.services')}</span>
          <h1 className="section-title">{t('services.title')}</h1>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </div>
      </div>

      <div className="container section">
        <div className="grid grid-3">
          {active.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="card card-pad fade-up text-start"
              style={{ textAlign: 'start', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
            >
              <div className="flex-center" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-accent)', fontSize: 26, marginBottom: 18 }}>
                {s.icon}
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{tf(s.name)}</div>
              <p className="text-secondary" style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>{tf(s.shortDesc)}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{t('services.learnMore')} ←</span>
            </button>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? tf(selected.name) : ''}>
        {selected && (
          <div>
            <div className="flex-center" style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--gradient-accent)', fontSize: 28, marginBottom: 18 }}>
              {selected.icon}
            </div>
            <p className="text-secondary" style={{ lineHeight: 1.8 }}>{tf(selected.details)}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

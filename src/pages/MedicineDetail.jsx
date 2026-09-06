import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'
import AvailabilityBadge from '../components/common/AvailabilityBadge'
import InquiryModal from '../components/common/InquiryModal'

export default function MedicineDetail() {
  const { id } = useParams()
  const { t, tf } = useLang()
  const { medicines, categories } = useData()
  const [inquireOpen, setInquireOpen] = useState(false)

  const medicine = medicines.find((m) => m.id === id)
  if (!medicine) return <Navigate to="/medicines" replace />

  const category = categories.find((c) => c.id === medicine.categoryId)

  const rows = [
    { label: t('medicines.activeIngredient'), value: tf(medicine.activeIngredient) },
    { label: t('common.concentration'), value: medicine.concentration },
    { label: t('common.form'), value: tf(medicine.form) },
    { label: t('common.category'), value: category ? tf(category.name) : '-' },
  ]

  const sections = [
    { title: t('medicines.generalInfo'), text: tf(medicine.info.general) },
    { title: t('medicines.usage'), text: tf(medicine.info.usage) },
    { title: t('medicines.howToUse'), text: tf(medicine.info.howToUse) },
    { title: t('medicines.warnings'), text: tf(medicine.info.warnings) },
    { title: t('medicines.contraindications'), text: tf(medicine.info.contraindications) },
    { title: t('medicines.sideEffects'), text: tf(medicine.info.sideEffects) },
  ]

  return (
    <div className="page">
      <div className="container section-sm">
        <Link to="/medicines" className="text-muted" style={{ fontSize: 13.5, fontWeight: 700 }}>← {t('nav.medicines')}</Link>

        <div className="detail-grid" style={{ marginTop: 20 }}>
          <div className="card fade-up" style={{ overflow: 'hidden' }}>
            <img src={medicine.image} alt={medicine.name} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
          </div>

          <div className="fade-up">
            <div style={{ marginBottom: 14 }}>
              <AvailabilityBadge status={medicine.availability} />
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 10px' }}>{medicine.name}</h1>
            <p className="text-secondary" style={{ marginBottom: 22 }}>{tf(medicine.info.general)}</p>
            <div className="card card-pad" style={{ marginBottom: 22 }}>
              {rows.map((r) => (
                <div key={r.label} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="text-muted" style={{ fontSize: 13.5 }}>{r.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{r.value}</span>
                </div>
              ))}
              <div className="flex-between" style={{ paddingTop: 14 }}>
                <span className="text-muted" style={{ fontSize: 13.5 }}>{t('common.price')}</span>
                <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>{medicine.price} {t('common.currency')}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => setInquireOpen(true)}>
              {t('medicines.inquireBtn')}
            </button>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 40 }}>
          {sections.map((s) => (
            <div className="card card-pad fade-up" key={s.title}>
              <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 8, color: 'var(--accent)' }}>{s.title}</div>
              <p className="text-secondary" style={{ fontSize: 13.5, lineHeight: 1.8, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>

        <div
          className="glass"
          style={{ marginTop: 28, padding: '16px 20px', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)', borderColor: 'color-mix(in srgb, var(--warning) 40%, var(--border))' }}
        >
          ⚠️ {t('medicines.disclaimer')}
        </div>
      </div>

      <InquiryModal open={inquireOpen} onClose={() => setInquireOpen(false)} defaultMedicineName={medicine.name} />

      <style>{`
        .detail-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 32px; }
        @media (max-width: 860px) { .detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

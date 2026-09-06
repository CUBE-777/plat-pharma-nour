import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'
import { DAY_ORDER } from '../utils/pharmacyStatus'

const DAY_LABEL = {
  ar: { sun: 'الأحد', mon: 'الاثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت' },
  fr: { sun: 'Dimanche', mon: 'Lundi', tue: 'Mardi', wed: 'Mercredi', thu: 'Jeudi', fri: 'Vendredi', sat: 'Samedi' },
  en: { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' },
}

export default function About() {
  const { t, tf, lang } = useLang()
  const { pharmacyInfo, services } = useData()

  return (
    <div className="page">
      <div className="section-sm" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">🏥 {t('nav.about')}</span>
          <h1 className="section-title">{tf(pharmacyInfo.name)}</h1>
          <p className="section-subtitle">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="container section">
        <div className="about-grid">
          <div className="fade-up">
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
              <img src={pharmacyInfo.images[0]} alt="" style={{ width: '100%', height: 280, objectFit: 'cover' }} />
            </div>
            <div className="grid grid-2">
              <img src={pharmacyInfo.images[1]} alt="" style={{ borderRadius: 'var(--radius-md)', height: 140, objectFit: 'cover', width: '100%' }} />
              <img src={pharmacyInfo.images[2]} alt="" style={{ borderRadius: 'var(--radius-md)', height: 140, objectFit: 'cover', width: '100%' }} />
            </div>
          </div>

          <div className="fade-up">
            <p className="text-secondary" style={{ lineHeight: 1.9, marginBottom: 24 }}>{tf(pharmacyInfo.description)}</p>

            <div className="card card-pad" style={{ marginBottom: 16 }}>
              <div className="text-muted" style={{ fontSize: 12.5, marginBottom: 4 }}>{t('about.addressLabel')}</div>
              <div style={{ fontWeight: 700 }}>{tf(pharmacyInfo.address)}, {tf(pharmacyInfo.city)}</div>
            </div>

            <div className="card card-pad">
              <div className="text-muted" style={{ fontSize: 12.5, marginBottom: 10 }}>{t('about.hoursLabel')}</div>
              {DAY_ORDER.map((d) => {
                const day = pharmacyInfo.openingHours[d]
                return (
                  <div key={d} className="flex-between" style={{ padding: '6px 0', fontSize: 13.5 }}>
                    <span className="text-secondary">{DAY_LABEL[lang]?.[d] || d}</span>
                    <span style={{ fontWeight: 700 }}>{day.closed ? '—' : `${day.open} - ${day.close}`}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>{t('about.servicesLabel')}</h3>
          <div className="grid grid-4">
            {services.filter((s) => s.active).map((s) => (
              <div key={s.id} className="card card-pad text-center fade-up">
                <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{tf(s.name)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .about-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

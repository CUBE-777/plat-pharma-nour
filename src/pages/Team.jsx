import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'

export default function Team() {
  const { t, tf } = useLang()
  const { staff } = useData()

  return (
    <div className="page">
      <div className="section-sm" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">👨‍⚕️ {t('nav.team')}</span>
          <h1 className="section-title">{t('team.title')}</h1>
          <p className="section-subtitle">{t('team.subtitle')}</p>
        </div>
      </div>

      <div className="container section">
        <div className="grid grid-4">
          {staff.map((member) => (
            <div key={member.id} className="card fade-up" style={{ overflow: 'hidden' }}>
              <div style={{ height: 190, overflow: 'hidden' }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-pad text-center">
                <div style={{ fontWeight: 800, fontSize: 16 }}>{member.name}</div>
                <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{tf(member.role)}</div>
                <p className="text-secondary" style={{ fontSize: 13, lineHeight: 1.7 }}>{tf(member.bio)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

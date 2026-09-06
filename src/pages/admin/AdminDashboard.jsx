import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'

export default function AdminDashboard() {
  const { t } = useLang()
  const { medicines, services, staff, healthGuides, announcements } = useData()

  const stats = [
    { label: t('admin.totalMedicines'), value: medicines.length, icon: '💊', to: '/admin/medicines', color: 'var(--accent)' },
    { label: t('admin.totalServices'), value: services.length, icon: '🩺', to: '/admin/services', color: 'var(--accent-2)' },
    { label: t('admin.totalStaff'), value: staff.length, icon: '👥', to: '/admin/staff', color: 'var(--accent-3)' },
    { label: t('admin.totalGuides'), value: healthGuides.length, icon: '📘', to: '/admin/guides', color: 'var(--success)' },
    { label: t('admin.totalAnnouncements'), value: announcements.length, icon: '📢', to: '/admin/announcements', color: 'var(--warning)' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{t('admin.dashboard')}</h1>
      <p className="text-secondary" style={{ marginBottom: 28 }}>{t('admin.overview')}</p>

      <div className="grid grid-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card card-pad fade-up">
            <div className="flex-between" style={{ marginBottom: 14 }}>
              <span
                className="flex-center"
                style={{ width: 44, height: 44, borderRadius: 12, fontSize: 20, background: `color-mix(in srgb, ${s.color} 18%, transparent)` }}
              >
                {s.icon}
              </span>
              <span style={{ fontSize: 28, fontWeight: 800 }}>{s.value}</span>
            </div>
            <div className="text-secondary" style={{ fontSize: 13.5, fontWeight: 600 }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="card card-pad" style={{ marginTop: 28 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>{t('admin.manageAnnouncements')}</h3>
        <div className="flex-col gap-2">
          {announcements.slice(0, 5).map((a) => (
            <div key={a.id} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
              <span>{a.icon} {a.text.ar}</span>
              <span className={`badge ${a.active ? 'badge-success' : 'badge-neutral'}`}>
                {a.active ? t('common.active') : t('common.inactive')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

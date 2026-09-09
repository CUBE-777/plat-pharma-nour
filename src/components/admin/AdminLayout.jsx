import { NavLink, Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'
import LanguageSwitcher from '../common/LanguageSwitcher'

export default function AdminLayout() {
  const { t } = useLang()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const links = [
    { to: '/admin/dashboard', label: t('admin.dashboard'), icon: '📊' },
    { to: '/admin/announcements', label: t('admin.manageAnnouncements'), icon: '📢' },
    { to: '/admin/medicines', label: t('admin.manageMedicines'), icon: '💊' },
    { to: '/admin/services', label: t('admin.manageServices'), icon: '🩺' },
    { to: '/admin/staff', label: t('admin.manageStaff'), icon: '👥' },
    { to: '/admin/guides', label: t('admin.manageGuides'), icon: '📘' },
    { to: '/admin/categories', label: t('admin.manageCategories'), icon: '🏷️' },
    { to: '/admin/messages', label: t('admin.manageMessages'), icon: '✉️' },
    { to: '/admin/pharmacy-info', label: t('admin.pharmacyInfo'), icon: '🏥' },
    { to: '/admin/settings', label: t('admin.settings'), icon: '⚙️' },
  ]

  return (
    <div className="page" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className={`admin-sidebar glass ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '22px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', fontWeight: 800 }}>
            <span className="flex-center" style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--gradient-accent)', color: '#fff' }}>⚙</span>
            <span>{t('nav.admin')}</span>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setSidebarOpen(false)}
              className="admin-link"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 4,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--gradient-accent)' : 'transparent',
              })}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }} className="flex-col gap-2">
          <Link to="/" className="btn btn-secondary btn-sm">← {t('admin.backToSite')}</Link>
          <button className="btn btn-danger btn-sm" onClick={logout}>{t('admin.logout')}</button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="glass flex-between" style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 20 }}>
          <button className="icon-btn admin-menu-btn" onClick={() => setSidebarOpen((o) => !o)}>☰</button>
          <div className="flex-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        .admin-sidebar {
          width: 260px; flex-shrink: 0; display: flex; flex-direction: column;
          border-inline-end: 1px solid var(--border);
          position: sticky; top: 0; height: 100vh;
        }
        .admin-menu-btn { display: none; }
        @media (max-width: 900px) {
          .admin-sidebar { position: fixed; inset-inline-start: -280px; top: 0; height: 100vh; z-index: 150; transition: inset-inline-start 0.25s ease; background: var(--bg-elevated); }
          .admin-sidebar.open { inset-inline-start: 0; }
          .admin-menu-btn { display: flex; }
        }
      `}</style>
    </div>
  )
}

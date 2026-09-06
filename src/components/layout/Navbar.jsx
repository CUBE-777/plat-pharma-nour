import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import ThemeToggle from '../common/ThemeToggle'

export default function Navbar() {
  const { t, tf } = useLang()
  const { pharmacyInfo } = useData()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/medicines', label: t('nav.medicines') },
    { to: '/services', label: t('nav.services') },
    { to: '/health-guides', label: t('nav.guides') },
    { to: '/team', label: t('nav.team') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/medicines?q=${encodeURIComponent(query)}`)
    setMobileOpen(false)
  }

  return (
    <header
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'var(--glass-blur)',
      }}
    >
      <div className="container flex-between" style={{ height: 72 }}>
        <Link to="/" className="flex-center gap-2" style={{ fontWeight: 800, fontSize: 18 }}>
          <span
            className="flex-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--gradient-accent)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              boxShadow: '0 6px 18px color-mix(in srgb, var(--accent) 40%, transparent)',
            }}
          >
            {pharmacyInfo.logoInitial || '+'}
          </span>
          <span>{tf(pharmacyInfo.name)}</span>
        </Link>

        <nav className="flex-center gap-4" style={{ display: 'none' }} id="desktop-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                fontSize: 14.5,
                fontWeight: 600,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-center gap-2">
          <form onSubmit={handleSearch} className="nav-search-form">
            <input
              className="input"
              style={{ width: 220, padding: '9px 14px', fontSize: 13.5 }}
              placeholder={t('common.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <button className="icon-btn nav-search-btn" onClick={handleSearch} aria-label={t('common.search')}>🔍</button>
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            className="icon-btn"
            id="mobile-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fade-up" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          <div className="container" style={{ padding: '16px 20px 22px' }}>
            <form onSubmit={handleSearch} style={{ marginBottom: 14 }}>
              <input
                className="input"
                placeholder={t('common.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            <div className="flex-col gap-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    padding: '6px 0',
                  })}
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginTop: 8 }}
              >
                ⚙ {t('nav.admin')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 981px) {
          #desktop-nav { display: flex !important; }
          #mobile-toggle { display: none !important; }
          .nav-search-btn { display: none !important; }
        }
        @media (max-width: 980px) {
          .nav-search-form { display: none !important; }
        }
      `}</style>
    </header>
  )
}

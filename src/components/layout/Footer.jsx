import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'

export default function Footer() {
  const { t, tf } = useLang()
  const { pharmacyInfo } = useData()

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', marginTop: 40 }}>
      <div className="container" style={{ padding: '48px 20px 28px' }}>
        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div>
            <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', fontWeight: 800, fontSize: 17, marginBottom: 12 }}>
              <span
                className="flex-center"
                style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--gradient-accent)', color: '#fff', fontWeight: 800 }}
              >
                {pharmacyInfo.logoInitial || '+'}
              </span>
              <span>{tf(pharmacyInfo.name)}</span>
            </div>
            <p className="text-secondary" style={{ fontSize: 13.5, lineHeight: 1.8 }}>{tf(pharmacyInfo.slogan)}</p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, marginBottom: 14 }}>{t('footer.quickLinks')}</h4>
            <div className="flex-col gap-2">
              <Link className="text-secondary" style={{ fontSize: 13.5 }} to="/medicines">{t('nav.medicines')}</Link>
              <Link className="text-secondary" style={{ fontSize: 13.5 }} to="/services">{t('nav.services')}</Link>
              <Link className="text-secondary" style={{ fontSize: 13.5 }} to="/health-guides">{t('nav.guides')}</Link>
              <Link className="text-secondary" style={{ fontSize: 13.5 }} to="/team">{t('nav.team')}</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 14, marginBottom: 14 }}>{t('nav.contact')}</h4>
            <div className="flex-col gap-2 text-secondary" style={{ fontSize: 13.5 }}>
              <span>📍 {tf(pharmacyInfo.address)}, {tf(pharmacyInfo.city)}</span>
              <span>📞 {pharmacyInfo.phone}</span>
              <span>📧 {pharmacyInfo.email}</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 14, marginBottom: 14 }}>{t('footer.followUs')}</h4>
            <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
              <a className="icon-btn" href={pharmacyInfo.socials?.facebook} target="_blank" rel="noreferrer">f</a>
              <a className="icon-btn" href={pharmacyInfo.socials?.instagram} target="_blank" rel="noreferrer">◎</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }} className="flex-between">
          <span className="text-muted" style={{ fontSize: 12.5 }}>
            © {new Date().getFullYear()} {tf(pharmacyInfo.name)} — {t('footer.rights')}
          </span>
          <span className="text-muted" style={{ fontSize: 12 }}>{t('footer.madeFor')}</span>
        </div>
      </div>
      <style>{`
        footer .grid-4 { grid-template-columns: repeat(4,1fr); }
        @media (max-width: 900px) { footer .grid-4 { grid-template-columns: repeat(2,1fr); } footer .flex-between { flex-direction: column; gap: 8px; align-items: flex-start; } }
        @media (max-width: 500px) { footer .grid-4 { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLang()

  return (
    <div
      className="page flex-center"
      style={{
        minHeight: '70vh',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--accent)' }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>الصفحة غير موجودة</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 460, lineHeight: 1.7, margin: 0 }}>
        عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الصفحة الرئيسية أو تصفح الأدوية.
      </p>
      <div className="flex-center gap-3" style={{ marginTop: 8 }}>
        <Link to="/" className="btn btn-primary">
          العودة للرئيسية
        </Link>
        <Link to="/medicines" className="btn btn-secondary">
          {t('nav.medicines')}
        </Link>
      </div>
    </div>
  )
}

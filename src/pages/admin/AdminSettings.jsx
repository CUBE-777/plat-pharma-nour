import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

export default function AdminSettings() {
  const { t, lang, setLang, languages } = useLang()
  const { theme, setTheme } = useTheme()
  const { pharmacyInfo } = useData()
  const { changePassword, user } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSubmitting, setPwSubmitting] = useState(false)

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError('')
    if (newPassword.length < 6) {
      setPwError('كلمة المرور يجب أن تكون 6 خانات على الأقل.')
      return
    }
    setPwSubmitting(true)
    try {
      await changePassword(newPassword)
      setNewPassword('')
      setPwSaved(true)
      setTimeout(() => setPwSaved(false), 2500)
    } catch (err) {
      setPwError(err.message || 'حدث خطأ، حاول مرة أخرى.')
    } finally {
      setPwSubmitting(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 22 }}>{t('admin.settings')}</h1>

      <div className="flex-col gap-3" style={{ maxWidth: 520 }}>
        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{t('admin.defaultLanguage')}</h3>
          <div className="flex-col gap-2">
            {Object.values(languages).map((l) => (
              <label key={l.code} className="flex-center gap-2" style={{ justifyContent: 'flex-start', fontSize: 14, fontWeight: 600 }}>
                <input type="radio" name="lang" checked={lang === l.code} onChange={() => setLang(l.code)} />
                {l.flag} {l.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{t('admin.defaultTheme')}</h3>
          <div className="flex-col gap-2">
            <label className="flex-center gap-2" style={{ justifyContent: 'flex-start', fontSize: 14, fontWeight: 600 }}>
              <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
              🌙 {t('admin.dark')}
            </label>
            <label className="flex-center gap-2" style={{ justifyContent: 'flex-start', fontSize: 14, fontWeight: 600 }}>
              <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
              ☀️ {t('admin.light')}
            </label>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>{t('nav.contact')}</h3>
          <p className="text-secondary" style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {pharmacyInfo?.phone} · {pharmacyInfo?.email}
          </p>
          <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>
            {t('admin.pharmacyInfo')} →
          </p>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>كلمة مرور الإدارة</h3>
          <p className="text-muted" style={{ fontSize: 12, marginBottom: 14 }}>
            الحساب الحالي: {user?.email}
          </p>
          <form onSubmit={handleChangePassword} className="flex-col gap-2">
            <div className="field">
              <label>كلمة مرور جديدة</label>
              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {pwError && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>{pwError}</p>}
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={pwSubmitting}>
              {pwSubmitting ? '...' : t('common.save')}
            </button>
            {pwSaved && <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>✓ {t('admin.saved')}</span>}
          </form>
        </div>
      </div>
    </div>
  )
}

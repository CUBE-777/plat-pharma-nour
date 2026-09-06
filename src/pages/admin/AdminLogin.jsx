import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { t } = useLang()
  const { login, isAuthed, checking } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (checking) return null
  if (isAuthed) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    const ok = await login(email, password)
    setSubmitting(false)
    if (ok) navigate('/admin/dashboard')
    else setError(true)
  }

  return (
    <div className="page flex-center" style={{ minHeight: '100vh', background: 'var(--gradient-hero)' }}>
      <div className="card card-pad fade-up" style={{ width: '100%', maxWidth: 380, margin: 20 }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <div
            className="flex-center"
            style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-accent)', margin: '0 auto 14px', fontSize: 24, color: '#fff', fontWeight: 800 }}
          >
            ⚙
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>{t('admin.loginTitle')}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('admin.username')}</label>
            <input
              className="input"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div className="field">
            <label>{t('admin.password')}</label>
            <input
              className="input"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14, fontWeight: 600 }}>{t('admin.wrongCreds')}</p>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? '...' : t('admin.login')}
          </button>
        </form>
      </div>
    </div>
  )
}

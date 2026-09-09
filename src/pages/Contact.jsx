import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'
import { DAY_ORDER } from '../utils/pharmacyStatus'
import * as api from '../services/api'

const DAY_LABEL = {
  ar: { sun: 'الأحد', mon: 'الاثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت' },
  fr: { sun: 'Dimanche', mon: 'Lundi', tue: 'Mardi', wed: 'Mercredi', thu: 'Jeudi', fri: 'Vendredi', sat: 'Samedi' },
  en: { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' },
}

export default function Contact() {
  const { t, tf, lang } = useLang()
  const { pharmacyInfo } = useData()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const cleanWhatsapp = (pharmacyInfo?.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappLink = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '#'
  const cleanPhone = (pharmacyInfo?.phone || '').replace(/[^0-9+]/g, '')
  const telLink = cleanPhone ? `tel:${cleanPhone}` : '#'
  const hours = pharmacyInfo?.openingHours || {}

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    const { error: err } = await api.addMessage({
      type: 'contact',
      name: form.name,
      email: form.email,
      message: form.message,
    })
    setSending(false)
    if (err) setError(t('contact.sendError'))
    else setSent(true)
  }

  return (
    <div className="page">
      <div className="section-sm" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">📞 {t('nav.contact')}</span>
          <h1 className="section-title">{t('contact.title')}</h1>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          <div className="fade-up flex-col gap-3">
            <a href={telLink} className="card card-pad flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 26 }}>📞</span>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>{t('common.phone')}</div>
                <div style={{ fontWeight: 700 }}>{pharmacyInfo.phone}</div>
              </div>
            </a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="card card-pad flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 26 }}>💬</span>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>WhatsApp</div>
                <div style={{ fontWeight: 700 }}>{pharmacyInfo.whatsapp}</div>
              </div>
            </a>
            <a href={`mailto:${pharmacyInfo.email}`} className="card card-pad flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 26 }}>📧</span>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>{t('common.email')}</div>
                <div style={{ fontWeight: 700 }}>{pharmacyInfo.email}</div>
              </div>
            </a>
            <div className="card card-pad flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 26 }}>📍</span>
              <div>
                <div className="text-muted" style={{ fontSize: 12 }}>{t('contact.address')}</div>
                <div style={{ fontWeight: 700 }}>{tf(pharmacyInfo.address)}, {tf(pharmacyInfo.city)}</div>
              </div>
            </div>

            <div className="card card-pad">
              <div className="text-muted" style={{ fontSize: 12, marginBottom: 10 }}>{t('contact.workingHours')}</div>
              {DAY_ORDER.map((d) => {
                const day = hours[d] || { closed: true, open: '', close: '' }
                return (
                  <div key={d} className="flex-between" style={{ padding: '4px 0', fontSize: 12.5 }}>
                    <span className="text-secondary">{DAY_LABEL[lang]?.[d] || d}</span>
                    <span style={{ fontWeight: 700 }}>{day.closed || !day.open ? '—' : `${day.open} - ${day.close}`}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex-col gap-2" style={{ marginTop: 8 }}>
              <a href={telLink} className="btn btn-primary btn-block">📞 {t('contact.callNow')}</a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-secondary btn-block">💬 {t('contact.whatsapp')}</a>
              <a href={pharmacyInfo.mapLink} target="_blank" rel="noreferrer" className="btn btn-secondary btn-block">🗺️ {t('contact.directions')}</a>
            </div>
          </div>

          <div className="fade-col fade-up flex-col gap-3">
            <div className="card" style={{ overflow: 'hidden', height: 260 }}>
              <iframe
                title="map"
                src={pharmacyInfo.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            <div className="card card-pad">
              <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>{t('contact.sendMessage')}</h3>
              {sent ? (
                <div className="text-center" style={{ padding: '20px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                  <p style={{ fontWeight: 700 }}>{t('inquiry.successMsg')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label>{t('common.name')}</label>
                    <input className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label>{t('common.email')}</label>
                    <input className="input" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label>{t('common.message')}</label>
                    <textarea className="textarea" required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                  </div>
                  {error && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</p>}
                  <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                    {sending ? t('common.sending') : t('common.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .contact-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 28px; align-items: start; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

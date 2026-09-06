import { useState } from 'react'
import Modal from './Modal'
import { useLang } from '../../i18n/LanguageContext'

export default function AskPharmacistModal({ open, onClose }) {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', question: '' })
  const [sent, setSent] = useState(false)

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleClose() {
    setSent(false)
    setForm({ name: '', phone: '', question: '' })
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('askPharmacist.title')} maxWidth={480}>
      {sent ? (
        <div className="text-center" style={{ padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <p style={{ fontWeight: 700, fontSize: 16 }}>{t('askPharmacist.successMsg')}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleClose}>
            {t('common.close')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-secondary" style={{ marginTop: -6, marginBottom: 18, fontSize: 14 }}>
            {t('askPharmacist.subtitle')}
          </p>
          <div className="field">
            <label>{t('common.name')}</label>
            <input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field">
            <label>{t('inquiry.phoneNumber')}</label>
            <input className="input" type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+212 6 00 00 00 00" />
          </div>
          <div className="field">
            <label>{t('askPharmacist.question')}</label>
            <textarea className="textarea" required value={form.question} onChange={(e) => update('question', e.target.value)} />
          </div>
          <div
            className="glass"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12.5,
              color: 'var(--text-secondary)',
              marginBottom: 16,
              borderColor: 'color-mix(in srgb, var(--warning) 40%, var(--border))',
            }}
          >
            ⚠️ {t('askPharmacist.note')}
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {t('common.submit')}
          </button>
        </form>
      )}
    </Modal>
  )
}

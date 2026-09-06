import { useState } from 'react'
import Modal from './Modal'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'

export default function InquiryModal({ open, onClose, defaultMedicineName = '' }) {
  const { t } = useLang()
  const { medicines } = useData()
  const [form, setForm] = useState({ medicineName: defaultMedicineName, quantity: 1, message: '', phone: '' })
  const [sent, setSent] = useState(false)

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleClose() {
    setSent(false)
    setForm({ medicineName: '', quantity: 1, message: '', phone: '' })
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('inquiry.title')} maxWidth={480}>
      {sent ? (
        <div className="text-center" style={{ padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <p style={{ fontWeight: 700, fontSize: 16 }}>{t('inquiry.successMsg')}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleClose}>
            {t('common.close')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-secondary" style={{ marginTop: -6, marginBottom: 18, fontSize: 14 }}>
            {t('inquiry.subtitle')}
          </p>
          <div className="field">
            <label>{t('inquiry.medicineName')}</label>
            <input
              className="input"
              list="medicine-options"
              required
              value={form.medicineName}
              onChange={(e) => update('medicineName', e.target.value)}
              placeholder={t('inquiry.medicineName')}
            />
            <datalist id="medicine-options">
              {medicines.map((m) => (
                <option value={m.name} key={m.id} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label>{t('inquiry.quantity')}</label>
            <input
              className="input"
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />
          </div>
          <div className="field">
            <label>{t('inquiry.phoneNumber')}</label>
            <input
              className="input"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+212 6 00 00 00 00"
            />
          </div>
          <div className="field">
            <label>{t('inquiry.messageOptional')}</label>
            <textarea
              className="textarea"
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {t('inquiry.sendInquiry')}
          </button>
        </form>
      )}
    </Modal>
  )
}

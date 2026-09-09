import { useState, useEffect } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import { MultiLangInput } from '../../components/admin/MultiLangField'
import ImageUploadField from '../../components/admin/ImageUploadField'
import { DAY_ORDER } from '../../utils/pharmacyStatus'

export default function AdminPharmacyInfo() {
  const { t } = useLang()
  const { pharmacyInfo, updatePharmacyInfo } = useData()
  const [form, setForm] = useState(() => pharmacyInfo || { openingHours: {}, images: [] })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (pharmacyInfo) {
      setForm(pharmacyInfo)
    }
  }, [pharmacyInfo])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }
  function updateHours(day, patch) {
    setForm((f) => {
      const currentHours = f.openingHours || {}
      const dayHours = currentHours[day] || { closed: false, open: '08:30', close: '20:30' }
      return {
        ...f,
        openingHours: {
          ...currentHours,
          [day]: { ...dayHours, ...patch },
        },
      }
    })
  }
  function updateImage(index, value) {
    setForm((f) => {
      const images = [...(f.images || [])]
      images[index] = value
      return { ...f, images }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    setSaving(true)
    try {
      await updatePharmacyInfo(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
      setSaveError(t('admin.saveError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 22 }}>{t('admin.pharmacyInfo')}</h1>

      <form onSubmit={handleSubmit} className="flex-col gap-3">
        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{t('about.title')}</h3>
          <MultiLangInput label={t('common.name')} value={form.name} onChange={(v) => update('name', v)} />
          <MultiLangInput label="Slogan" value={form.slogan} onChange={(v) => update('slogan', v)} />
          <MultiLangInput label="Description" value={form.description} onChange={(v) => update('description', v)} textarea />
          <div className="field">
            <label>Logo initial (1 letter)</label>
            <input className="input" maxLength={2} style={{ maxWidth: 120 }} value={form.logoInitial} onChange={(e) => update('logoInitial', e.target.value)} />
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{t('contact.title')}</h3>
          <MultiLangInput label={t('contact.address')} value={form.address} onChange={(v) => update('address', v)} />
          <MultiLangInput label={t('about.cityLabel')} value={form.city} onChange={(v) => update('city', v)} />
          <div className="grid grid-2">
            <div className="field">
              <label>{t('common.phone')}</label>
              <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="field">
              <label>WhatsApp</label>
              <input className="input" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>{t('common.email')}</label>
            <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Google Maps embed URL</label>
            <input className="input" value={form.mapUrl} onChange={(e) => update('mapUrl', e.target.value)} />
          </div>
          <div className="field">
            <label>Google Maps link (directions)</label>
            <input className="input" value={form.mapLink} onChange={(e) => update('mapLink', e.target.value)} />
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{t('status.hours')}</h3>
          {DAY_ORDER.map((d) => {
            const dayData = (form?.openingHours && form.openingHours[d]) || { closed: false, open: '08:30', close: '20:30' }
            return (
              <div key={d} className="flex-center gap-3" style={{ justifyContent: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <span style={{ width: 100, fontWeight: 700, fontSize: 13.5 }}>{t('days.' + d)}</span>
                <label className="flex-center gap-1" style={{ fontSize: 12.5 }}>
                  <input type="checkbox" checked={!dayData.closed} onChange={(e) => updateHours(d, { closed: !e.target.checked })} />
                  {t('common.active')}
                </label>
                {!dayData.closed && (
                  <>
                    <input type="time" className="input" style={{ width: 130 }} value={dayData.open || ''} onChange={(e) => updateHours(d, { open: e.target.value })} />
                    <span className="text-muted">—</span>
                    <input type="time" className="input" style={{ width: 130 }} value={dayData.close || ''} onChange={(e) => updateHours(d, { close: e.target.value })} />
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="card card-pad">
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{t('admin.photoNumber')}</h3>
          {(form?.images || []).map((img, i) => (
            <ImageUploadField key={i} label={`${t('admin.photoNumber')} ${i + 1}`} value={img} onChange={(v) => updateImage(i, v)} />
          ))}
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
          {saving ? t('admin.saving') : t('common.save')}
        </button>
        {saveError && <span style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, alignSelf: 'flex-start' }}>{saveError}</span>}
        {saved && <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>✓ {t('admin.saved')}</span>}
      </form>
    </div>
  )
}

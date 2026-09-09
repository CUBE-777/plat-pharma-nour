import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import Modal from '../../components/common/Modal'
import { MultiLangInput } from '../../components/admin/MultiLangField'
import ImageUploadField from '../../components/admin/ImageUploadField'
import AvailabilityBadge from '../../components/common/AvailabilityBadge'

const EMPTY_ML = { ar: '', fr: '', en: '' }
const EMPTY = {
  name: '',
  categoryId: '',
  activeIngredient: { ...EMPTY_ML },
  concentration: '',
  form: { ...EMPTY_ML },
  price: '',
  availability: 'available',
  image: '',
  info: {
    general: { ...EMPTY_ML },
    usage: { ...EMPTY_ML },
    howToUse: { ...EMPTY_ML },
    warnings: { ...EMPTY_ML },
    contraindications: { ...EMPTY_ML },
    sideEffects: { ...EMPTY_ML },
  },
}

export default function AdminMedicines() {
  const { t, tf } = useLang()
  const { medicines, categories, medicinesCrud } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [rowError, setRowError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  function openAdd() {
    setEditing(null)
    setFormError('')
    setForm({ ...EMPTY, categoryId: categories[0]?.id || '' })
    setModalOpen(true)
  }
  function openEdit(item) {
    setEditing(item)
    setFormError('')
    setForm({
      name: item.name,
      categoryId: item.categoryId,
      activeIngredient: item.activeIngredient,
      concentration: item.concentration,
      form: item.form,
      price: item.price,
      availability: item.availability,
      image: item.image,
      info: { ...EMPTY.info, ...item.info },
    })
    setModalOpen(true)
  }
  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price) || 0 }
      if (editing) await medicinesCrud.update(editing.id, payload)
      else await medicinesCrud.add(payload)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      setFormError(t('admin.saveError'))
    } finally {
      setSaving(false)
    }
  }
  async function handleDelete(id) {
    if (!window.confirm(t('admin.confirmDelete'))) return
    setRowError('')
    setDeletingId(id)
    try {
      await medicinesCrud.remove(id)
    } catch (err) {
      console.error(err)
      setRowError(t('admin.deleteError'))
    } finally {
      setDeletingId(null)
    }
  }

  function updateInfo(field, value) {
    setForm((f) => ({ ...f, info: { ...f.info, [field]: value } }))
  }

  const filtered = medicines.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageMedicines')}</h1>
        <button className="btn btn-primary" onClick={openAdd} disabled={categories.length === 0}>+ {t('admin.addNew')}</button>
      </div>

      {categories.length === 0 && (
        <div className="card card-pad" style={{ marginBottom: 18, borderColor: 'color-mix(in srgb, var(--warning) 40%, var(--border))' }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, margin: 0 }}>⚠️ {t('admin.noCategoriesWarning')}</p>
          <Link to="/admin/categories" className="btn btn-sm btn-secondary" style={{ marginTop: 10, display: 'inline-flex' }}>
            {t('admin.goToCategories')} →
          </Link>
        </div>
      )}

      {rowError && (
        <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{rowError}</p>
      )}

      <input
        className="input"
        style={{ maxWidth: 320, marginBottom: 18 }}
        placeholder={t('medicines.searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: 'start', borderBottom: '1px solid var(--border)' }}>
              {[t('common.name'), t('common.category'), t('common.price'), t('admin.status'), t('admin.actions')].map((h) => (
                <th key={h} style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const cat = categories.find((c) => c.id === m.categoryId)
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13.5 }}>
                    <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                      <img src={m.image} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />
                      {m.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{cat ? tf(cat.name) : '-'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700 }}>{m.price} {t('common.currency')}</td>
                  <td style={{ padding: '12px 16px' }}><AvailabilityBadge status={m.availability} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex-center gap-2">
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(m)}>{t('common.edit')}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}>
                        {deletingId === m.id ? t('admin.deleting') : t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-muted text-center" style={{ padding: 24 }}>{t('common.noResults')}</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('admin.addNew')} maxWidth={620}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('common.name')} (brand name)</label>
            <input className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>{t('common.category')}</label>
              <select className="select" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>{tf(c.name)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('common.concentration')}</label>
              <input className="input" value={form.concentration} onChange={(e) => setForm((f) => ({ ...f, concentration: e.target.value }))} placeholder="500mg" />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>{t('common.price')} ({t('common.currency')})</label>
              <input className="input" type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="field">
              <label>{t('medicines.filterAvailability')}</label>
              <select className="select" value={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}>
                <option value="available">{t('status.available')}</option>
                <option value="limited">{t('status.limited')}</option>
                <option value="out">{t('status.outOfStock')}</option>
              </select>
            </div>
          </div>

          <ImageUploadField label="صورة الدواء" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />

          <MultiLangInput label={t('medicines.activeIngredient')} value={form.activeIngredient} onChange={(v) => setForm((f) => ({ ...f, activeIngredient: v }))} />
          <MultiLangInput label={t('common.form')} value={form.form} onChange={(v) => setForm((f) => ({ ...f, form: v }))} />
          <MultiLangInput label={t('medicines.generalInfo')} value={form.info.general} onChange={(v) => updateInfo('general', v)} textarea />
          <MultiLangInput label={t('medicines.usage')} value={form.info.usage} onChange={(v) => updateInfo('usage', v)} textarea />
          <MultiLangInput label={t('medicines.howToUse')} value={form.info.howToUse} onChange={(v) => updateInfo('howToUse', v)} textarea />
          <MultiLangInput label={t('medicines.warnings')} value={form.info.warnings} onChange={(v) => updateInfo('warnings', v)} textarea />
          <MultiLangInput label={t('medicines.contraindications')} value={form.info.contraindications} onChange={(v) => updateInfo('contraindications', v)} textarea />
          <MultiLangInput label={t('medicines.sideEffects')} value={form.info.sideEffects} onChange={(v) => updateInfo('sideEffects', v)} textarea />

          {formError && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{formError}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? t('admin.saving') : t('common.save')}
          </button>
        </form>
      </Modal>
    </div>
  )
}

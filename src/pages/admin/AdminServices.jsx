import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import Modal from '../../components/common/Modal'
import { MultiLangInput } from '../../components/admin/MultiLangField'

const EMPTY = {
  icon: '🩺',
  active: true,
  name: { ar: '', fr: '', en: '' },
  shortDesc: { ar: '', fr: '', en: '' },
  details: { ar: '', fr: '', en: '' },
}

export default function AdminServices() {
  const { t, tf } = useLang()
  const { services, servicesCrud } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [rowError, setRowError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  function openAdd() {
    setEditing(null)
    setFormError('')
    setForm(EMPTY)
    setModalOpen(true)
  }
  function openEdit(item) {
    setEditing(item)
    setFormError('')
    setForm({ icon: item.icon, active: item.active, name: item.name, shortDesc: item.shortDesc, details: item.details })
    setModalOpen(true)
  }
  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (editing) await servicesCrud.update(editing.id, form)
      else await servicesCrud.add(form)
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
      await servicesCrud.remove(id)
    } catch (err) {
      console.error(err)
      setRowError(t('admin.deleteError'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageServices')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('admin.addNew')}</button>
      </div>

      <div className="grid grid-3">
        {rowError && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, gridColumn: '1 / -1' }}>{rowError}</p>}
        {services.map((s) => (
          <div key={s.id} className="card card-pad fade-up">
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>{s.icon}</span>
              <span className={`badge ${s.active ? 'badge-success' : 'badge-neutral'}`}>
                {s.active ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{tf(s.name)}</div>
            <p className="text-secondary truncate-2" style={{ fontSize: 13, marginBottom: 14 }}>{tf(s.shortDesc)}</p>
            <div className="flex-center gap-2">
              <button className="btn btn-sm btn-secondary" onClick={() => servicesCrud.toggleActive(s.id)}>
                {s.active ? t('common.disable') : t('common.enable')}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => openEdit(s)}>{t('common.edit')}</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}>
                {deletingId === s.id ? t('admin.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('admin.addNew')} maxWidth={560}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Icon (emoji)</label>
            <input className="input" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} maxLength={4} />
          </div>
          <MultiLangInput label={t('common.name')} value={form.name} onChange={(name) => setForm((f) => ({ ...f, name }))} />
          <MultiLangInput label={t('common.message')} value={form.shortDesc} onChange={(shortDesc) => setForm((f) => ({ ...f, shortDesc }))} textarea />
          <MultiLangInput label={t('services.learnMore')} value={form.details} onChange={(details) => setForm((f) => ({ ...f, details }))} textarea />
          <div className="field flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="srv-active" />
            <label htmlFor="srv-active" style={{ margin: 0 }}>{t('common.active')}</label>
          </div>
          {formError && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{formError}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? t('admin.saving') : t('common.save')}
          </button>
        </form>
      </Modal>
    </div>
  )
}

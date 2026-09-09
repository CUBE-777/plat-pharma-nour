import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import Modal from '../../components/common/Modal'
import { MultiLangInput } from '../../components/admin/MultiLangField'

const EMPTY = { icon: '📢', text: { ar: '', fr: '', en: '' }, active: true }

export default function AdminAnnouncements() {
  const { t, tf } = useLang()
  const { announcements, announcementsCrud } = useData()
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
    setForm({ icon: item.icon, text: item.text, active: item.active })
    setModalOpen(true)
  }
  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (editing) await announcementsCrud.update(editing.id, form)
      else await announcementsCrud.add(form)
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
      await announcementsCrud.remove(id)
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
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageAnnouncements')}</h1>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('admin.addNew')}</button>
      </div>

      <div className="flex-col gap-3">
        {rowError && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>{rowError}</p>}
        {announcements.map((a) => (
          <div key={a.id} className="card card-pad flex-between fade-up" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{tf(a.text)}</span>
            </div>
            <div className="flex-center gap-2">
              <span className={`badge ${a.active ? 'badge-success' : 'badge-neutral'}`}>
                {a.active ? t('common.active') : t('common.inactive')}
              </span>
              <button className="btn btn-sm btn-secondary" onClick={() => announcementsCrud.toggleActive(a.id)}>
                {a.active ? t('common.disable') : t('common.enable')}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => openEdit(a)}>{t('common.edit')}</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)} disabled={deletingId === a.id}>
                {deletingId === a.id ? t('admin.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-muted text-center">{t('common.noResults')}</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('admin.addNew')}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Icon (emoji)</label>
            <input className="input" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} maxLength={4} />
          </div>
          <MultiLangInput label={t('common.message')} value={form.text} onChange={(text) => setForm((f) => ({ ...f, text }))} />
          <div className="field flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="ann-active" />
            <label htmlFor="ann-active" style={{ margin: 0 }}>{t('common.active')}</label>
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

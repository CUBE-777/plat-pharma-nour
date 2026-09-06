import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import Modal from '../../components/common/Modal'
import { MultiLangInput } from '../../components/admin/MultiLangField'
import ImageUploadField from '../../components/admin/ImageUploadField'

const EMPTY = {
  name: '',
  image: '',
  role: { ar: '', fr: '', en: '' },
  bio: { ar: '', fr: '', en: '' },
}

export default function AdminStaff() {
  const { t, tf } = useLang()
  const { staff, staffCrud } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }
  function openEdit(item) {
    setEditing(item)
    setForm({ name: item.name, image: item.image, role: item.role, bio: item.bio })
    setModalOpen(true)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (editing) staffCrud.update(editing.id, form)
    else staffCrud.add(form)
    setModalOpen(false)
  }
  function handleDelete(id) {
    if (window.confirm(t('admin.confirmDelete'))) staffCrud.remove(id)
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageStaff')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('admin.addNew')}</button>
      </div>

      <div className="grid grid-4">
        {staff.map((s) => (
          <div key={s.id} className="card fade-up" style={{ overflow: 'hidden' }}>
            <div style={{ height: 140, overflow: 'hidden' }}>
              <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="card-pad">
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>{s.name}</div>
              <div className="text-secondary" style={{ fontSize: 12.5, marginBottom: 12 }}>{tf(s.role)}</div>
              <div className="flex-center gap-2">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(s)}>{t('common.edit')}</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>{t('common.delete')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('admin.addNew')} maxWidth={520}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('common.name')}</label>
            <input className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <ImageUploadField label="صورة الموظف" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
          <MultiLangInput label={t('team.title')} value={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />
          <MultiLangInput label="Bio" value={form.bio} onChange={(bio) => setForm((f) => ({ ...f, bio }))} textarea />
          <button type="submit" className="btn btn-primary btn-block">{t('common.save')}</button>
        </form>
      </Modal>
    </div>
  )
}

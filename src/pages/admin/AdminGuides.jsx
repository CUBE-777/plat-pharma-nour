import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import Modal from '../../components/common/Modal'
import { MultiLangInput, MultiLangListInput } from '../../components/admin/MultiLangField'
import ImageUploadField from '../../components/admin/ImageUploadField'

const EMPTY_ML = { ar: '', fr: '', en: '' }
const EMPTY_LIST = { ar: [], fr: [], en: [] }
const EMPTY = {
  categoryId: '',
  active: true,
  title: { ...EMPTY_ML },
  cover: '',
  intro: { ...EMPTY_ML },
  keyPoints: { ...EMPTY_LIST },
  tips: { ...EMPTY_LIST },
}

export default function AdminGuides() {
  const { t, tf } = useLang()
  const { healthGuides, guideCategories, healthGuidesCrud } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY, categoryId: guideCategories[0]?.id || '' })
    setModalOpen(true)
  }
  function openEdit(item) {
    setEditing(item)
    setForm({
      categoryId: item.categoryId,
      active: item.active,
      title: item.title,
      cover: item.cover,
      intro: item.intro,
      keyPoints: item.keyPoints,
      tips: item.tips,
    })
    setModalOpen(true)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (editing) healthGuidesCrud.update(editing.id, form)
    else healthGuidesCrud.add(form)
    setModalOpen(false)
  }
  function handleDelete(id) {
    if (window.confirm(t('admin.confirmDelete'))) healthGuidesCrud.remove(id)
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageGuides')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('admin.addNew')}</button>
      </div>

      <div className="grid grid-3">
        {healthGuides.map((g) => {
          const cat = guideCategories.find((c) => c.id === g.categoryId)
          return (
            <div key={g.id} className="card fade-up" style={{ overflow: 'hidden' }}>
              <div style={{ height: 130, overflow: 'hidden' }}>
                <img src={g.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-pad">
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <span className="text-muted" style={{ fontSize: 12 }}>{cat ? `${cat.icon} ${tf(cat.name)}` : ''}</span>
                  <span className={`badge ${g.active ? 'badge-success' : 'badge-neutral'}`}>
                    {g.active ? t('common.active') : t('common.inactive')}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14 }} className="truncate-2">{tf(g.title)}</div>
                <div className="flex-center gap-2" style={{ marginTop: 14 }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => healthGuidesCrud.toggleActive(g.id)}>
                    {g.active ? t('common.disable') : t('common.enable')}
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(g)}>{t('common.edit')}</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}>{t('common.delete')}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('admin.addNew')} maxWidth={600}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('common.category')}</label>
            <select className="select" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              {guideCategories.map((c) => (
                <option value={c.id} key={c.id}>{c.icon} {tf(c.name)}</option>
              ))}
            </select>
          </div>
          <ImageUploadField label="صورة الغلاف" value={form.cover} onChange={(v) => setForm((f) => ({ ...f, cover: v }))} />
          <MultiLangInput label={t('common.name')} value={form.title} onChange={(title) => setForm((f) => ({ ...f, title }))} />
          <MultiLangInput label={t('guides.intro')} value={form.intro} onChange={(intro) => setForm((f) => ({ ...f, intro }))} textarea />
          <MultiLangListInput label={t('guides.keyPoints')} value={form.keyPoints} onChange={(keyPoints) => setForm((f) => ({ ...f, keyPoints }))} />
          <MultiLangListInput label={t('guides.tips')} value={form.tips} onChange={(tips) => setForm((f) => ({ ...f, tips }))} />
          <div className="field flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="guide-active" />
            <label htmlFor="guide-active" style={{ margin: 0 }}>{t('common.active')}</label>
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t('common.save')}</button>
        </form>
      </Modal>
    </div>
  )
}

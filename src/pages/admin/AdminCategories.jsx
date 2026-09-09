import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import Modal from '../../components/common/Modal'
import { MultiLangInput } from '../../components/admin/MultiLangField'

const EMPTY_ML = { ar: '', fr: '', en: '' }

// يحوّل نصًا عربيًا/فرنسيًا/إنجليزيًا إلى معرّف (slug) بسيط صالح كمفتاح أساسي:
// أحرف/أرقام لاتينية فقط، شرطات بدل الفراغات. لا يدعم تحويل الأحرف العربية
// (لا معنى صوتي مباشر)، فـ يبقى الحقل قابلاً للتعديل اليدوي دائمًا.
function slugify(text) {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminCategories() {
  const { t, tf } = useLang()
  const {
    categories,
    guideCategories,
    medicines,
    healthGuides,
    categoriesCrud,
    guideCategoriesCrud,
  } = useData()

  const [tab, setTab] = useState('medicines') // 'medicines' | 'guides'
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', icon: '🏷️', name: { ...EMPTY_ML } })
  const [idTouched, setIdTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [rowError, setRowError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const isGuides = tab === 'guides'
  const list = isGuides ? guideCategories : categories
  const crud = isGuides ? guideCategoriesCrud : categoriesCrud
  const usageCount = (id) =>
    isGuides
      ? healthGuides.filter((g) => g.categoryId === id).length
      : medicines.filter((m) => m.categoryId === id).length

  function openAdd() {
    setEditing(null)
    setFormError('')
    setIdTouched(false)
    setForm({ id: '', icon: '🏷️', name: { ...EMPTY_ML } })
    setModalOpen(true)
  }
  function openEdit(item) {
    setEditing(item)
    setFormError('')
    setIdTouched(true)
    setForm({ id: item.id, icon: item.icon || '🏷️', name: item.name })
    setModalOpen(true)
  }

  function updateName(name) {
    setForm((f) => {
      const next = { ...f, name }
      // نولّد المعرّف تلقائيًا من الاسم الإنجليزي طالما المستخدم لم يعدّله يدويًا
      // بعد (وطالما هذا إضافة جديدة، ماشي تعديل عنصر موجود بالفعل)
      if (!editing && !idTouched) {
        next.id = slugify(name.en || name.fr || name.ar)
      }
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const cleanId = slugify(form.id)
    if (!cleanId) {
      setFormError(t('admin.categorySlug'))
      return
    }
    if (!editing && list.some((c) => c.id === cleanId)) {
      setFormError(t('admin.duplicateCategoryId'))
      return
    }
    setSaving(true)
    try {
      if (editing) {
        // id هو المفتاح الأساسي (primary key) — لا نسمح بتغييره بعد الإنشاء
        // لتفادي "يتم" الربط مع الأدوية/المقالات الموجودة بالفعل.
        const payload = isGuides ? { icon: form.icon, name: form.name } : { name: form.name }
        await crud.update(editing.id, payload)
      } else {
        const payload = isGuides
          ? { id: cleanId, icon: form.icon, name: form.name }
          : { id: cleanId, name: form.name }
        await crud.add(payload)
      }
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      const msg = String(err?.message || '')
      setFormError(msg.includes('duplicate') ? t('admin.duplicateCategoryId') : t('admin.saveError'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('admin.confirmDelete'))) return
    setRowError('')
    setDeletingId(id)
    try {
      await crud.remove(id)
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
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageCategories')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('admin.addNew')}</button>
      </div>

      <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: 18 }}>
        <button
          className={`btn btn-sm ${!isGuides ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('medicines')}
        >
          💊 {t('admin.medicineCategories')}
        </button>
        <button
          className={`btn btn-sm ${isGuides ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('guides')}
        >
          📘 {t('admin.guideCategoryTabs')}
        </button>
      </div>

      {rowError && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{rowError}</p>}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ textAlign: 'start', borderBottom: '1px solid var(--border)' }}>
              {[
                isGuides ? '' : null,
                t('common.name'),
                t('admin.categorySlug'),
                isGuides ? t('admin.totalGuides') : t('admin.totalMedicines'),
                t('admin.actions'),
              ]
                .filter((h) => h !== null)
                .map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                {isGuides && <td style={{ padding: '12px 16px', fontSize: 20 }}>{c.icon}</td>}
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13.5 }}>{tf(c.name)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{usageCount(c.id)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex-center gap-2">
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(c)}>{t('common.edit')}</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}>
                      {deletingId === c.id ? t('admin.deleting') : t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="text-muted text-center" style={{ padding: 24 }}>{t('common.noResults')}</p>}
      </div>

      <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>
        ⓘ {t('admin.categoryInUseHint')}
      </p>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('admin.addNew')} maxWidth={480}>
        <form onSubmit={handleSubmit}>
          {isGuides && (
            <div className="field">
              <label>{t('admin.categoryIcon')}</label>
              <input className="input" style={{ maxWidth: 120 }} value={form.icon} maxLength={4} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
            </div>
          )}
          <MultiLangInput label={t('common.name')} value={form.name} onChange={updateName} />
          <div className="field">
            <label>{t('admin.categorySlug')}</label>
            <input
              className="input"
              required
              dir="ltr"
              style={{ fontFamily: 'monospace' }}
              value={form.id}
              disabled={!!editing}
              onChange={(e) => {
                setIdTouched(true)
                setForm((f) => ({ ...f, id: e.target.value }))
              }}
            />
            <p className="text-muted" style={{ fontSize: 11.5, marginTop: 4 }}>{t('admin.categorySlugHint')}</p>
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

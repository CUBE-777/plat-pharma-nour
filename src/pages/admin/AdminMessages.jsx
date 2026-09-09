import { useEffect, useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import * as api from '../../services/api'

const TYPE_META = {
  contact: { icon: '📞', labelKey: 'admin.typeContact' },
  inquiry: { icon: '💊', labelKey: 'admin.typeInquiry' },
  ask_pharmacist: { icon: '🩺', labelKey: 'admin.typeAskPharmacist' },
}

export default function AdminMessages() {
  const { t } = useLang()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'new' | 'read'

  async function load() {
    setLoading(true)
    setError('')
    const { data, error: err } = await api.getMessages()
    if (err) setError(t('admin.loadError'))
    else setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toggleStatus(msg) {
    setBusyId(msg.id)
    const nextStatus = msg.status === 'new' ? 'read' : 'new'
    const { data, error: err } = await api.updateMessageStatus(msg.id, nextStatus)
    if (!err && data) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? data : m)))
    }
    setBusyId(null)
  }

  async function handleDelete(id) {
    if (!window.confirm(t('admin.confirmDelete'))) return
    setBusyId(id)
    const { error: err } = await api.deleteMessage(id)
    if (!err) {
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } else {
      setError(t('admin.deleteError'))
    }
    setBusyId(null)
  }

  const filtered = messages.filter((m) => filter === 'all' || m.status === filter)

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('admin.manageMessages')}</h1>
        <div className="flex-center gap-2">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>{t('common.all')}</button>
          <button className={`btn btn-sm ${filter === 'new' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('new')}>{t('admin.statusNew')}</button>
          <button className={`btn btn-sm ${filter === 'read' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('read')}>{t('admin.statusRead')}</button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{error}</p>}

      {loading ? (
        <p className="text-muted text-center" style={{ padding: 24 }}>{t('common.loading')}</p>
      ) : (
        <div className="flex-col gap-3">
          {filtered.map((m) => {
            const meta = TYPE_META[m.type] || { icon: '✉️', labelKey: 'admin.typeContact' }
            return (
              <div key={m.id} className="card card-pad fade-up">
                <div className="flex-between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: 20 }}>{meta.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{t(meta.labelKey)}</span>
                    <span className={`badge ${m.status === 'new' ? 'badge-success' : 'badge-neutral'}`}>
                      {m.status === 'new' ? t('admin.statusNew') : t('admin.statusRead')}
                    </span>
                  </div>
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-2" style={{ gap: 6, marginBottom: 10 }}>
                  {m.name && <div style={{ fontSize: 13 }}><strong>{t('common.name')}:</strong> {m.name}</div>}
                  {m.phone && <div style={{ fontSize: 13 }}><strong>{t('common.phone')}:</strong> {m.phone}</div>}
                  {m.email && <div style={{ fontSize: 13 }}><strong>{t('common.email')}:</strong> {m.email}</div>}
                  {m.medicine_name && <div style={{ fontSize: 13 }}><strong>{t('inquiry.medicineName')}:</strong> {m.medicine_name}</div>}
                  {m.quantity != null && <div style={{ fontSize: 13 }}><strong>{t('inquiry.quantity')}:</strong> {m.quantity}</div>}
                </div>

                {m.message && (
                  <p className="text-secondary" style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                    {m.message}
                  </p>
                )}

                <div className="flex-center gap-2">
                  <button className="btn btn-sm btn-secondary" disabled={busyId === m.id} onClick={() => toggleStatus(m)}>
                    {m.status === 'new' ? t('admin.markAsRead') : t('admin.markAsNew')}
                  </button>
                  <button className="btn btn-sm btn-danger" disabled={busyId === m.id} onClick={() => handleDelete(m.id)}>
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="text-muted text-center" style={{ padding: 24 }}>{t('admin.messagesEmpty')}</p>}
        </div>
      )}
    </div>
  )
}

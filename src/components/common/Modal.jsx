import { useEffect, useRef } from 'react'
import { useLang } from '../../i18n/LanguageContext'

let modalIdCounter = 0

export default function Modal({ open, onClose, title, children, maxWidth = 480 }) {
  const { t } = useLang()
  const dialogRef = useRef(null)
  const titleIdRef = useRef(`modal-title-${++modalIdCounter}`)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // نقل التركيز (focus) تلقائيًا لأول عنصر قابل للتفاعل داخل النافذة عند
  // فتحها — ضروري لمستخدمي قارئ الشاشة ولوحة المفاتيح، حتى لا يبقى التركيز
  // "ضائعًا" خلف النافذة المنبثقة.
  useEffect(() => {
    if (!open) return
    const focusable = dialogRef.current?.querySelector(
      'input, textarea, select, button, [href], [tabindex]:not([tabindex="-1"])'
    )
    const target = focusable || dialogRef.current
    // requestAnimationFrame يضمن أن العنصر أصبح موجودًا فعليًا فـ DOM (بعد fade-up)
    const raf = requestAnimationFrame(() => target?.focus())
    return () => cancelAnimationFrame(raf)
  }, [open])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2,6,12,0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleIdRef.current}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="glass fade-up"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          background: 'var(--bg-elevated)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex-between" style={{ marginBottom: 18 }}>
          <h3 id={titleIdRef.current} style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label={t('common.close')}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

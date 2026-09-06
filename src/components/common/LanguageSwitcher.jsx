import { useState, useRef, useEffect } from 'react'
import { useLang } from '../../i18n/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang, languages } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Language" title="Language">
        <span style={{ fontSize: 14, fontWeight: 800 }}>{languages[lang].code.toUpperCase()}</span>
      </button>
      {open && (
        <div
          className="glass fade-up"
          style={{
            position: 'absolute',
            top: '48px',
            insetInlineEnd: 0,
            borderRadius: 'var(--radius-md)',
            padding: 6,
            minWidth: 160,
            zIndex: 60,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {Object.values(languages).map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className="flex-between"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: lang === l.code ? 'var(--bg-elevated)' : 'transparent',
                color: 'var(--text-primary)',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
              }}
            >
              <span>{l.flag} {l.label}</span>
              {lang === l.code && <span style={{ color: 'var(--accent)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

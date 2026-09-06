import { useEffect, useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'

export default function AnnouncementBar() {
  const { tf } = useLang()
  const { announcements } = useData()
  const active = announcements.filter((a) => a.active)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (active.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % active.length), 4500)
    return () => clearInterval(id)
  }, [active.length])

  if (active.length === 0) return null
  const current = active[index % active.length]

  return (
    <div
      style={{
        background: 'var(--gradient-accent)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        className="container flex-center gap-2"
        style={{ padding: '9px 20px', minHeight: 40, position: 'relative' }}
      >
        <div key={current.id} className="fade-up flex-center gap-2" style={{ fontSize: 13.5, fontWeight: 700, textAlign: 'center' }}>
          <span>{current.icon}</span>
          <span>{tf(current.text)}</span>
        </div>
      </div>
      {active.length > 1 && (
        <div className="flex-center gap-1" style={{ paddingBottom: 6 }}>
          {active.map((a, i) => (
            <span
              key={a.id}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? 16 : 6,
                height: 6,
                borderRadius: 4,
                background: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all .3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

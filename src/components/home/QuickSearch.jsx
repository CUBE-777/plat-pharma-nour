import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import MedicineCard from '../common/MedicineCard'

export default function QuickSearch() {
  const { t, tf } = useLang()
  const { medicines } = useData()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return medicines
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          tf(m.activeIngredient).toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [query, medicines, tf])

  function handleSubmit(e) {
    e.preventDefault()
    navigate(`/medicines?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">🔍 {t('common.search')}</span>
          <h2 className="section-title">{t('home.searchSectionTitle')}</h2>
          <p className="section-subtitle">{t('home.searchSectionSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass" style={{ maxWidth: 620, margin: '0 auto 28px', borderRadius: 'var(--radius-full)', padding: 6, display: 'flex', gap: 8 }}>
          <input
            className="input"
            style={{ border: 'none', background: 'transparent' }}
            placeholder={t('common.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={false}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            {t('common.search')}
          </button>
        </form>

        {results.length > 0 && (
          <div className="grid grid-3 fade-up" style={{ maxWidth: 980, margin: '0 auto' }}>
            {results.map((m) => (
              <MedicineCard medicine={m} key={m.id} />
            ))}
          </div>
        )}
        {query.trim() && results.length === 0 && (
          <p className="text-center text-muted">{t('common.noResults')}</p>
        )}
      </div>
    </section>
  )
}

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../context/DataContext'
import MedicineCard from '../components/common/MedicineCard'

export default function Medicines() {
  const { t, tf } = useLang()
  const { medicines, categories } = useData()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState('all')
  const [availability, setAvailability] = useState('all')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return medicines.filter((m) => {
      const matchesQuery =
        !q || m.name.toLowerCase().includes(q) || tf(m.activeIngredient).toLowerCase().includes(q)
      const matchesCategory = category === 'all' || m.categoryId === category
      const matchesAvailability = availability === 'all' || m.availability === availability
      return matchesQuery && matchesCategory && matchesAvailability
    })
  }, [medicines, query, category, availability, tf])

  return (
    <div className="page">
      <div className="section-sm" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">💊 {t('nav.medicines')}</span>
          <h1 className="section-title">{t('medicines.title')}</h1>
          <p className="section-subtitle">{t('medicines.subtitle')}</p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 28 }}>
          <div className="filters-grid">
            <input
              className="input"
              placeholder={t('medicines.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">{t('common.all')} — {t('medicines.filterCategory')}</option>
              {categories.map((c) => (
                <option value={c.id} key={c.id}>{tf(c.name)}</option>
              ))}
            </select>
            <select className="select" value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="all">{t('common.all')} — {t('medicines.filterAvailability')}</option>
              <option value="available">{t('status.available')}</option>
              <option value="limited">{t('status.limited')}</option>
              <option value="out">{t('status.outOfStock')}</option>
            </select>
          </div>
        </div>

        <p className="text-muted" style={{ marginBottom: 16, fontSize: 13.5 }}>
          {filtered.length} {t('medicines.resultsCount')}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-4">
            {filtered.map((m) => (
              <MedicineCard medicine={m} key={m.id} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted" style={{ padding: '60px 0' }}>
            {t('common.noResults')}
          </div>
        )}
      </div>
      <style>{`
        .filters-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 12px; }
        @media (max-width: 760px) { .filters-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

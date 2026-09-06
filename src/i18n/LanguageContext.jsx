import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { translations, LANGUAGES } from './translations'

const LanguageContext = createContext(null)

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

const STORAGE_KEY = 'pharma_lang'

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && LANGUAGES[saved]) return saved
    } catch (e) {}
    return 'ar'
  })

  useEffect(() => {
    const dir = LANGUAGES[lang]?.dir || 'rtl'
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (e) {}
  }, [lang])

  const setLang = useCallback((code) => {
    if (LANGUAGES[code]) setLangState(code)
  }, [])

  const t = useCallback(
    (key, fallback) => {
      const value = getNested(translations[lang], key)
      if (value !== undefined) return value
      const fb = getNested(translations.ar, key)
      return fb !== undefined ? fb : fallback || key
    },
    [lang]
  )

  // pick a localized field from a multilingual object { ar, fr, en }
  const tf = useCallback(
    (field) => {
      if (!field) return ''
      if (typeof field === 'string') return field
      return field[lang] || field.ar || field.en || field.fr || ''
    },
    [lang]
  )

  const dir = LANGUAGES[lang]?.dir || 'rtl'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tf, dir, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}

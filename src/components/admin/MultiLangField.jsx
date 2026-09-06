const FLAGS = { ar: '🇲🇦', fr: '🇫🇷', en: '🇬🇧' }

export function MultiLangInput({ label, value, onChange, textarea = false }) {
  const val = value || { ar: '', fr: '', en: '' }
  function update(lang, text) {
    onChange({ ...val, [lang]: text })
  }
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div className="field">
      <label>{label}</label>
      <div className="flex-col gap-2">
        {['ar', 'fr', 'en'].map((lang) => (
          <div key={lang} style={{ position: 'relative' }}>
            <Tag
              className={textarea ? 'textarea' : 'input'}
              style={{ paddingInlineStart: 42 }}
              value={val[lang] || ''}
              onChange={(e) => update(lang, e.target.value)}
              placeholder={`${FLAGS[lang]} ${lang.toUpperCase()}`}
            />
            <span style={{ position: 'absolute', insetInlineStart: 12, top: textarea ? 12 : 11, fontSize: 14 }}>{FLAGS[lang]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// For array-of-strings multilingual fields (e.g. keyPoints, tips) — edit as newline-separated text per language
export function MultiLangListInput({ label, value, onChange }) {
  const val = value || { ar: [], fr: [], en: [] }
  function update(lang, text) {
    onChange({ ...val, [lang]: text.split('\n').filter((l) => l.trim() !== '') })
  }
  return (
    <div className="field">
      <label>{label}</label>
      <div className="flex-col gap-2">
        {['ar', 'fr', 'en'].map((lang) => (
          <div key={lang} style={{ position: 'relative' }}>
            <textarea
              className="textarea"
              style={{ paddingInlineStart: 42, minHeight: 76 }}
              value={(val[lang] || []).join('\n')}
              onChange={(e) => update(lang, e.target.value)}
              placeholder={`${FLAGS[lang]} ${lang.toUpperCase()} — ${'\n'}one item per line`}
            />
            <span style={{ position: 'absolute', insetInlineStart: 12, top: 12, fontSize: 14 }}>{FLAGS[lang]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

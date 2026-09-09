import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { translateToMany } from '../../services/translate'

const FLAGS = { ar: '🇲🇦', fr: '🇫🇷', en: '🇬🇧' }
const ALL_LANGS = ['ar', 'fr', 'en']

export function MultiLangInput({ label, value, onChange, textarea = false }) {
  const { lang: siteLang } = useLang()
  const val = value || { ar: '', fr: '', en: '' }
  const [translating, setTranslating] = useState(false)
  // اللغات التي عُبّئت آليًا ولم يعدّلها المستخدم يدويًا بعد — تُستخدم لعرض
  // شارة "مُترجم آليًا، يُرجى المراجعة" تحت كل حقل تُرجم تلقائيًا.
  const [autoFilled, setAutoFilled] = useState({})
  const [translateError, setTranslateError] = useState('')

  function update(lang, text) {
    onChange({ ...val, [lang]: text })
    // بمجرد ما يعدّل المستخدم يدويًا حقلاً تُرجم آليًا، نشيل عنه الشارة
    // لأنه أصبح نصًا راجعه/عدّله المدير بنفسه.
    if (autoFilled[lang]) {
      setAutoFilled((prev) => {
        const next = { ...prev }
        delete next[lang]
        return next
      })
    }
  }

  async function handleAutoTranslate() {
    setTranslateError('')

    // لغة المصدر: نفضّل لغة الموقع الحالية إذا كانت معبأة، وإلا أول لغة معبأة نجدها
    const sourceLang = (val[siteLang] || '').trim()
      ? siteLang
      : ALL_LANGS.find((l) => (val[l] || '').trim())

    if (!sourceLang) {
      setTranslateError('اكتب النص بلغة واحدة أولاً، ثم اضغط ترجمة.')
      return
    }

    // لا نترجم أبداً فوق حقل معبأ مسبقًا (لا نطمس تعديلات المدير اليدوية)
    const targets = ALL_LANGS.filter((l) => l !== sourceLang && !(val[l] || '').trim())
    if (targets.length === 0) {
      setTranslateError('كل اللغات معبأة بالفعل.')
      return
    }

    setTranslating(true)
    try {
      const results = await translateToMany(val[sourceLang], sourceLang, targets)
      const updated = { ...val }
      const newlyFilled = {}
      let anySucceeded = false
      for (const l of targets) {
        if (results[l]) {
          updated[l] = results[l]
          newlyFilled[l] = true
          anySucceeded = true
        }
      }
      if (anySucceeded) {
        onChange(updated)
        setAutoFilled((prev) => ({ ...prev, ...newlyFilled }))
      } else {
        setTranslateError('تعذّرت الترجمة الآن. حاول مرة أخرى لاحقًا أو أدخلها يدويًا.')
      }
    } finally {
      setTranslating(false)
    }
  }

  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div className="field">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <label>{label}</label>
        <button
          type="button"
          onClick={handleAutoTranslate}
          disabled={translating}
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 20,
            border: '1px solid var(--accent, #6366f1)',
            background: 'transparent',
            color: 'var(--accent, #6366f1)',
            cursor: translating ? 'default' : 'pointer',
            opacity: translating ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {translating ? 'جارِ الترجمة...' : '🌐 ترجمة تلقائية'}
        </button>
      </div>

      <div className="flex-col gap-2" style={{ marginTop: 6 }}>
        {ALL_LANGS.map((lang) => (
          <div key={lang} style={{ position: 'relative' }}>
            <Tag
              className={textarea ? 'textarea' : 'input'}
              style={{ paddingInlineStart: 42 }}
              value={val[lang] || ''}
              onChange={(e) => update(lang, e.target.value)}
              placeholder={`${FLAGS[lang]} ${lang.toUpperCase()}`}
            />
            <span style={{ position: 'absolute', insetInlineStart: 12, top: textarea ? 12 : 11, fontSize: 14 }}>{FLAGS[lang]}</span>
            {autoFilled[lang] && (
              <span style={{ fontSize: 10.5, color: 'var(--accent, #6366f1)', display: 'block', marginTop: 2 }}>
                🌐 مُترجم آليًا — يُرجى المراجعة قبل الحفظ
              </span>
            )}
          </div>
        ))}
      </div>

      {translateError && <p style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>{translateError}</p>}
    </div>
  )
}

// For array-of-strings multilingual fields (e.g. keyPoints, tips) — edit as newline-separated text per language
export function MultiLangListInput({ label, value, onChange }) {
  const val = value || { ar: [], fr: [], en: [] }
  function update(lang, text) {
    // نحتفظ بالأسطر كما هي أثناء الكتابة (بدون فلترة الأسطر الفارغة)، وإلا كان السطر الفارغ
    // اللي كيتزاد بضغطة Enter كيتحذف مباشرة ويولي المستخدم ما قادش يزيد بند جديد.
    // الفلترة ديال الأسطر الفارغة كتوقع عند الحفظ (submit) وعند العرض، ماشي هنا.
    onChange({ ...val, [lang]: text.split('\n') })
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

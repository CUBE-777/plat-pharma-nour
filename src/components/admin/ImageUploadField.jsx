import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// حقل صورة: يسمح بلصق رابط URL يدويًا، أو رفع ملف مباشرة لـ Supabase Storage
// (bucket: images) واستعمال الرابط العمومي ديالو تلقائيًا.
export default function ImageUploadField({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      console.error(err)
      setUploadError('تعذّر رفع الصورة. تأكد من إعداد bucket "images" فـ Supabase Storage.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        {value ? (
          <img
            src={value}
            alt=""
            style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
          />
        ) : null}
        <input
          className="input"
          style={{ flex: 1, minWidth: 180 }}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... (أو ارفع صورة)"
        />
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? '...' : '📤 رفع صورة'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      {uploadError && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{uploadError}</p>}
    </div>
  )
}

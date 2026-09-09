import { supabase } from '../lib/supabaseClient'

// يستدعي Supabase Edge Function لترجمة نص واحد من لغة إلى أخرى.
// لا يرمي استثناء أبداً — يُرجع دائماً { data, error } ليسهل استخدامه في الواجهة
// بنفس نمط src/services/api.js.
export async function translateText(text, source, target) {
  if (!text || !text.trim()) return { data: '', error: null }
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, source, target },
    })
    if (error) {
      console.error('[translate] edge function error:', error)
      return { data: null, error }
    }
    if (data?.error) {
      console.error('[translate] translation error:', data.error)
      return { data: null, error: new Error(data.error) }
    }
    return { data: data.translatedText, error: null }
  } catch (err) {
    console.error('[translate] exception:', err)
    return { data: null, error: err }
  }
}

// يترجم نصاً واحداً من لغة مصدر إلى عدة لغات هدف بالتوازي.
// يُرجع دائماً كائناً { lang: نص_مترجم | null } — لغة فشلت ترجمتها تكون قيمتها null
// بدل رمي خطأ يوقف بقية الترجمات.
export async function translateToMany(text, source, targets) {
  const results = await Promise.all(
    targets.map(async (target) => {
      const { data } = await translateText(text, source, target)
      return [target, data || null]
    })
  )
  return Object.fromEntries(results)
}

import { createClient } from '@supabase/supabase-js'

// ⚠️ تحذير أمني حرج:
// هذا الملف يعمل داخل المتصفح (Client-side / Bundle عمومي يراه أي زائر).
// يُمنع منعًا باتًا استيراد أو استخدام SUPABASE_SERVICE_ROLE_KEY هنا أو في أي
// ملف آخر ضمن src/. مفتاح service_role يتجاوز RLS بالكامل ويمنح صلاحيات كاملة
// على قاعدة البيانات؛ يجب أن يبقى فقط على الخادم (Supabase Edge Functions,
// سكربتات CI/CD، أو باك-إند منفصل) ولا يوضع أبدًا في متغيرات VITE_* لأن أي
// متغير يبدأ بـ VITE_ يُضمَّن في الحزمة النهائية ويصبح مرئيًا للجميع.
// استعمل هنا حصريًا: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase] المتغيرات VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY غير موجودة. ' +
      'راجع ملف .env محليًا، أو Environment variables في Netlify. ' +
      'سيعمل الموقع بوضع محدود (Fallback) بدل التحطم الكامل إلى حين ضبط المتغيرات.'
  )
}

// عميل احتياطي (Fallback) آمن: يُستخدم فقط إذا غابت متغيرات البيئة، لكي لا
// يتسبب استدعاء createClient(undefined, undefined) في تحطم التطبيق بالكامل
// (White Screen) عند الإقلاع. جميع الدوال هنا ترجع نتيجة "فارغة" آمنة بدل رمي استثناء.
function createSafeFallbackClient() {
  const notConfiguredError = new Error(
    'Supabase غير مهيأ: تحقق من متغيرات البيئة VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY'
  )
  const failSoftly = async () => ({ data: null, error: notConfiguredError })
  const queryFallback = () => ({
    select: failSoftly,
    insert: failSoftly,
    update: failSoftly,
    delete: failSoftly,
    upsert: failSoftly,
    eq: () => queryFallback(),
    order: () => queryFallback(),
    single: failSoftly,
  })

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: failSoftly,
      signOut: async () => ({ error: null }),
      updateUser: failSoftly,
    },
    from: () => queryFallback(),
    storage: {
      from: () => ({
        upload: failSoftly,
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  }
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createSafeFallbackClient()

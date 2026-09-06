import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase] المتغيرات VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY غير موجودة. ' +
      'راجع ملف .env أو إعدادات Environment variables في Netlify.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

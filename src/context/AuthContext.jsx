import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  const verifyAdmin = useCallback(async (user) => {
    if (!user) {
      setIsAdmin(false)
      return false
    }
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      // إذا وُجد في جدول admins
      if (!error && data) {
        setIsAdmin(true)
        return true
      }
      // إذا كان الجدول غير منشأ بعد (قبل تشغيل security_patch)، نعتمد على وجود جلسة مصادقة
      if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
        setIsAdmin(true)
        return true
      }
      // التحقق من دور المستخدم في البيانات الوصفية (app_metadata / user_metadata)
      if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
        setIsAdmin(true)
        return true
      }
      setIsAdmin(false)
      return false
    } catch {
      setIsAdmin(false)
      return false
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        await verifyAdmin(data.session.user)
      }
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        await verifyAdmin(newSession.user)
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      listener?.subscription?.unsubscribe?.()
    }
  }, [verifyAdmin])

  const login = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { ok: false, error: error.message }
      }
      setSession(data.session)
      const isAdm = await verifyAdmin(data.session?.user)
      return { ok: true, isAdmin: isAdm }
    },
    [verifyAdmin]
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }, [])

  const changePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }, [])

  const value = {
    isAuthed: !!session,
    isAdmin,
    checking,
    user: session?.user || null,
    login,
    logout,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

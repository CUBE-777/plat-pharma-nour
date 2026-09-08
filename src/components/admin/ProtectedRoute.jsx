import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// شاشة تحميل بسيطة أثناء التحقق من صحة الجلسة مع Supabase
function AuthCheckingSpinner() {
  return (
    <div
      className="flex-center"
      style={{ minHeight: '100vh', flexDirection: 'column', gap: 12 }}
    >
      <div
        aria-label="جاري التحقق من الجلسة"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid var(--border, #e2e2e2)',
          borderTopColor: 'var(--accent, #6366f1)',
          animation: 'protected-route-spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 13, opacity: 0.7 }}>جاري التحقق من الجلسة...</span>
      <style>{`
        @keyframes protected-route-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function ProtectedRoute() {
  const { isAuthed, checking } = useAuth()

  // بدل عرض شاشة فارغة (null)، نعرض مؤشر تحميل واضح للمستخدم
  if (checking) return <AuthCheckingSpinner />

  // الجلسة غير صالحة أو غير موجودة -> توجيه سلس لصفحة تسجيل الدخول
  if (!isAuthed) return <Navigate to="/admin" replace />

  return <Outlet />
}

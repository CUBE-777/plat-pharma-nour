import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { useData } from './context/DataContext'

import Home from './pages/Home'
import Medicines from './pages/Medicines'
import MedicineDetail from './pages/MedicineDetail'
import Services from './pages/Services'
import HealthGuides from './pages/HealthGuides'
import HealthGuideDetail from './pages/HealthGuideDetail'
import Team from './pages/Team'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'

// التحميل الكسول (Lazy Loading) لصفحات لوحة الإدارة لتقليل حجم الحزمة الأولى للزوار
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'))
const AdminMedicines = lazy(() => import('./pages/admin/AdminMedicines'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'))
const AdminGuides = lazy(() => import('./pages/admin/AdminGuides'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminPharmacyInfo = lazy(() => import('./pages/admin/AdminPharmacyInfo'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

function LoadingSpinner() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg, #0b0f14)',
        color: 'var(--text-primary, #fff)',
        gap: 12,
      }}
    >
      <div
        aria-label="جاري تحميل البيانات"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: '#3b82f6',
          animation: 'app-loading-spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes app-loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// مغلّف صفحات الموقع العمومي: يتعامل مع حالة التحميل أو أخطاء قاعدة البيانات
// دون أن يحجب أو يعطل مسارات لوحة التحكم (/admin)
function PublicSiteWrapper() {
  const { loading, error, pharmacyInfo, refresh } = useData()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !pharmacyInfo) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg, #0b0f14)',
          color: 'var(--text-primary, #fff)',
          textAlign: 'center',
          padding: 24,
          gap: 16,
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
          {error ? 'تعذّر تحميل البيانات من قاعدة البيانات.' : 'معلومات الصيدلية غير متوفرة بعد.'}
        </p>
        <p style={{ fontSize: 13, opacity: 0.7, maxWidth: 480, margin: 0 }}>
          {error
            ? 'تأكد من أن متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY معرّفة بشكل صحيح ومن تنفيذ ملف supabase/schema.sql.'
            : 'قم بتنفيذ ملف supabase/schema.sql كاملًا أو سجّل الدخول للوحة التحكم لإعداد بيانات الصيدلية.'}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={refresh}
            className="btn btn-primary btn-sm"
          >
            إعادة المحاولة
          </button>
          <a href="/admin" className="btn btn-secondary btn-sm">
            دخول لوحة التحكم
          </a>
        </div>
      </div>
    )
  }

  return <SiteLayout />
}

export default function App() {
  return (
    <Routes>
      {/* Public / customer-facing site */}
      <Route element={<PublicSiteWrapper />}>
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/:id" element={<MedicineDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/health-guides" element={<HealthGuides />} />
        <Route path="/health-guides/:id" element={<HealthGuideDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin login (no sidebar) */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Protected admin panel with Suspense */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminAnnouncements />
              </Suspense>
            }
          />
          <Route
            path="/admin/medicines"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminMedicines />
              </Suspense>
            }
          />
          <Route
            path="/admin/services"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminServices />
              </Suspense>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminStaff />
              </Suspense>
            }
          />
          <Route
            path="/admin/guides"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminGuides />
              </Suspense>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminCategories />
              </Suspense>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminMessages />
              </Suspense>
            }
          />
          <Route
            path="/admin/pharmacy-info"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminPharmacyInfo />
              </Suspense>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSettings />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

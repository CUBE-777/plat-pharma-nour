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

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminMedicines from './pages/admin/AdminMedicines'
import AdminServices from './pages/admin/AdminServices'
import AdminStaff from './pages/admin/AdminStaff'
import AdminGuides from './pages/admin/AdminGuides'
import AdminPharmacyInfo from './pages/admin/AdminPharmacyInfo'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  const { loading, error, pharmacyInfo, refresh } = useData()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f14',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          gap: 10,
        }}
      >
        جاري تحميل البيانات...
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f14',
          color: '#fff',
          textAlign: 'center',
          padding: 24,
          gap: 14,
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700 }}>تعذّر تحميل البيانات من قاعدة البيانات.</p>
        <p style={{ fontSize: 13, opacity: 0.7, maxWidth: 480 }}>
          تأكد من أن متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY معرّفة بشكل صحيح
          (فملف .env محليًا، أو فإعدادات Environment variables فـ Netlify)، ومن أنك نفّذت ملف
          supabase/schema.sql على مشروع Supabase ديالك.
        </p>
        <button
          onClick={refresh}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  if (!pharmacyInfo) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f14',
          color: '#fff',
          textAlign: 'center',
          padding: 24,
          gap: 14,
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700 }}>جدول pharmacy_info فارغ.</p>
        <p style={{ fontSize: 13, opacity: 0.7, maxWidth: 480 }}>
          نفّذ ملف supabase/schema.sql كاملًا (فيه صف افتراضي إجباري)، أو أضف صفًا بيدويًا فـ Table
          Editor فـ Supabase (id = 1).
        </p>
        <button
          onClick={refresh}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public / customer-facing site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/:id" element={<MedicineDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/health-guides" element={<HealthGuides />} />
        <Route path="/health-guides/:id" element={<HealthGuideDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin login (no sidebar) */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Protected admin panel */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/medicines" element={<AdminMedicines />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/guides" element={<AdminGuides />} />
          <Route path="/admin/pharmacy-info" element={<AdminPharmacyInfo />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

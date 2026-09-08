import { Component } from 'react'

// Error Boundary: يلتقط أي خطأ JavaScript يحدث أثناء render في شجرة المكونات
// التابعة له، ويعرض واجهة بديلة أنيقة بدل شاشة بيضاء فارغة (White Screen).
// ملاحظة مهمة: Error Boundaries لازم تكون Class Component (متطلب من React نفسه،
// لا يوجد Hook مكافئ حاليًا)، ولا تلتقط أخطاء داخل event handlers أو async code
// خارج دورة الـ render — تلك تُعالج بـ try/catch في مكانها (كما في api.js أدناه).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] خطأ غير متوقع في الواجهة:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    // نستخدم location.href بدل useNavigate لأن ErrorBoundary قد يلتقط
    // خطأ حصل حتى داخل React Router نفسه، فلا يمكن الاعتماد على hooks هنا.
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

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
          gap: 16,
        }}
      >
        <div style={{ fontSize: 40 }}>⚠️</div>
        <p style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>حدث خطأ غير متوقع</p>
        <p style={{ fontSize: 13, opacity: 0.7, maxWidth: 480, margin: 0 }}>
          نعتذر عن الإزعاج. حدثت مشكلة تقنية أثناء عرض هذه الصفحة. حاول تحديث الصفحة، أو
          العودة إلى الرئيسية. إذا استمرت المشكلة، تواصل مع الدعم الفني.
        </p>

        {import.meta.env.DEV && this.state.error && (
          <pre
            style={{
              maxWidth: 600,
              overflow: 'auto',
              fontSize: 11,
              opacity: 0.6,
              background: 'rgba(255,255,255,0.05)',
              padding: 12,
              borderRadius: 8,
              textAlign: 'left',
              direction: 'ltr',
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.handleReload}
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
            تحديث الصفحة
          </button>
          <button
            onClick={this.handleGoHome}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    )
  }
}

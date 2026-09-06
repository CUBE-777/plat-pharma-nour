import { useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import AskPharmacistModal from './AskPharmacistModal'

export default function FloatingAskButton() {
  const { t, dir } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary pulse"
        aria-label={t('home.askPharmacist')}
        style={{
          position: 'fixed',
          bottom: 22,
          [dir === 'rtl' ? 'left' : 'right']: 22,
          zIndex: 90,
          boxShadow: 'var(--shadow-lg)',
          padding: '14px 20px',
        }}
      >
        💬 <span className="floating-ask-label">{t('home.askPharmacist')}</span>
      </button>
      <AskPharmacistModal open={open} onClose={() => setOpen(false)} />
      <style>{`
        @media (max-width: 640px) {
          .floating-ask-label { display: none; }
        }
      `}</style>
    </>
  )
}

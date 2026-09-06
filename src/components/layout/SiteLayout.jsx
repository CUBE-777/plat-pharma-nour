import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../common/AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingAskButton from '../common/FloatingAskButton'

export default function SiteLayout() {
  return (
    <div className="page">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingAskButton />
    </div>
  )
}

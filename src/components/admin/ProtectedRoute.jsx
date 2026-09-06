import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthed, checking } = useAuth()
  if (checking) return null
  if (!isAuthed) return <Navigate to="/admin" replace />
  return <Outlet />
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from './useSesion'

export default function RutaAdmin() {
  const { autenticado } = useSesion()
  const location = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: location }} />
  }

  return <Outlet />
}

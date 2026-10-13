import { lazy } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import RutaAdmin from './auth/RutaAdmin'
import { SesionProvider } from './auth/SesionContext'

import Login from './pages/Login'
import Recuperar from './pages/Recuperar'
import SesionCerrada from './pages/SesionCerrada'
import SinPermiso from './pages/SinPermiso'
import ErrorServidor from './pages/ErrorServidor'
import NoEncontrada from './pages/NoEncontrada'

// Las páginas protegidas se descargan al entrar a ellas (Recharts solo viaja con Resumen).
// Mientras cargan, LayoutAdmin muestra un esqueleto. Las públicas y de error son livianas: van directo.
const Resumen = lazy(() => import('./pages/resumen/Resumen'))
const Donaciones = lazy(() => import('./pages/Donaciones'))
const DonacionDetalle = lazy(() => import('./pages/DonacionDetalle'))
const Solicitudes = lazy(() => import('./pages/Solicitudes'))
const SolicitudDetalle = lazy(() => import('./pages/SolicitudDetalle'))
const Novedades = lazy(() => import('./pages/Novedades'))
const Usuarios = lazy(() => import('./pages/Usuarios'))
const UsuarioDetalle = lazy(() => import('./pages/UsuarioDetalle'))
const Sanciones = lazy(() => import('./pages/Sanciones'))
const Categorias = lazy(() => import('./pages/Categorias'))
const Configuracion = lazy(() => import('./pages/Configuracion'))
const Notificaciones = lazy(() => import('./pages/Notificaciones'))

// La sesión vive dentro del router para poder usar useNavigate al cerrar sesión.
function Raiz() {
  return (
    <SesionProvider>
      <Outlet />
    </SesionProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <Raiz />,
    children: [
      // Públicas
      { path: '/login', element: <Login /> },
      { path: '/recuperar', element: <Recuperar /> },
      { path: '/sesion-cerrada', element: <SesionCerrada /> },

      // Protegidas (solo Administrador)
      {
        element: <RutaAdmin />,
        children: [
          { path: '/', element: <Resumen /> },
          { path: '/donaciones', element: <Donaciones /> },
          { path: '/donaciones/:id', element: <DonacionDetalle /> },
          { path: '/solicitudes', element: <Solicitudes /> },
          { path: '/solicitudes/:id', element: <SolicitudDetalle /> },
          { path: '/novedades', element: <Novedades /> },
          { path: '/usuarios', element: <Usuarios /> },
          { path: '/usuarios/:id', element: <UsuarioDetalle /> },
          { path: '/sanciones', element: <Sanciones /> },
          { path: '/categorias', element: <Categorias /> },
          { path: '/configuracion', element: <Configuracion /> },
          { path: '/notificaciones', element: <Notificaciones /> },
        ],
      },

      // Errores
      { path: '/sin-permiso', element: <SinPermiso /> },
      { path: '/error', element: <ErrorServidor /> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

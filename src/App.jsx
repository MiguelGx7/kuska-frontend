import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import RutaAdmin from './auth/RutaAdmin'
import { SesionProvider } from './auth/SesionContext'

import Login from './pages/Login'
import Recuperar from './pages/Recuperar'
import SesionCerrada from './pages/SesionCerrada'

import Resumen from './pages/Resumen'
import Donaciones from './pages/Donaciones'
import DonacionDetalle from './pages/DonacionDetalle'
import Solicitudes from './pages/Solicitudes'
import SolicitudDetalle from './pages/SolicitudDetalle'
import Novedades from './pages/Novedades'
import Usuarios from './pages/Usuarios'
import UsuarioDetalle from './pages/UsuarioDetalle'
import Sanciones from './pages/Sanciones'
import Categorias from './pages/Categorias'
import Configuracion from './pages/Configuracion'
import Notificaciones from './pages/Notificaciones'

import SinPermiso from './pages/SinPermiso'
import ErrorServidor from './pages/ErrorServidor'
import NoEncontrada from './pages/NoEncontrada'

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

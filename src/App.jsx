import { lazy } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import RutaAdmin from './auth/RutaAdmin'
import { SesionProvider } from './auth/SesionContext'
import LimiteError from './components/LimiteError'
import PaginaErrorServidor from './components/PaginaErrorServidor'
import SinConexion from './components/SinConexion'
import { ToastProvider } from './components/toast/ToastProvider'

import Login from './pages/Login'
import Recuperar from './pages/Recuperar'
import SesionCerrada from './pages/errores/SesionCerrada'
import SinPermiso from './pages/errores/SinPermiso'
import ErrorServidor from './pages/errores/ErrorServidor'
import NoEncontrada from './pages/errores/NoEncontrada'

// Las páginas protegidas se descargan al entrar a ellas (Recharts solo viaja con Resumen).
// Mientras cargan, LayoutAdmin muestra un esqueleto. Las públicas y de error son livianas: van directo.
const Resumen = lazy(() => import('./pages/resumen/Resumen'))
const Donaciones = lazy(() => import('./pages/donaciones/ListaDonaciones'))
const DonacionDetalle = lazy(() => import('./pages/donaciones/DetalleDonacion'))
const Solicitudes = lazy(() => import('./pages/solicitudes/ListaSolicitudes'))
const SolicitudDetalle = lazy(() => import('./pages/solicitudes/DetalleSolicitud'))
const Novedades = lazy(() => import('./pages/novedades/Novedades'))
const Usuarios = lazy(() => import('./pages/usuarios/ListaUsuarios'))
const UsuarioDetalle = lazy(() => import('./pages/usuarios/DetalleUsuario'))
const Sanciones = lazy(() => import('./pages/sanciones/Sanciones'))
const Categorias = lazy(() => import('./pages/categorias/Categorias'))
const Configuracion = lazy(() => import('./pages/configuracion/Configuracion'))
const Notificaciones = lazy(() => import('./pages/notificaciones/Notificaciones'))

// La sesión vive dentro del router para poder usar useNavigate al cerrar sesión.
// El toast va aquí para poder usarlo en cualquier pantalla.
// LimiteError muestra la página 500 si algo falla al renderizar (el layout tiene el suyo).
// SinConexion cubre todo mientras el navegador no tenga internet.
function Raiz() {
  return (
    <SesionProvider>
      <ToastProvider>
        <LimiteError>
          <Outlet />
        </LimiteError>
        <SinConexion />
      </ToastProvider>
    </SesionProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <Raiz />,
    // Red de seguridad del router: sin esto mostraría su pantalla genérica en inglés.
    errorElement: <PaginaErrorServidor />,
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

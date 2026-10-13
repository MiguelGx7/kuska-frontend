import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ClipboardList,
  CircleAlert,
  LayoutGrid,
  LogOut,
  PanelLeft,
  Settings,
  Shield,
  ShoppingBasket,
  Tag,
  Users,
} from 'lucide-react'
import { useSesion } from '../auth/useSesion'
import { iniciales, ROL_ADMIN } from '../auth/usuario'
import Tooltip from '../components/Tooltip'
import { useContadores } from './useContadores'
import './BarraLateral.css'

const CLAVE_CONTRAIDA = 'kumora.menu'

const SECCIONES = [
  { ruta: '/', nombre: 'Inicio', icono: LayoutGrid, end: true },
  { ruta: '/donaciones', nombre: 'Donaciones', icono: ShoppingBasket, contador: 'donaciones' },
  { ruta: '/solicitudes', nombre: 'Solicitudes', icono: ClipboardList, contador: 'solicitudes' },
  { ruta: '/novedades', nombre: 'Novedades', icono: CircleAlert, contador: 'novedades' },
  { ruta: '/usuarios', nombre: 'Usuarios', icono: Users },
  { ruta: '/sanciones', nombre: 'Sanciones', icono: Shield },
  { ruta: '/categorias', nombre: 'Categorías', icono: Tag },
  { ruta: '/configuracion', nombre: 'Configuración', icono: Settings },
]

// La clase activa se calcula aquí y no con la función className de NavLink:
// el Tooltip de Radix (asChild) une los className como texto y rompería la función.
function estaActiva(ruta, end, pathname) {
  if (end) return pathname === ruta
  return pathname === ruta || pathname.startsWith(`${ruta}/`)
}

// Por debajo de 900px empieza contraída siempre; en escritorio, lo guardado.
function contraidaInicial() {
  if (window.matchMedia('(max-width: 899px)').matches) return true
  try {
    return localStorage.getItem(CLAVE_CONTRAIDA) === 'true'
  } catch {
    return false
  }
}

function guardarContraida(valor) {
  try {
    localStorage.setItem(CLAVE_CONTRAIDA, String(valor))
  } catch {
    // Sin persistencia: el estado dura hasta recargar
  }
}

export default function BarraLateral() {
  const { usuario, nombre, cerrarSesion } = useSesion()
  const { contadores } = useContadores()
  const { pathname } = useLocation()
  const [contraida, setContraida] = useState(contraidaInicial)

  function alternar() {
    const siguiente = !contraida
    setContraida(siguiente)
    guardarContraida(siguiente)
  }

  return (
    <aside className={`barra ${contraida ? 'barra--contraida' : ''}`}>
      <div className="barra__cabecera">
        <div className="barra__logo">
          <img src="/favicon.svg" alt="" width="30" height="30" />
          {!contraida && <span>Kumora</span>}
        </div>
        <button
          type="button"
          className="barra__alternar"
          onClick={alternar}
          aria-label={contraida ? 'Expandir menú' : 'Contraer menú'}
          aria-expanded={!contraida}
        >
          <PanelLeft size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      <nav className="barra__nav" aria-label="Secciones">
        <ul>
          {SECCIONES.map(({ ruta, nombre: seccion, icono: Icono, end, contador }) => {
            const cantidad = contador ? contadores[contador] : null
            const hayPendientes = cantidad > 0
            const etiqueta = hayPendientes ? `${seccion}, ${cantidad} pendientes` : seccion

            return (
              <li key={ruta}>
                <Tooltip texto={seccion} lado="right" desactivado={!contraida}>
                  <NavLink
                    to={ruta}
                    end={end}
                    className={
                      estaActiva(ruta, end, pathname)
                        ? 'barra__enlace barra__enlace--activo'
                        : 'barra__enlace'
                    }
                    aria-label={etiqueta}
                  >
                    <span className="barra__icono">
                      <Icono size={20} strokeWidth={1.8} aria-hidden="true" />
                      {contraida && hayPendientes && <span className="barra__punto" />}
                    </span>
                    {!contraida && <span className="barra__texto">{seccion}</span>}
                    {!contraida && hayPendientes && (
                      <span className="barra__contador">{cantidad}</span>
                    )}
                  </NavLink>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="barra__pie">
        <div className="barra__perfil">
          <span className="barra__avatar" aria-hidden="true">
            {iniciales(usuario)}
          </span>
          <div className={contraida ? 'visualmente-oculto' : 'barra__perfil-datos'}>
            <span className="barra__perfil-nombre">{nombre}</span>
            <span className="barra__perfil-rol">{ROL_ADMIN}</span>
          </div>
        </div>

        <Tooltip texto="Cerrar sesión" lado="right" desactivado={!contraida}>
          <button
            type="button"
            className="barra__enlace barra__salir"
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
          >
            <span className="barra__icono">
              <LogOut size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>
            {!contraida && <span className="barra__texto">Cerrar sesión</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}

import { contarPendientes as contarDonacionesPendientes } from '../../api/donaciones'
import { contarPendientes as contarNovedadesPendientes } from '../../api/novedades'
import { listarNotificaciones } from '../../api/notificaciones'
import { obtenerDashboard } from '../../api/resumen'
import { contarSolicitudes, listarSolicitudes } from '../../api/solicitudes'
import { useCarga } from '../../hooks/useCarga'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { hoyLargo } from '../../utils/fechas'
import EntregasRecientes from './EntregasRecientes'
import EsperanRevision from './EsperanRevision'
import FranjaTotales from './FranjaTotales'
import GraficaActividad from './GraficaActividad'
import PorCategoria from './PorCategoria'
import UltimasNotificaciones from './UltimasNotificaciones'
import './Resumen.css'

// Cada bloque carga por separado: si uno falla, solo su sección muestra el error.

async function cargarRevision() {
  const [donaciones, solicitudes, novedades, aprobadas, reclamos] = await Promise.all([
    contarDonacionesPendientes(),
    contarSolicitudes({ estado: 'Pendiente' }),
    contarNovedadesPendientes(),
    contarSolicitudes({ estado: 'Aprobada' }),
    contarSolicitudes({ confirmacion: 'Reclamada' }),
  ])
  return { donaciones, solicitudes, novedades, aprobadas, reclamos }
}

async function cargarEntregas() {
  const { results } = await listarSolicitudes({
    estado: 'Entregada',
    ordering: '-entrega__fecha_entrega',
  })
  return results.slice(0, 5)
}

async function cargarNotificaciones() {
  const { results } = await listarNotificaciones()
  return results.slice(0, 4)
}

export default function Resumen() {
  const revision = useCarga(cargarRevision)
  // Un solo dashboard alimenta la franja, la gráfica y las categorías.
  const dashboard = useCarga(obtenerDashboard)
  const entregas = useCarga(cargarEntregas)
  const notificaciones = useCarga(cargarNotificaciones)

  return (
    <>
      <EncabezadoPagina migas={['Inicio', 'Resumen']} titulo="Resumen" subtitulo={hoyLargo()} />

      <div className="resumen">
        <EsperanRevision carga={revision} />
        <FranjaTotales carga={dashboard} />

        <div className="resumen__fila">
          <GraficaActividad carga={dashboard} />
          <PorCategoria carga={dashboard} />
        </div>

        <div className="resumen__fila">
          <EntregasRecientes carga={entregas} />
          <UltimasNotificaciones carga={notificaciones} />
        </div>
      </div>
    </>
  )
}

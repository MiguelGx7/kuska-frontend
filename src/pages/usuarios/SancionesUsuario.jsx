import { Link } from 'react-router-dom'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Tarjeta from '../../components/Tarjeta'
import { colorEstado } from '../../utils/estados'
import { fechaHora, fechaRelativa } from '../../utils/fechas'
import { historialConComas, historialVacio, ROL_ADMINISTRADOR } from './usuario'

// "1 advertencia, 1 bloqueo temporal. Siguiente sugerida: bloqueo permanente."
function textoResumen(impacto) {
  if (!impacto) return null
  if (historialVacio(impacto.historial)) return 'Su historial está limpio.'
  const siguiente = impacto.sancion_sugerida
    ? `Siguiente sugerida: ${impacto.sancion_sugerida.toLowerCase()}.`
    : 'Ya tiene el nivel máximo.'
  return `${historialConComas(impacto.historial)}. ${siguiente}`
}

// "Pedido relacionado · vigente hasta 20 oct, 6:00 p. m." Las advertencias no tienen vigencia.
function LineaSancion({ sancion }) {
  const relacion = sancion.solicitud
    ? { ruta: `/solicitudes/${sancion.solicitud}`, texto: 'Pedido relacionado' }
    : sancion.donacion
      ? { ruta: `/donaciones/${sancion.donacion}`, texto: 'Donación relacionada' }
      : null

  let vigencia = null
  if (sancion.tipo !== 'Advertencia') {
    if (!sancion.vigente) vigencia = 'ya no vigente'
    else if (sancion.fecha_fin) vigencia = `vigente hasta ${fechaHora(sancion.fecha_fin)}`
    else vigencia = 'vigente'
  }

  if (!relacion && !vigencia) return null
  return (
    <p className="sancion__linea">
      {relacion && <Link to={relacion.ruta}>{relacion.texto}</Link>}
      {relacion && vigencia && ' · '}
      {vigencia}
    </p>
  )
}

export default function SancionesUsuario({ usuario, impacto, datosImpacto, sanciones }) {
  if (usuario.rol === ROL_ADMINISTRADOR) {
    return (
      <Tarjeta titulo="Sanciones">
        <p className="detalle__vacio">Los administradores no se sancionan desde el panel.</p>
      </Tarjeta>
    )
  }

  const lista = sanciones.datos ?? sanciones.previos
  const resumen = textoResumen(datosImpacto)
  const sinNada = lista?.length === 0 && historialVacio(datosImpacto?.historial)

  return (
    <Tarjeta titulo="Sanciones" className="sanciones-usuario">
      {impacto.estado === 'error' && (
        <Aviso
          tipo="error"
          titulo="No pudimos calcular su escala de sanciones"
          accion={
            <Boton variante="secundario" onClick={impacto.reintentar}>
              Reintentar
            </Boton>
          }
        >
          {obtenerMensajeError(impacto.error)}
        </Aviso>
      )}

      {sanciones.estado === 'error' && (
        <Aviso
          tipo="error"
          titulo="No pudimos cargar sus sanciones"
          accion={
            <Boton variante="secundario" onClick={sanciones.reintentar}>
              Reintentar
            </Boton>
          }
        >
          {obtenerMensajeError(sanciones.error)}
        </Aviso>
      )}

      {(!lista || !datosImpacto) && (impacto.estado === 'cargando' || sanciones.estado === 'cargando') && (
        <div className="lista__esqueleto" aria-busy="true">
          <Esqueleto alto={18} ancho="80%" />
          <Esqueleto alto={72} />
          <Esqueleto alto={72} />
        </div>
      )}

      {sinNada && (
        <p className="sanciones-usuario__resumen">
          Sin sanciones. Si cometiera una falta, la primera sugerencia sería una advertencia.
        </p>
      )}

      {!sinNada && resumen && <p className="sanciones-usuario__resumen">{resumen}</p>}

      {lista && lista.length > 0 && (
        <ul className="sanciones">
          {lista.map((s) => (
            <li key={s.id} className="sancion">
              <div className="sancion__cabecera">
                <Badge variante={colorEstado('sancion', s.tipo)}>{s.tipo}</Badge>
                <span className="sancion__fecha">{fechaRelativa(s.fecha_inicio)}</span>
              </div>
              <p className="sancion__motivo">{s.motivo}</p>
              <LineaSancion sancion={s} />
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  )
}

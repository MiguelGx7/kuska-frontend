import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerMensajeError } from '../../api/errores'
import { listarSolicitudes } from '../../api/solicitudes'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Paginacion from '../../components/Paginacion'
import Tarjeta from '../../components/Tarjeta'
import { useCarga } from '../../hooks/useCarga'
import { colorEstado } from '../../utils/estados'
import { fechaRelativa } from '../../utils/fechas'
import { formatearCantidad, formatearNumero } from '../../utils/numeros'

// "Mango · 2 unidades, Manzana · 0,9 kg", sin los cancelados.
function textoDetalles(detalles = []) {
  return detalles
    .filter((d) => !d.cancelado)
    .map((d) => `${d.nombre} · ${formatearCantidad(d.cantidad, d.unidad_medida)}`)
    .join(', ')
}

export default function SolicitudesDonacion({ idDonacion }) {
  const navigate = useNavigate()
  const [pagina, setPagina] = useState(1)

  const cargar = useCallback(
    () => listarSolicitudes({ donacion: idDonacion, page: pagina > 1 ? pagina : undefined }),
    [idDonacion, pagina],
  )
  const carga = useCarga(cargar)
  const datos = carga.datos ?? (carga.estado === 'cargando' ? carga.previos : null)
  const total = datos?.count

  return (
    <Tarjeta
      className="solicitudes-donacion"
      titulo="Solicitudes de esta donación"
      subtitulo="A quién se le donó y en qué va cada pedido"
      accion={
        total != null && (
          <span className="solicitudes-donacion__total">
            {total === 1 ? '1 solicitud' : `${formatearNumero(total)} solicitudes`}
          </span>
        )
      }
    >
      {carga.estado === 'error' && (
        <Aviso
          tipo="error"
          titulo="No pudimos cargar las solicitudes"
          accion={
            <Boton variante="secundario" onClick={carga.reintentar}>
              Reintentar
            </Boton>
          }
        >
          {obtenerMensajeError(carga.error)}
        </Aviso>
      )}

      {!datos && carga.estado === 'cargando' && (
        <div className="lista__esqueleto" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <Esqueleto key={i} alto={48} />
          ))}
        </div>
      )}

      {datos && datos.results.length === 0 && (
        <p className="detalle__vacio">
          Aún nadie ha pedido de esta donación. Cuando un beneficiario la solicite, aparecerá aquí.
        </p>
      )}

      {datos && datos.results.length > 0 && (
        <>
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Beneficiario</th>
                  <th scope="col">Alimentos</th>
                  <th scope="col">Pedido</th>
                  <th scope="col">Estado</th>
                  <th scope="col">
                    <span className="visualmente-oculto">Acción</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.results.map((s) => {
                  const ruta = `/solicitudes/${s.id}`
                  const detener = (e) => e.stopPropagation()
                  return (
                    <tr key={s.id} className="tabla__fila-enlace" onClick={() => navigate(ruta)}>
                      <td>
                        <Link to={ruta} className="tabla__principal" onClick={detener}>
                          {s.beneficiario?.nombre}
                        </Link>
                        {s.beneficiario?.telefono && (
                          <span className="tabla__secundario">{s.beneficiario.telefono}</span>
                        )}
                      </td>
                      <td className="tabla__texto-2">{textoDetalles(s.detalles)}</td>
                      <td>
                        <span className="tabla__sin-salto">{s.codigo_pedido}</span>
                        <span className="tabla__secundario">{fechaRelativa(s.fecha_solicitud)}</span>
                      </td>
                      <td>
                        <Badge variante={colorEstado('solicitud', s.estado)}>{s.estado}</Badge>
                      </td>
                      <td className="tabla__accion">
                        <Boton variante="enlace" to={ruta} onClick={detener}>
                          Ver
                        </Boton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Paginacion
            pagina={pagina}
            total={datos.count}
            cantidad={datos.results.length}
            hayAnterior={Boolean(datos.previous)}
            haySiguiente={Boolean(datos.next)}
            alCambiar={setPagina}
          />
        </>
      )}
    </Tarjeta>
  )
}

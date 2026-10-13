import { useCallback, useId } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerMensajeError } from '../../api/errores'
import { contarSolicitudes, listarSolicitudes } from '../../api/solicitudes'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Buscador from '../../components/Buscador'
import Esqueleto from '../../components/Esqueleto'
import HormigaVacia from '../../components/HormigaVacia'
import Paginacion from '../../components/Paginacion'
import Pestanas from '../../components/Pestanas'
import Tarjeta from '../../components/Tarjeta'
import { useCarga } from '../../hooks/useCarga'
import { paramsDePestana, useFiltrosUrl } from '../../hooks/useFiltrosUrl'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { colorEstado } from '../../utils/estados'
import { esHoy, fechaHora, fechaRelativa } from '../../utils/fechas'
import {
  accionDeFila,
  alimentosPedidos,
  confirmacionDe,
  etiquetaLimite,
  TEXTO_CONFIRMACION,
  textoAlimentos,
} from './solicitud'
import './Solicitudes.css'

// La primera es la pestaña por defecto. Reclamos filtra por la confirmación de la entrega;
// "Todas" lleva un marcador en la URL y no filtra en la API.
const PESTANAS = [
  { valor: 'Pendiente', nombre: 'Pendientes', url: { estado: 'Pendiente' } },
  { valor: 'Aprobada', nombre: 'Aprobadas', url: { estado: 'Aprobada' } },
  { valor: 'Reclamos', nombre: 'Reclamos', url: { confirmacion: 'Reclamada' } },
  { valor: 'Entregada', nombre: 'Entregadas', url: { estado: 'Entregada' } },
  { valor: 'NoRecogida', nombre: 'No recogidas', url: { estado: 'No recogida' } },
  { valor: 'Rechazada', nombre: 'Rechazadas', url: { estado: 'Rechazada' } },
  { valor: 'Cancelada', nombre: 'Canceladas', url: { estado: 'Cancelada' } },
  { valor: 'Todas', nombre: 'Todas', url: { estado: 'Todas' }, api: {} },
]

// Contadores de las pestañas (sin la búsqueda). Si uno falla, esa pestaña queda sin número.
async function cargarContadores() {
  const resultados = await Promise.allSettled(
    PESTANAS.map((p) => contarSolicitudes(paramsDePestana(p))),
  )
  return Object.fromEntries(
    PESTANAS.map(({ valor }, i) => [
      valor,
      resultados[i].status === 'fulfilled' ? resultados[i].value : null,
    ]),
  )
}

function textoVacio(pestana, busqueda) {
  if (busqueda) {
    return {
      titulo: 'Ninguna solicitud coincide',
      texto: 'Prueba con el código del pedido, o con el correo o documento del beneficiario.',
    }
  }
  if (pestana === 'Reclamos') {
    return {
      titulo: 'No hay reclamos por responder',
      texto: 'Cuando un beneficiario reporte que no recibió su pedido, aparecerá aquí.',
    }
  }
  if (pestana === 'Pendiente') {
    return {
      titulo: 'No hay solicitudes por aprobar',
      texto: 'Cuando un beneficiario envíe su carrito, sus solicitudes aparecerán aquí.',
    }
  }
  return {
    titulo: 'No hay solicitudes en este estado',
    texto: 'Cambia de pestaña para ver las demás.',
  }
}

// La columna de fecha cambia según la pestaña.
const ENCABEZADO_FECHA = { Pendiente: 'Enviada', Aprobada: 'Fecha límite' }

function CeldaFecha({ solicitud, pestana }) {
  if (pestana === 'Aprobada') {
    const limite = solicitud.fecha_limite_recogida
    if (!limite) return <td className="tabla__texto-2">—</td>
    return (
      <td className="tabla__sin-salto">
        <span className="tabla__secundario">{etiquetaLimite(solicitud)}</span>
        <span className={esHoy(limite) ? 'solicitudes__vence-hoy' : 'tabla__texto-2'}>
          {fechaHora(limite)}
        </span>
      </td>
    )
  }
  return (
    <td className="tabla__texto-2 tabla__sin-salto">{fechaRelativa(solicitud.fecha_solicitud)}</td>
  )
}

export default function ListaSolicitudes() {
  const navigate = useNavigate()
  const idPestanas = useId()

  // Pestaña, búsqueda y página viven en la URL.
  const filtros = useFiltrosUrl(PESTANAS)
  const { busqueda, pagina, texto, setTexto, cambiarPagina } = filtros
  const pestana = filtros.pestana.valor

  const contadores = useCarga(cargarContadores)

  // La clave en texto mantiene estable la función mientras los filtros no cambien.
  const claveFiltros = JSON.stringify(filtros.paramsApi)
  const cargarLista = useCallback(() => listarSolicitudes(JSON.parse(claveFiltros)), [claveFiltros])
  const lista = useCarga(cargarLista)

  // Mientras llega una página nueva se deja la anterior atenuada en vez de vaciar la tabla.
  const previosConFilas = lista.previos?.results.length ? lista.previos : null
  const datos = lista.datos ?? (lista.estado === 'cargando' ? previosConFilas : null)
  const recargando = lista.estado === 'cargando' && Boolean(datos)

  const opciones = PESTANAS.map((p) => ({ ...p, contador: contadores.datos?.[p.valor] }))
  const vacio = textoVacio(pestana, busqueda)

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Solicitudes']}
        titulo="Solicitudes"
        subtitulo="Aprueba pedidos y registra las entregas."
      />

      <Tarjeta className="lista">
        <Pestanas
          opciones={opciones}
          valor={pestana}
          alCambiar={filtros.cambiarPestana}
          etiqueta="Estado de las solicitudes"
          idBase={idPestanas}
        />

        <div
          role="tabpanel"
          id={`${idPestanas}-panel`}
          aria-labelledby={`${idPestanas}-pestana-${pestana}`}
          className="lista__panel"
        >
          <Buscador
            className="lista__buscador"
            valor={texto}
            alCambiar={setTexto}
            placeholder="Buscar por código, correo o documento del beneficiario"
            etiqueta="Buscar solicitudes"
          />

          {lista.estado === 'error' && (
            <Aviso
              tipo="error"
              titulo="No pudimos cargar las solicitudes"
              accion={
                <Boton variante="secundario" onClick={lista.reintentar}>
                  Reintentar
                </Boton>
              }
            >
              {obtenerMensajeError(lista.error)}
            </Aviso>
          )}

          {lista.estado === 'cargando' && !datos && (
            <div className="lista__esqueleto" aria-busy="true">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Esqueleto key={i} alto={52} />
              ))}
            </div>
          )}

          {datos && datos.results.length === 0 && !recargando && (
            <HormigaVacia titulo={vacio.titulo} texto={vacio.texto} />
          )}

          {datos && datos.results.length > 0 && (
            <div
              className={`tabla-contenedor ${recargando ? 'lista__recargando' : ''}`}
              aria-busy={recargando || undefined}
            >
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Pedido</th>
                    <th scope="col">Beneficiario</th>
                    <th scope="col">Entrega</th>
                    <th scope="col">{ENCABEZADO_FECHA[pestana] ?? 'Fecha'}</th>
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
                    const confirmacion = confirmacionDe(s)
                    const accion = accionDeFila(s)
                    return (
                      // Toda la fila es clicable; el enlace del código la hace accesible con teclado.
                      <tr key={s.id} className="tabla__fila-enlace" onClick={() => navigate(ruta)}>
                        <td>
                          <Link to={ruta} className="tabla__principal" onClick={detener}>
                            {s.codigo_pedido}
                          </Link>
                          <span className="tabla__secundario">
                            {s.donacion_titulo} · {textoAlimentos(alimentosPedidos(s).length)}
                          </span>
                        </td>
                        <td>
                          <span className="tabla__bloque">{s.beneficiario?.nombre}</span>
                          <span className="tabla__secundario">{s.beneficiario?.correo}</span>
                        </td>
                        <td className="tabla__texto-2">{s.modalidad_entrega}</td>
                        <CeldaFecha solicitud={s} pestana={pestana} />
                        <td>
                          <Badge variante={colorEstado('solicitud', s.estado)}>{s.estado}</Badge>
                          {s.entrega && confirmacion && (
                            <span
                              className={`solicitudes__confirmacion ${
                                confirmacion === 'Reclamada' ? 'solicitudes__confirmacion--reclamo' : ''
                              }`}
                            >
                              {TEXTO_CONFIRMACION[confirmacion] ?? confirmacion}
                            </span>
                          )}
                        </td>
                        <td className="tabla__accion">
                          {accion.destacada ? (
                            <Boton variante="secundario" tamano="pequeno" to={ruta} onClick={detener}>
                              {accion.texto}
                            </Boton>
                          ) : (
                            <Boton variante="enlace" to={ruta} onClick={detener}>
                              {accion.texto}
                            </Boton>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {datos && datos.results.length > 0 && (
            <Paginacion
              pagina={pagina}
              total={datos.count}
              cantidad={datos.results.length}
              hayAnterior={Boolean(datos.previous)}
              haySiguiente={Boolean(datos.next)}
              alCambiar={cambiarPagina}
            />
          )}
        </div>
      </Tarjeta>
    </>
  )
}

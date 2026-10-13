import { useCallback, useId, useState } from 'react'
import { CheckCheck } from 'lucide-react'
import { obtenerMensajeError } from '../../api/errores'
import { listarNotificaciones, marcarLeida, marcarTodasLeidas } from '../../api/notificaciones'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import HormigaVacia from '../../components/HormigaVacia'
import Paginacion from '../../components/Paginacion'
import Pestanas from '../../components/Pestanas'
import Selector from '../../components/Selector'
import Tarjeta from '../../components/Tarjeta'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import { useFiltrosUrl } from '../../hooks/useFiltrosUrl'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { useContadores } from '../../layout/useContadores'
import ItemNotificacion from './ItemNotificacion'
import {
  agruparPorFecha,
  OPCIONES_TIPO,
  subtituloNoLeidas,
  textoVacio,
  toastMarcadas,
} from './notificacion'
import './Notificaciones.css'

// "Todas" es la pestaña por defecto (sin parámetro en la URL); "Sin leer" va con ?leida=false.
const PESTANAS = [
  { valor: 'todas', nombre: 'Todas', url: {} },
  { valor: 'sinLeer', nombre: 'Sin leer', url: { leida: 'false' } },
]

// Número de la pestaña "Todas": el total sin filtros. Marcar como leída no lo cambia.
async function cargarTotal() {
  const { count } = await listarNotificaciones({})
  return count
}

export default function Notificaciones() {
  const idPestanas = useId()
  const mostrarToast = useToast()
  const { contadores, recargarContadores, fijarNoLeidas } = useContadores()
  const noLeidas = contadores.noLeidas

  // Pestaña, tipo y página viven en la URL.
  const filtros = useFiltrosUrl(PESTANAS, { extras: ['tipo'] })
  const pestana = filtros.pestana.valor
  const { tipo } = filtros.valores

  const total = useCarga(cargarTotal)

  // Cada respuesta trae no_leidas (del usuario, sin importar filtros): se pasa a la campana.
  const claveFiltros = JSON.stringify(filtros.paramsApi)
  const cargarLista = useCallback(async () => {
    const datos = await listarNotificaciones(JSON.parse(claveFiltros))
    fijarNoLeidas(datos.no_leidas)
    return datos
  }, [claveFiltros, fijarNoLeidas])
  const lista = useCarga(cargarLista)

  const previosConFilas = lista.previos?.results.length ? lista.previos : null
  const datos = lista.datos ?? (lista.estado === 'cargando' ? previosConFilas : null)
  const recargando = lista.estado === 'cargando' && Boolean(datos)

  // Ids marcados como leídos en esta pantalla: se aplican sobre lo que llegó sin recargar.
  const [leidas, setLeidas] = useState(() => new Set())
  const [marcandoTodas, setMarcandoTodas] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null)

  const items = (datos?.results ?? []).map((n) => (leidas.has(n.id) ? { ...n, leida: true } : n))
  const grupos = agruparPorFecha(items)

  // En "Sin leer", si ya no queda ninguna se ve el vacío aunque las filas sigan cargadas.
  const vacia =
    Boolean(datos) && !recargando && (items.length === 0 || (pestana === 'sinLeer' && noLeidas === 0))
  const vacio = textoVacio(pestana, tipo)

  function quitarLeida(id) {
    setLeidas((actuales) => {
      const nuevas = new Set(actuales)
      nuevas.delete(id)
      return nuevas
    })
  }

  // Se marca al instante y se avisa al servidor; si falla, vuelve a quedar sin leer.
  // alSalir: viene del enlace y la página se desmonta. Al terminar se recarga la campana,
  // porque la nueva ruta pudo contarlas antes de que el servidor la marcara.
  function marcar(notificacion, { alSalir = false } = {}) {
    if (notificacion.leida) return
    setErrorAccion(null)
    setLeidas((actuales) => new Set(actuales).add(notificacion.id))
    fijarNoLeidas((actual) => (actual == null ? actual : Math.max(0, actual - 1)))

    marcarLeida(notificacion.id)
      .then(() => {
        if (alSalir) recargarContadores()
      })
      .catch((error) => {
        quitarLeida(notificacion.id)
        recargarContadores()
        setErrorAccion({ titulo: 'No pudimos marcarla como leída', error })
      })
  }

  async function marcarTodas() {
    setErrorAccion(null)
    setMarcandoTodas(true)
    try {
      const { marcadas, no_leidas } = await marcarTodasLeidas()
      setLeidas((actuales) => new Set([...actuales, ...items.map((n) => n.id)]))
      fijarNoLeidas(no_leidas)
      mostrarToast(toastMarcadas(marcadas))
    } catch (error) {
      setErrorAccion({ titulo: 'No pudimos marcarlas como leídas', error })
    } finally {
      setMarcandoTodas(false)
    }
  }

  const opciones = PESTANAS.map((p) => ({
    ...p,
    contador: p.valor === 'todas' ? total.datos : noLeidas,
  }))

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Notificaciones']}
        titulo="Notificaciones"
        subtitulo={subtituloNoLeidas(noLeidas)}
      >
        <Boton
          variante="secundario"
          icono={CheckCheck}
          disabled={!noLeidas}
          cargando={marcandoTodas}
          onClick={marcarTodas}
        >
          Marcar todas como leídas
        </Boton>
      </EncabezadoPagina>

      <Tarjeta className="lista notificaciones">
        <div className="notificaciones__barra">
          <Pestanas
            opciones={opciones}
            valor={pestana}
            alCambiar={filtros.cambiarPestana}
            etiqueta="Notificaciones por estado"
            idBase={idPestanas}
          />
          <Selector
            className="notificaciones__tipo"
            etiquetaOculta="Tipo de notificación"
            opciones={OPCIONES_TIPO}
            valor={tipo}
            alCambiar={(valor) => filtros.cambiarFiltro('tipo', valor)}
          />
        </div>

        <div
          role="tabpanel"
          id={`${idPestanas}-panel`}
          aria-labelledby={`${idPestanas}-pestana-${pestana}`}
          className="lista__panel"
        >
          {errorAccion && (
            <Aviso tipo="error" titulo={errorAccion.titulo}>
              {obtenerMensajeError(errorAccion.error)}
            </Aviso>
          )}

          {lista.estado === 'error' && (
            <Aviso
              tipo="error"
              titulo="No pudimos cargar las notificaciones"
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
            <div className="notificaciones__esqueleto" aria-busy="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="notificaciones__esqueleto-fila">
                  <Esqueleto alto={36} ancho={36} radio="10px" />
                  <div className="notificaciones__esqueleto-textos">
                    <Esqueleto alto={14} ancho="45%" />
                    <Esqueleto alto={14} ancho="85%" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {vacia && <HormigaVacia titulo={vacio.titulo} texto={vacio.texto} />}

          {datos && !vacia && (
            <div
              className={`notificaciones__grupos ${recargando ? 'lista__recargando' : ''}`}
              aria-busy={recargando || undefined}
            >
              {grupos.map((grupo) => (
                <section key={grupo.titulo} className="notificaciones__grupo">
                  <h2 className="notificaciones__rotulo">{grupo.titulo}</h2>
                  <ul className="notificaciones__items">
                    {grupo.items.map((n) => (
                      <ItemNotificacion
                        key={n.id}
                        notificacion={n}
                        grupo={grupo.titulo}
                        alMarcar={marcar}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {datos && !vacia && (
            <Paginacion
              pagina={filtros.pagina}
              total={datos.count}
              cantidad={datos.results.length}
              hayAnterior={Boolean(datos.previous)}
              haySiguiente={Boolean(datos.next)}
              alCambiar={filtros.cambiarPagina}
            />
          )}
        </div>
      </Tarjeta>
    </>
  )
}

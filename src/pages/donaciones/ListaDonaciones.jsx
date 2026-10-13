import { useCallback, useEffect, useId, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { contarDonaciones, listarDonaciones } from '../../api/donaciones'
import { obtenerMensajeError } from '../../api/errores'
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
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { colorEstado } from '../../utils/estados'
import { fechaRelativa } from '../../utils/fechas'
import { alimentosActivos, fotoPrincipal, MODALIDAD_CORTA, textoAlimentos } from './donacion'
import './Donaciones.css'

const ESTADOS = [
  { valor: 'Pendiente', nombre: 'Pendientes' },
  { valor: 'Validada', nombre: 'Validadas' },
  { valor: 'Rechazada', nombre: 'Rechazadas' },
  { valor: 'Agotada', nombre: 'Agotadas' },
  { valor: 'Finalizada', nombre: 'Finalizadas' },
  { valor: 'Todas', nombre: 'Todas' },
]
const ESPERA_BUSQUEDA_MS = 300

// Contadores de las pestañas (sin la búsqueda). Si uno falla, esa pestaña queda sin número.
async function cargarContadores() {
  const resultados = await Promise.allSettled(
    ESTADOS.map(({ valor }) => contarDonaciones(valor === 'Todas' ? {} : { estado: valor })),
  )
  return Object.fromEntries(
    ESTADOS.map(({ valor }, i) => [
      valor,
      resultados[i].status === 'fulfilled' ? resultados[i].value : null,
    ]),
  )
}

function textoVacio(estado, busqueda) {
  if (busqueda) {
    return {
      titulo: 'Ninguna donación coincide',
      texto: 'Prueba con otro título o con el nombre del donante.',
    }
  }
  if (estado === 'Pendiente') {
    return {
      titulo: 'No hay donaciones por validar',
      texto: 'Cuando un donante registre una, aparecerá aquí.',
    }
  }
  return {
    titulo: 'No hay donaciones en este estado',
    texto: 'Cambia de pestaña para ver las demás.',
  }
}

export default function ListaDonaciones() {
  const navigate = useNavigate()
  const idPestanas = useId()

  // La URL es la fuente de verdad: así funcionan los enlaces del Resumen y el botón atrás.
  const [params, setParams] = useSearchParams()
  const estadoUrl = params.get('estado')
  const estado = ESTADOS.some((e) => e.valor === estadoUrl) ? estadoUrl : 'Pendiente'
  const busqueda = params.get('search') ?? ''
  const pagina = Math.max(1, Number(params.get('page')) || 1)

  // Texto del buscador: se escribe al instante y llega a la URL tras 300 ms.
  const [texto, setTexto] = useState(busqueda)
  const [busquedaPrevia, setBusquedaPrevia] = useState(busqueda)
  if (busqueda !== busquedaPrevia) {
    // La URL cambió desde fuera (atrás/adelante): el buscador la sigue.
    setBusquedaPrevia(busqueda)
    setTexto(busqueda)
  }

  useEffect(() => {
    const limpio = texto.trim()
    if (limpio === busqueda) return
    const temporizador = setTimeout(() => {
      setParams(
        (actuales) => {
          const nuevos = new URLSearchParams(actuales)
          if (limpio) nuevos.set('search', limpio)
          else nuevos.delete('search')
          nuevos.delete('page')
          return nuevos
        },
        // Reemplaza: el botón atrás no recorre cada letra escrita.
        { replace: true },
      )
    }, ESPERA_BUSQUEDA_MS)
    return () => clearTimeout(temporizador)
  }, [texto, busqueda, setParams])

  function cambiarEstado(valor) {
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)
      nuevos.set('estado', valor)
      nuevos.delete('page')
      return nuevos
    })
  }

  function cambiarPagina(nueva) {
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)
      if (nueva > 1) nuevos.set('page', String(nueva))
      else nuevos.delete('page')
      return nuevos
    })
  }

  const contadores = useCarga(cargarContadores)

  const cargarLista = useCallback(
    () =>
      listarDonaciones({
        estado: estado === 'Todas' ? undefined : estado,
        search: busqueda || undefined,
        page: pagina > 1 ? pagina : undefined,
      }),
    [estado, busqueda, pagina],
  )
  const lista = useCarga(cargarLista)

  // Mientras llega una página nueva se deja la anterior atenuada en vez de vaciar la tabla.
  const previosConFilas = lista.previos?.results.length ? lista.previos : null
  const datos = lista.datos ?? (lista.estado === 'cargando' ? previosConFilas : null)
  const recargando = lista.estado === 'cargando' && Boolean(datos)

  const opciones = ESTADOS.map((e) => ({ ...e, contador: contadores.datos?.[e.valor] }))
  const vacio = textoVacio(estado, busqueda)

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Donaciones']}
        titulo="Donaciones"
        subtitulo="Revisa las fotos y valida lo que es comida en buen estado."
      />

      <Tarjeta className="donaciones">
        <Pestanas
          opciones={opciones}
          valor={estado}
          alCambiar={cambiarEstado}
          etiqueta="Estado de las donaciones"
          idBase={idPestanas}
        />

        <div
          role="tabpanel"
          id={`${idPestanas}-panel`}
          aria-labelledby={`${idPestanas}-pestana-${estado}`}
          className="donaciones__panel"
        >
          <Buscador
            className="donaciones__buscador"
            valor={texto}
            alCambiar={setTexto}
            placeholder="Buscar por título o donante"
            etiqueta="Buscar donaciones"
          />

          {lista.estado === 'error' && (
            <Aviso
              tipo="error"
              titulo="No pudimos cargar las donaciones"
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
            <div className="donaciones__esqueleto" aria-busy="true">
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
              className={`tabla-contenedor ${recargando ? 'donaciones__recargando' : ''}`}
              aria-busy={recargando || undefined}
            >
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Donación</th>
                    <th scope="col">Donante</th>
                    <th scope="col">Recibida</th>
                    <th scope="col">Estado</th>
                    <th scope="col">
                      <span className="visualmente-oculto">Acción</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datos.results.map((d) => {
                    const ruta = `/donaciones/${d.id}`
                    const foto = fotoPrincipal(d)
                    const detener = (e) => e.stopPropagation()
                    return (
                      // Toda la fila es clicable; el enlace del título la hace accesible con teclado.
                      <tr key={d.id} className="tabla__fila-enlace" onClick={() => navigate(ruta)}>
                        <td>
                          <div className="donaciones__celda-donacion">
                            {foto ? (
                              <img className="miniatura" src={foto} alt="" loading="lazy" />
                            ) : (
                              <span className="miniatura miniatura--vacia">
                                <ImageOff size={18} aria-hidden="true" />
                              </span>
                            )}
                            <div className="donaciones__textos">
                              <Link to={ruta} className="tabla__principal" onClick={detener}>
                                {d.titulo}
                              </Link>
                              <span className="tabla__secundario">
                                {textoAlimentos(alimentosActivos(d).length)} ·{' '}
                                {MODALIDAD_CORTA[d.modalidad_entrega] ?? d.modalidad_entrega}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="donaciones__donante">{d.donante?.nombre}</span>
                          {d.donante?.tipo_donante && (
                            <span className="tabla__secundario">{d.donante.tipo_donante}</span>
                          )}
                        </td>
                        <td className="tabla__texto-2 tabla__sin-salto">
                          {fechaRelativa(d.fecha_registro)}
                        </td>
                        <td>
                          <Badge variante={colorEstado('donacion', d.estado)}>{d.estado}</Badge>
                        </td>
                        <td className="tabla__accion">
                          {d.estado === 'Pendiente' ? (
                            <Boton variante="secundario" tamano="pequeno" to={ruta} onClick={detener}>
                              Revisar
                            </Boton>
                          ) : (
                            <Boton variante="enlace" to={ruta} onClick={detener}>
                              Ver
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

import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { obtenerMensajeError } from '../../api/errores'
import { listarSanciones } from '../../api/sanciones'
import { listarUsuarios } from '../../api/usuarios'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import BarraFiltros from '../../components/BarraFiltros'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import HormigaVacia from '../../components/HormigaVacia'
import Paginacion from '../../components/Paginacion'
import Tarjeta from '../../components/Tarjeta'
import { useCarga } from '../../hooks/useCarga'
import { useFiltrosUrl } from '../../hooks/useFiltrosUrl'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { colorEstado } from '../../utils/estados'
import { fechaHora, fechaRelativa } from '../../utils/fechas'
import { formatearNumero } from '../../utils/numeros'
import './Sanciones.css'

// Sin pestañas: los filtros van en selects.
const SIN_PESTANAS = [{ valor: 'todas', nombre: 'Todas', url: {} }]

const TIPOS = [
  { valor: '', texto: 'Todos los tipos' },
  { valor: 'Advertencia', texto: 'Advertencias' },
  { valor: 'Bloqueo temporal', texto: 'Bloqueos temporales' },
  { valor: 'Bloqueo permanente', texto: 'Bloqueos permanentes' },
]

const VIGENCIAS = [
  { valor: '', texto: 'Vigentes y no vigentes' },
  { valor: 'true', texto: 'Solo vigentes' },
  { valor: 'false', texto: 'Solo no vigentes' },
]

// Resumen de arriba. Si un número falla, esa tarjeta muestra "—".
async function cargarResumen() {
  const [bloqueados, advertencias, total] = await Promise.allSettled([
    listarUsuarios({ estado: 'Bloqueado' }),
    listarSanciones({ tipo: 'Advertencia' }),
    listarSanciones({}),
  ])
  const contar = (r) => (r.status === 'fulfilled' ? r.value.count : null)
  return { bloqueados: contar(bloqueados), advertencias: contar(advertencias), total: contar(total) }
}

const TARJETAS_RESUMEN = [
  { clave: 'bloqueados', etiqueta: 'Usuarios bloqueados ahora' },
  { clave: 'advertencias', etiqueta: 'Advertencias' },
  { clave: 'total', etiqueta: 'Sanciones en total' },
]

// "el 20 oct, 6:00 p. m." o "hoy, 6:00 p. m." (sin "el").
function conArticulo(iso) {
  const texto = fechaHora(iso)
  return texto.startsWith('hoy') ? texto : `el ${texto}`
}

function Vigencia({ sancion }) {
  if (sancion.tipo === 'Advertencia') {
    return <span className="vigencia">Cuenta para la escala</span>
  }
  if (sancion.vigente) {
    return (
      <span className="vigencia vigencia--activa">
        {sancion.tipo === 'Bloqueo permanente' || !sancion.fecha_fin
          ? 'Definitivo'
          : `Vigente hasta ${conArticulo(sancion.fecha_fin)}`}
      </span>
    )
  }
  return (
    <span className="vigencia">
      {sancion.fecha_fin ? `Terminó ${conArticulo(sancion.fecha_fin)}` : 'Ya no vigente'}
    </span>
  )
}

function Relacion({ sancion }) {
  if (sancion.solicitud) {
    return (
      <Link className="sanciones__relacion" to={`/solicitudes/${sancion.solicitud}`}>
        Pedido relacionado
      </Link>
    )
  }
  if (sancion.donacion) {
    return (
      <Link className="sanciones__relacion" to={`/donaciones/${sancion.donacion}`}>
        Donación relacionada
      </Link>
    )
  }
  return null
}

export default function Sanciones() {
  // Búsqueda, tipo, vigencia y página viven en la URL.
  const filtros = useFiltrosUrl(SIN_PESTANAS, { extras: ['tipo', 'vigente'] })
  const { texto, setTexto, busqueda, pagina, cambiarPagina, valores, cambiarFiltro } = filtros
  const hayFiltros = Boolean(busqueda || valores.tipo || valores.vigente)

  const resumen = useCarga(cargarResumen)

  const claveFiltros = JSON.stringify(filtros.paramsApi)
  const cargarLista = useCallback(() => listarSanciones(JSON.parse(claveFiltros)), [claveFiltros])
  const lista = useCarga(cargarLista)

  const previosConFilas = lista.previos?.results.length ? lista.previos : null
  const datos = lista.datos ?? (lista.estado === 'cargando' ? previosConFilas : null)
  const recargando = lista.estado === 'cargando' && Boolean(datos)

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Sanciones']}
        titulo="Sanciones"
        subtitulo="Historial de todas las sanciones. Para sancionar, abre el usuario desde Usuarios."
      />

      <div className="sanciones__resumen" aria-busy={resumen.estado === 'cargando'}>
        {TARJETAS_RESUMEN.map(({ clave, etiqueta }) => (
          <Tarjeta key={clave} className="sanciones__cifra">
            <p className="sanciones__etiqueta">{etiqueta}</p>
            {resumen.estado === 'cargando' ? (
              <Esqueleto alto={32} ancho={64} />
            ) : (
              <p className="sanciones__numero">
                {resumen.datos?.[clave] != null ? formatearNumero(resumen.datos[clave]) : '—'}
              </p>
            )}
          </Tarjeta>
        ))}
      </div>

      <Tarjeta className="lista lista--sin-pestanas">
        <div className="lista__panel">
          <BarraFiltros
            busqueda={{
              valor: texto,
              alCambiar: setTexto,
              placeholder: 'Buscar por motivo o correo',
              etiqueta: 'Buscar sanciones',
            }}
            filtros={[
              {
                clave: 'tipo',
                etiqueta: 'Tipo',
                opciones: TIPOS,
                valor: valores.tipo,
                alCambiar: (v) => cambiarFiltro('tipo', v),
              },
              {
                clave: 'vigente',
                etiqueta: 'Vigencia',
                opciones: VIGENCIAS,
                valor: valores.vigente,
                alCambiar: (v) => cambiarFiltro('vigente', v),
              },
            ]}
          />

          {lista.estado === 'error' && (
            <Aviso
              tipo="error"
              titulo="No pudimos cargar las sanciones"
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
                <Esqueleto key={i} alto={56} />
              ))}
            </div>
          )}

          {datos && datos.results.length === 0 && !recargando && (
            <HormigaVacia
              titulo={hayFiltros ? 'Ninguna sanción coincide' : 'Todavía no hay sanciones'}
              texto={
                hayFiltros
                  ? 'Prueba con otro motivo o correo, o cambia los filtros.'
                  : 'Cuando sanciones a alguien desde Usuarios, aparecerá aquí.'
              }
            />
          )}

          {datos && datos.results.length > 0 && (
            <div
              className={`tabla-contenedor ${recargando ? 'lista__recargando' : ''}`}
              aria-busy={recargando || undefined}
            >
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Usuario</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Motivo</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Vigencia</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.results.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <Link to={`/usuarios/${s.usuario?.id}`} className="tabla__principal">
                          {s.usuario?.nombre}
                        </Link>
                        <span className="tabla__secundario">
                          {[s.usuario?.rol, s.usuario?.correo].filter(Boolean).join(' · ')}
                        </span>
                      </td>
                      <td>
                        <Badge variante={colorEstado('sancion', s.tipo)}>{s.tipo}</Badge>
                      </td>
                      <td className="sanciones__motivo">
                        <span className="tabla__bloque">{s.motivo}</span>
                        <Relacion sancion={s} />
                      </td>
                      <td className="tabla__texto-2 tabla__sin-salto">
                        {fechaRelativa(s.fecha_inicio)}
                      </td>
                      <td>
                        <Vigencia sancion={s} />
                        {s.creada_por && (
                          <span className="tabla__secundario">por {s.creada_por}</span>
                        )}
                      </td>
                    </tr>
                  ))}
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

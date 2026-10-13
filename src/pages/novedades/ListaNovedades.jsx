import Badge from '../../components/Badge'
import Esqueleto from '../../components/Esqueleto'
import Paginacion from '../../components/Paginacion'
import { colorEstado } from '../../utils/estados'
import { fechaRelativa } from '../../utils/fechas'
import { textoSobre } from './novedad'

export default function ListaNovedades({
  carga,
  datos,
  idSeleccionado,
  alSeleccionar,
  pagina,
  alCambiarPagina,
}) {
  const recargando = carga.estado === 'cargando' && Boolean(datos)
  const hayPaginas = Boolean(datos?.next || datos?.previous)

  return (
    <section className="bandeja__lista tarjeta" aria-label="Lista de novedades">
      {!datos && (
        <div className="novedades__esqueleto" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <Esqueleto key={i} alto={104} radio="var(--r-control)" />
          ))}
        </div>
      )}

      {datos && (
        <ul
          className={`novedades__items ${recargando ? 'lista__recargando' : ''}`}
          aria-busy={recargando || undefined}
        >
          {datos.results.map((n) => {
            const seleccionada = String(n.id) === idSeleccionado
            return (
              <li key={n.id}>
                <button
                  type="button"
                  className="novedad-item"
                  aria-pressed={seleccionada}
                  onClick={() => alSeleccionar(n.id)}
                >
                  <span className="novedad-item__fila">
                    <Badge variante={colorEstado('novedad', n.estado)}>{n.estado}</Badge>
                    <span className="novedad-item__fecha">{fechaRelativa(n.fecha_creacion)}</span>
                  </span>
                  <span className="novedad-item__sobre">{textoSobre(n)}</span>
                  <span className="novedad-item__donacion">
                    {n.donacion_titulo} · {n.donante?.nombre}
                  </span>
                  <span className="novedad-item__descripcion">{n.descripcion}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {datos && hayPaginas && (
        <Paginacion
          pagina={pagina}
          total={datos.count}
          cantidad={datos.results.length}
          hayAnterior={Boolean(datos.previous)}
          haySiguiente={Boolean(datos.next)}
          alCambiar={alCambiarPagina}
        />
      )}
    </section>
  )
}

import Esqueleto from '../../components/Esqueleto'
import Tarjeta from '../../components/Tarjeta'
import { formatearNumero } from '../../utils/numeros'
import ErrorSeccion from './ErrorSeccion'

function porcentaje(valor, maximo) {
  return `${(valor / maximo) * 100}%`
}

export default function PorCategoria({ carga }) {
  const { estado, datos } = carga

  const categorias = [...(datos?.por_categoria ?? [])].sort(
    (a, b) => b.alimentos_donados - a.alimentos_donados,
  )
  const maximo = Math.max(1, ...categorias.map((c) => c.alimentos_donados))

  return (
    <Tarjeta
      className="resumen-categorias"
      titulo="Por categoría"
      subtitulo="Alimentos entregados de los donados"
    >
      {estado === 'error' && <ErrorSeccion carga={carga} />}

      {estado === 'cargando' && (
        <div className="resumen-categorias__lista" aria-busy="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="resumen-categorias__item">
              <Esqueleto alto={14} ancho="70%" />
              <Esqueleto alto={8} />
            </div>
          ))}
        </div>
      )}

      {estado === 'listo' && (
        <>
          <ul className="leyenda">
            <li>
              <span className="grafica__rayita" style={{ background: 'var(--serie-1)' }} />
              Donados
            </li>
            <li>
              <span className="grafica__rayita" style={{ background: 'var(--primary)' }} />
              Entregados
            </li>
          </ul>

          {categorias.length === 0 ? (
            <p className="resumen__vacio">Todavía no hay alimentos donados.</p>
          ) : (
            <ul className="resumen-categorias__lista">
              {categorias.map((c) => (
                <li key={c.categoria_id ?? c.categoria} className="resumen-categorias__item">
                  <div className="resumen-categorias__fila">
                    <span className="resumen-categorias__nombre">{c.categoria}</span>
                    <span className="resumen-categorias__valor">
                      {formatearNumero(c.alimentos_entregados)} de{' '}
                      {formatearNumero(c.alimentos_donados)}
                    </span>
                  </div>
                  <div className="resumen-categorias__barra" aria-hidden="true">
                    <span
                      className="resumen-categorias__donados"
                      style={{ width: porcentaje(c.alimentos_donados, maximo) }}
                    />
                    <span
                      className="resumen-categorias__entregados"
                      style={{ width: porcentaje(c.alimentos_entregados, maximo) }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Tarjeta>
  )
}

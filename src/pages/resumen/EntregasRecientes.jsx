import { Link, useNavigate } from 'react-router-dom'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Tarjeta from '../../components/Tarjeta'
import { fechaRelativa } from '../../utils/fechas'
import ErrorSeccion from './ErrorSeccion'

function textoAlimentos(detalles = []) {
  const n = detalles.filter((d) => !d.cancelado).length
  return n === 1 ? '1 alimento' : `${n} alimentos`
}

export default function EntregasRecientes({ carga }) {
  const { estado, datos } = carga
  const navigate = useNavigate()

  return (
    <Tarjeta
      className="entregas"
      titulo="Entregas recientes"
      subtitulo="La comida que ya llegó a su destino"
      accion={
        <Boton variante="enlace" to="/solicitudes?estado=Entregada">
          Ver todas
        </Boton>
      }
    >
      {estado === 'error' && <ErrorSeccion carga={carga} />}

      {estado === 'cargando' && (
        <div className="resumen__esqueleto-lista" aria-busy="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Esqueleto key={i} alto={40} />
          ))}
        </div>
      )}

      {estado === 'listo' && datos.length === 0 && (
        <p className="resumen__vacio">Todavía no hay entregas.</p>
      )}

      {estado === 'listo' && datos.length > 0 && (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Beneficiario</th>
                <th scope="col">Registró</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((s) => {
                const ruta = `/solicitudes/${s.id}`
                return (
                  // Toda la fila es clicable; el enlace del título la hace accesible con teclado.
                  <tr key={s.id} className="tabla__fila-enlace" onClick={() => navigate(ruta)}>
                    <td>
                      <Link to={ruta} className="tabla__principal" onClick={(e) => e.stopPropagation()}>
                        {s.donacion_titulo}
                      </Link>
                      {/* Solo se parte en el "·", nunca dentro del código */}
                      <span className="tabla__secundario">
                        <span className="tabla__sin-salto">{s.codigo_pedido}</span> ·{' '}
                        <span className="tabla__sin-salto">{textoAlimentos(s.detalles)}</span>
                      </span>
                    </td>
                    <td>{s.beneficiario?.nombre}</td>
                    <td className="tabla__texto-2">{s.entrega?.registrada_por}</td>
                    <td className="tabla__texto-2 tabla__sin-salto">
                      {s.entrega?.fecha_entrega ? fechaRelativa(s.entrega.fecha_entrega) : ''}
                    </td>
                    <td>
                      <Badge variante="verde">Entregada</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Tarjeta>
  )
}

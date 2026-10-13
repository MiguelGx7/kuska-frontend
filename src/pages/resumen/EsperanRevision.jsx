import { Link } from 'react-router-dom'
import Esqueleto from '../../components/Esqueleto'
import { formatearNumero } from '../../utils/numeros'
import ErrorSeccion from './ErrorSeccion'

const TARJETAS = [
  {
    clave: 'donaciones',
    titulo: 'Donaciones por validar',
    detalle: 'Revisa sus fotos antes de publicarlas',
    ruta: '/donaciones?estado=Pendiente',
  },
  {
    clave: 'solicitudes',
    titulo: 'Solicitudes por aprobar',
    detalle: 'Apruébalas o recházalas',
    ruta: '/solicitudes?estado=Pendiente',
  },
  {
    clave: 'novedades',
    titulo: 'Novedades sin revisar',
    detalle: 'Lo afectado está oculto mientras tanto',
    ruta: '/novedades',
  },
  {
    clave: 'aprobadas',
    titulo: 'Aprobadas por entregar',
    detalle: 'Esperan que se registre la entrega',
    ruta: '/solicitudes?estado=Aprobada',
  },
  {
    clave: 'reclamos',
    titulo: 'Reclamos de entrega',
    detalle: 'Beneficiarios que no recibieron su pedido',
    ruta: '/solicitudes?confirmacion=Reclamada',
  },
]

export default function EsperanRevision({ carga }) {
  const { estado, datos } = carga

  return (
    <section aria-busy={estado === 'cargando'}>
      <h2 className="resumen__titulo-seccion">Esperan tu revisión</h2>

      {estado === 'error' && <ErrorSeccion carga={carga} />}

      {estado === 'cargando' && (
        <div className="revision__grilla">
          {TARJETAS.map(({ clave }) => (
            <Esqueleto key={clave} alto={76} radio="var(--r-card)" />
          ))}
        </div>
      )}

      {estado === 'listo' && (
        <div className="revision__grilla">
          {TARJETAS.map(({ clave, titulo, detalle, ruta }) => {
            const cantidad = datos[clave] ?? 0
            const alDia = cantidad === 0
            return (
              <Link key={clave} to={ruta} className="revision__tarjeta">
                <span className={`revision__numero ${alDia ? 'revision__numero--cero' : ''}`}>
                  {formatearNumero(cantidad)}
                </span>
                <span className="revision__textos">
                  <span className="revision__titulo">{titulo}</span>
                  <span className="revision__detalle">{alDia ? 'Al día' : detalle}</span>
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

import { ImageOff } from 'lucide-react'
import Tarjeta from '../../components/Tarjeta'
import { formatearCantidad } from '../../utils/numeros'

export default function AlimentosPedidos({ solicitud }) {
  return (
    <Tarjeta
      titulo="Alimentos pedidos"
      subtitulo="La entrega es total: se entregan todos los que no estén retirados."
    >
      <ul className="pedidos">
        {solicitud.detalles.map((d) => (
          <li key={d.id} className={`pedido ${d.cancelado ? 'pedido--retirado' : ''}`}>
            {d.foto_url ? (
              <img className="pedido__foto" src={d.foto_url} alt="" loading="lazy" />
            ) : (
              <span className="pedido__foto miniatura--vacia">
                <ImageOff size={18} aria-hidden="true" />
              </span>
            )}
            <div className="pedido__textos">
              <p className="pedido__nombre">{d.nombre}</p>
              {d.cancelado && (
                <p className="pedido__nota">Retirado por una novedad aceptada</p>
              )}
            </div>
            <p className="pedido__cantidad">{formatearCantidad(d.cantidad, d.unidad_medida)}</p>
          </li>
        ))}
      </ul>
    </Tarjeta>
  )
}

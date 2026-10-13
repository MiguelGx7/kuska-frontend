import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Tarjeta from '../../components/Tarjeta'
import { colorEstado } from '../../utils/estados'
import { ROL_ADMINISTRADOR } from './usuario'

// Las 5 solicitudes (beneficiario) o donaciones (donante) más recientes.
export default function ActividadUsuario({ usuario, carga }) {
  const beneficiario = usuario.rol === 'Beneficiario'
  const admin = usuario.rol === ROL_ADMINISTRADOR
  const titulo = beneficiario ? 'Sus solicitudes' : admin ? 'Actividad' : 'Sus donaciones'
  const datos = carga.datos ?? carga.previos

  return (
    <Tarjeta titulo={titulo}>
      {admin && <p className="detalle__vacio">Los administradores no donan ni piden alimentos.</p>}

      {!admin && carga.estado === 'error' && (
        <Aviso
          tipo="error"
          titulo="No pudimos cargar su actividad"
          accion={
            <Boton variante="secundario" onClick={carga.reintentar}>
              Reintentar
            </Boton>
          }
        >
          {obtenerMensajeError(carga.error)}
        </Aviso>
      )}

      {!admin && !datos && carga.estado === 'cargando' && (
        <div className="lista__esqueleto" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <Esqueleto key={i} alto={48} />
          ))}
        </div>
      )}

      {!admin && datos && datos.length === 0 && (
        <p className="detalle__vacio">Todavía no tiene actividad.</p>
      )}

      {!admin && datos && datos.length > 0 && (
        <ul className="actividad">
          {datos.map((item) => {
            const ruta = beneficiario ? `/solicitudes/${item.id}` : `/donaciones/${item.id}`
            const tituloItem = beneficiario ? item.donacion_titulo : item.titulo
            const referencia = beneficiario ? `Pedido ${item.codigo_pedido}` : 'Donación'
            const tipoEstado = beneficiario ? 'solicitud' : 'donacion'
            return (
              <li key={item.id}>
                <Link to={ruta} className="actividad__item">
                  <span className="actividad__textos">
                    <span className="actividad__titulo">{tituloItem}</span>
                    <span className="actividad__referencia">{referencia}</span>
                  </span>
                  <Badge variante={colorEstado(tipoEstado, item.estado)}>{item.estado}</Badge>
                  <ChevronRight className="actividad__flecha" size={16} aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Tarjeta>
  )
}

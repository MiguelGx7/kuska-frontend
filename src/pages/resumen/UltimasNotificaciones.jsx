import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Tarjeta from '../../components/Tarjeta'
import { fechaRelativa } from '../../utils/fechas'
import ErrorSeccion from './ErrorSeccion'

export default function UltimasNotificaciones({ carga }) {
  const { estado, datos } = carga

  return (
    <Tarjeta
      className="notificaciones"
      titulo="Últimas notificaciones"
      accion={
        <Boton variante="enlace" to="/notificaciones">
          Ver todas
        </Boton>
      }
    >
      {estado === 'error' && <ErrorSeccion carga={carga} />}

      {estado === 'cargando' && (
        <div className="resumen__esqueleto-lista" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <Esqueleto key={i} alto={44} />
          ))}
        </div>
      )}

      {estado === 'listo' && datos.length === 0 && (
        <p className="resumen__vacio">No tienes notificaciones.</p>
      )}

      {estado === 'listo' && datos.length > 0 && (
        <ul className="notificaciones__lista">
          {datos.map((n) => (
            <li key={n.id} className="notificaciones__item">
              <span
                className={`notificaciones__punto ${n.leida ? '' : 'notificaciones__punto--nueva'}`}
              />
              <div>
                <p className="notificaciones__mensaje">
                  {!n.leida && <span className="visualmente-oculto">Sin leer: </span>}
                  {n.mensaje}
                </p>
                <p className="notificaciones__fecha">{fechaRelativa(n.fecha)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  )
}

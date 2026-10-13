import { Link } from 'react-router-dom'
import { enlaceDe, horaDe, tipoDe } from './notificacion'

// Una fila de la lista. alMarcar(n) la marca como leída; el enlace también la marca
// (sin esperar la respuesta) y navega.
export default function ItemNotificacion({ notificacion: n, grupo, alMarcar }) {
  const { icono: Icono, tono } = tipoDe(n)
  const enlace = enlaceDe(n)
  const sinLeer = !n.leida

  return (
    <li className={`notificaciones-item ${sinLeer ? 'notificaciones-item--sin-leer' : ''}`}>
      <span
        className={`notificaciones-item__icono notificaciones-item__icono--${tono}`}
        aria-hidden="true"
      >
        <Icono size={18} />
      </span>

      <div className="notificaciones-item__cuerpo">
        <div className="notificaciones-item__cabecera">
          <p className="notificaciones-item__titulo">
            {sinLeer && <span className="visualmente-oculto">Sin leer: </span>}
            {n.titulo}
          </p>
          <span className="notificaciones-item__hora">{horaDe(n, grupo)}</span>
          {sinLeer && <span className="notificaciones-item__punto" aria-hidden="true" />}
        </div>

        <p className="notificaciones-item__mensaje">{n.mensaje}</p>

        {(enlace || sinLeer) && (
          <div className="notificaciones-item__acciones">
            {enlace && (
              <Link
                to={enlace.a}
                className="notificaciones-item__enlace"
                onClick={() => sinLeer && alMarcar(n, { alSalir: true })}
              >
                {enlace.texto}
              </Link>
            )}
            {sinLeer && (
              <button
                type="button"
                className="notificaciones-item__marcar"
                onClick={() => alMarcar(n)}
              >
                Marcar como leída
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

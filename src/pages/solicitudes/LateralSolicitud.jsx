import Badge from '../../components/Badge'
import BotonesContacto from '../../components/BotonesContacto'
import Tarjeta from '../../components/Tarjeta'
import { colorEstado } from '../../utils/estados'
import { fechaHora, fechaRelativa } from '../../utils/fechas'
import { inicialesDe } from '../../utils/nombres'
import { MODALIDAD_SOLICITUD } from './solicitud'

function textoFechaLimite(solicitud) {
  if (solicitud.fecha_limite_recogida) return fechaHora(solicitud.fecha_limite_recogida)
  return solicitud.estado === 'Pendiente' ? 'Se calcula al aprobar' : '—'
}

export default function LateralSolicitud({ solicitud }) {
  const { beneficiario, donante, entrega } = solicitud
  const domicilio = solicitud.modalidad_entrega === 'Domicilio'
  const asunto = `Kumora · pedido ${solicitud.codigo_pedido}`

  return (
    <div className="detalle__lateral">
      <Tarjeta className="lateral" titulo="Beneficiario">
        <div className="persona">
          <span className="persona__avatar" aria-hidden="true">
            {inicialesDe(beneficiario?.nombre)}
          </span>
          <div>
            <p className="persona__nombre">{beneficiario?.nombre}</p>
            {beneficiario?.correo && <p className="persona__tipo">{beneficiario.correo}</p>}
          </div>
        </div>

        <dl className="datos">
          <div>
            <dt>Teléfono</dt>
            <dd>{beneficiario?.telefono || '—'}</dd>
          </div>
          <div>
            <dt>Dirección</dt>
            <dd>{beneficiario?.direccion || '—'}</dd>
          </div>
        </dl>

        <BotonesContacto
          telefono={beneficiario?.telefono}
          correo={beneficiario?.correo}
          asunto={asunto}
        />
      </Tarjeta>

      <Tarjeta className="lateral" titulo="Entrega">
        <dl className="datos">
          <div>
            <dt>Modalidad</dt>
            <dd>{MODALIDAD_SOLICITUD[solicitud.modalidad_entrega] ?? solicitud.modalidad_entrega}</dd>
          </div>
          <div>
            <dt>{domicilio ? 'Dirección de entrega' : 'Dirección de recogida'}</dt>
            <dd>{(domicilio ? solicitud.direccion_entrega : solicitud.direccion_recogida) || '—'}</dd>
          </div>
          <div>
            <dt>Donante</dt>
            <dd>{donante?.nombre || '—'}</dd>
          </div>
          <div>
            <dt>Teléfono del donante</dt>
            <dd>{donante?.telefono || '—'}</dd>
          </div>
          <div>
            <dt>Fecha límite</dt>
            <dd>{textoFechaLimite(solicitud)}</dd>
          </div>
        </dl>

        <p className="lateral__subtitulo">Contactar al donante</p>
        <BotonesContacto telefono={donante?.telefono} correo={donante?.correo} asunto={asunto} />
      </Tarjeta>

      <Tarjeta className="lateral" titulo="Gestión">
        <dl className="datos">
          <div>
            <dt>Gestionada por</dt>
            <dd className="datos__correo">{solicitud.gestionada_por || 'Aún sin gestionar'}</dd>
          </div>
          {solicitud.fecha_gestion && (
            <div>
              <dt>Fecha de gestión</dt>
              <dd>{fechaRelativa(solicitud.fecha_gestion)}</dd>
            </div>
          )}
          {entrega && (
            <>
              <div>
                <dt>Entregada</dt>
                <dd>{fechaHora(entrega.fecha_entrega)}</dd>
              </div>
              <div>
                <dt>Registró</dt>
                <dd className="datos__correo">{entrega.registrada_por || '—'}</dd>
              </div>
              <div>
                <dt>Observación</dt>
                <dd>{entrega.observacion || 'Ninguna'}</dd>
              </div>
            </>
          )}
        </dl>
      </Tarjeta>

      {entrega && (
        <Tarjeta
          className="lateral"
          titulo="Confirmación del beneficiario"
          accion={
            entrega.estado_confirmacion && (
              <Badge variante={colorEstado('confirmacion', entrega.estado_confirmacion)}>
                {entrega.estado_confirmacion}
              </Badge>
            )
          }
        >
          <dl className="datos">
            <div>
              <dt>Plazo para responder</dt>
              <dd>{entrega.confirmar_hasta ? fechaHora(entrega.confirmar_hasta) : '—'}</dd>
            </div>
            <div>
              <dt>Respondió</dt>
              <dd>
                {entrega.fecha_confirmacion
                  ? fechaRelativa(entrega.fecha_confirmacion)
                  : 'Aún no responde'}
              </dd>
            </div>
            <div>
              <dt>Comentario</dt>
              <dd>{entrega.comentario_beneficiario || '—'}</dd>
            </div>
            <div>
              <dt>Respuesta</dt>
              <dd>{entrega.respuesta_admin || '—'}</dd>
            </div>
            <div>
              <dt>Revisada por</dt>
              <dd className="datos__correo">{entrega.revisada_por || '—'}</dd>
            </div>
          </dl>
        </Tarjeta>
      )}
    </div>
  )
}

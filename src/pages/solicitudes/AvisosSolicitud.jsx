import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import BotonesContacto from '../../components/BotonesContacto'
import Caja from '../../components/Caja'
import { fechaHora } from '../../utils/fechas'
import { estaReclamada } from './solicitud'

// Avisos de arriba del detalle, según el estado de la solicitud.
export default function AvisosSolicitud({ solicitud, novedad }) {
  const { estado, beneficiario, donante } = solicitud

  return (
    <>
      {/* a. Novedad sin revisar que detiene la solicitud */}
      {novedad && (estado === 'Pendiente' || estado === 'Aprobada') && (
        <Aviso
          tipo="advertencia"
          titulo="Detenida por una novedad sin revisar"
          accion={
            <Boton variante="enlace" to="/novedades">
              Revisar novedad
            </Boton>
          }
        >
          El donante reportó un problema con «{novedad.alimento_nombre ?? 'toda la donación'}».
          Hasta que revises la novedad, esta solicitud no se puede{' '}
          {estado === 'Pendiente' ? 'aprobar' : 'entregar'} y su plazo no corre.
        </Aviso>
      )}

      {/* b. Aprobada: lo normal es que la entrega la registre el donante */}
      {estado === 'Aprobada' && !novedad && (
        <Caja tono="azul" titulo="Esperando la entrega">
          El donante la registra desde la app cuando entregue los alimentos. Regístrala aquí solo si
          el donante o el beneficiario te confirmaron la entrega.
        </Caja>
      )}

      {/* c. El beneficiario reclamó que no la recibió */}
      {estaReclamada(solicitud) && (
        <Aviso
          tipo="error"
          titulo={`${beneficiario?.nombre} reportó que no recibió el pedido`}
          accion={
            <div className="reclamo__contacto">
              <p>
                Contactar a {donante?.nombre} (donante)
                {donante?.telefono ? ` · ${donante.telefono}` : ''}
              </p>
              <BotonesContacto
                telefono={donante?.telefono}
                correo={donante?.correo}
                asunto={`Kumora · pedido ${solicitud.codigo_pedido}`}
              />
            </div>
          }
        >
          {solicitud.entrega?.comentario_beneficiario && (
            <p className="reclamo__comentario">“{solicitud.entrega.comentario_beneficiario}”</p>
          )}
          <p>
            Antes de responder, pregúntale al donante qué pasó con la entrega. Si alguien falló,
            sanciónalo con este pedido.
          </p>
        </Aviso>
      )}

      {/* d. Motivos de cierre */}
      {estado === 'Rechazada' && solicitud.motivo_rechazo && (
        <Caja tono="rojo" titulo="Motivo del rechazo">
          {solicitud.motivo_rechazo}
        </Caja>
      )}

      {estado === 'Cancelada' && solicitud.motivo_cancelacion && (
        <Caja tono="gris" titulo="Motivo de la cancelación">
          {solicitud.motivo_cancelacion}
        </Caja>
      )}

      {estado === 'No recogida' && (
        <Caja tono="rojo" titulo="No se recogió a tiempo">
          La fecha límite
          {solicitud.fecha_limite_recogida ? ` (${fechaHora(solicitud.fecha_limite_recogida)})` : ''}{' '}
          pasó sin que se registrara la entrega. Las cantidades volvieron a estar disponibles. Si
          corresponde, puedes sancionar desde Usuarios.
        </Caja>
      )}
    </>
  )
}

import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, MessageSquareReply, PackageCheck, X } from 'lucide-react'
import { obtenerMensajeError } from '../../api/errores'
import { listarNovedades } from '../../api/novedades'
import {
  aprobarSolicitud,
  entregarSolicitud,
  obtenerSolicitud,
  rechazarSolicitud,
  responderReclamo,
} from '../../api/solicitudes'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import ModalTexto from '../../components/ModalTexto'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { useContadores } from '../../layout/useContadores'
import { colorEstado } from '../../utils/estados'
import { fechaHoraLarga, fechaRelativa } from '../../utils/fechas'
import AlimentosPedidos from './AlimentosPedidos'
import AvisosSolicitud from './AvisosSolicitud'
import LateralSolicitud from './LateralSolicitud'
import MenuSancionar from './MenuSancionar'
import { estaReclamada, novedadQueDetiene } from './solicitud'
import './Solicitudes.css'

const MIGAS = ['Inicio', 'Solicitudes']

// Solo una solicitud Pendiente o Aprobada puede quedar detenida por una novedad.
const PUEDE_DETENERSE = ['Pendiente', 'Aprobada']

export default function DetalleSolicitud() {
  const { id } = useParams()
  const mostrarToast = useToast()
  const { recargarContadores } = useContadores()

  const cargarDetalle = useCallback(async () => {
    const solicitud = await obtenerSolicitud(id)
    let novedades = []
    if (PUEDE_DETENERSE.includes(solicitud.estado)) {
      // Si falla, no se muestra el aviso: el backend igual bloquea la acción (RN-31).
      novedades = await listarNovedades({ donacion: solicitud.donacion, estado: 'Pendiente' })
        .then((d) => d.results ?? [])
        .catch(() => [])
    }
    return { solicitud, novedades }
  }, [id])
  const carga = useCarga(cargarDetalle)

  // Tras una acción se recarga sin vaciar la pantalla (si los datos previos son de esta solicitud).
  const previos = carga.previos?.solicitud?.id === Number(id) ? carga.previos : null
  const datos = carga.datos ?? (carga.estado === 'cargando' ? previos : null)

  const [aprobando, setAprobando] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null)
  const [modal, setModal] = useState(null) // 'rechazar' | 'entregar' | 'reclamo'

  if (carga.estado === 'error') {
    const noExiste = carga.error?.response?.status === 404
    return (
      <>
        <EncabezadoPagina migas={MIGAS} titulo="Solicitud" />
        {noExiste ? (
          <Aviso
            tipo="error"
            titulo="No encontramos esa solicitud."
            accion={
              <Boton variante="enlace" to="/solicitudes">
                Volver a Solicitudes
              </Boton>
            }
          >
            Puede que el enlace esté mal escrito.
          </Aviso>
        ) : (
          <Aviso
            tipo="error"
            titulo="No pudimos cargar la solicitud"
            accion={
              <Boton variante="secundario" onClick={carga.reintentar}>
                Reintentar
              </Boton>
            }
          >
            {obtenerMensajeError(carga.error)}
          </Aviso>
        )}
      </>
    )
  }

  if (!datos) {
    return (
      <div aria-busy="true">
        <EncabezadoPagina
          migas={MIGAS}
          titulo={<Esqueleto alto={30} ancho={260} />}
          subtitulo={<Esqueleto alto={16} ancho={220} />}
        />
        <div className="detalle">
          <Esqueleto alto={320} radio="var(--r-card)" />
          <div className="detalle__lateral">
            <Esqueleto alto={200} radio="var(--r-card)" />
            <Esqueleto alto={260} radio="var(--r-card)" />
            <Esqueleto alto={120} radio="var(--r-card)" />
          </div>
        </div>
      </div>
    )
  }

  const { solicitud, novedades } = datos
  const novedad = PUEDE_DETENERSE.includes(solicitud.estado)
    ? novedadQueDetiene(solicitud, novedades)
    : null
  const nombre = solicitud.beneficiario?.nombre ?? 'El beneficiario'
  const codigo = solicitud.codigo_pedido

  // Común a todas las acciones: aviso, contadores de la barra y recarga sin vaciar la pantalla.
  function terminarAccion(mensaje) {
    setModal(null)
    setErrorAccion(null)
    mostrarToast(mensaje)
    recargarContadores()
    carga.reintentar()
  }

  async function aprobar() {
    setErrorAccion(null)
    setAprobando(true)
    try {
      const actualizada = await aprobarSolicitud(id)
      const limite = fechaHoraLarga(actualizada.fecha_limite_recogida)
      // La hora ya termina en "a. m." / "p. m.": no se repite el punto final.
      const cierre = limite.endsWith('.') ? '' : '.'
      terminarAccion(
        actualizada.modalidad_entrega === 'Domicilio'
          ? `Solicitud aprobada. El donante debe entregarla antes del ${limite}${cierre}`
          : `Solicitud aprobada. ${nombre} debe recogerla antes del ${limite}${cierre}`,
      )
    } catch (error) {
      setErrorAccion({ titulo: 'No pudimos aprobar la solicitud', error })
    } finally {
      setAprobando(false)
    }
  }

  async function rechazar(motivo) {
    await rechazarSolicitud(id, motivo)
    terminarAccion('Solicitud rechazada. Las cantidades ya están disponibles otra vez.')
  }

  async function entregar(observacion) {
    await entregarSolicitud(id, observacion)
    terminarAccion(`Entrega registrada. ${nombre} tiene 48 horas para confirmar que la recibió.`)
  }

  async function responder(respuesta) {
    await responderReclamo(id, respuesta)
    terminarAccion(`Reclamo respondido. ${nombre} y el donante ya pueden leer tu respuesta.`)
  }

  const cerrarModal = (abierto) => !abierto && setModal(null)

  return (
    <>
      <EncabezadoPagina
        migas={[...MIGAS, codigo]}
        titulo={codigo}
        etiqueta={
          <Badge variante={colorEstado('solicitud', solicitud.estado)}>{solicitud.estado}</Badge>
        }
        subtitulo={`${solicitud.donacion_titulo} · enviada ${fechaRelativa(solicitud.fecha_solicitud)}`}
      >
        {solicitud.estado === 'Pendiente' && (
          <>
            <Boton variante="peligro-suave" icono={X} onClick={() => setModal('rechazar')}>
              Rechazar
            </Boton>
            <Boton icono={Check} cargando={aprobando} disabled={Boolean(novedad)} onClick={aprobar}>
              Aprobar solicitud
            </Boton>
          </>
        )}

        {/* Secundario: lo normal es que la entrega la registre el donante desde la app. */}
        {solicitud.estado === 'Aprobada' && (
          <Boton
            variante="secundario"
            icono={PackageCheck}
            disabled={Boolean(novedad)}
            onClick={() => setModal('entregar')}
          >
            Registrar entrega manualmente
          </Boton>
        )}

        {solicitud.estado === 'Entregada' && estaReclamada(solicitud) && (
          <>
            <MenuSancionar solicitud={solicitud} />
            <Boton icono={MessageSquareReply} onClick={() => setModal('reclamo')}>
              Responder reclamo
            </Boton>
          </>
        )}
      </EncabezadoPagina>

      <div className="detalle__avisos">
        {errorAccion && (
          <Aviso tipo="error" titulo={errorAccion.titulo}>
            {obtenerMensajeError(errorAccion.error)}
          </Aviso>
        )}
        <AvisosSolicitud solicitud={solicitud} novedad={novedad} />
      </div>

      <div className="detalle">
        <AlimentosPedidos solicitud={solicitud} />
        <LateralSolicitud solicitud={solicitud} />
      </div>

      <ModalTexto
        abierto={modal === 'rechazar'}
        alCambiar={cerrarModal}
        titulo="Rechazar solicitud"
        descripcion={`${codigo} de ${nombre}. Las cantidades vuelven a estar disponibles y verá el motivo.`}
        etiqueta="Motivo del rechazo"
        placeholder="Se prioriza a familias sin entregas esta semana."
        obligatorio
        mensajeVacio="Escribe el motivo del rechazo."
        textoBoton="Rechazar solicitud"
        varianteBoton="peligro"
        campoApi="motivo_rechazo"
        tituloError="No pudimos rechazar la solicitud"
        alEnviar={rechazar}
      />

      <ModalTexto
        abierto={modal === 'entregar'}
        alCambiar={cerrarModal}
        titulo="Registrar entrega manualmente"
        descripcion={`Úsalo solo si el donante o ${nombre} te confirmaron que se entregaron todos los alimentos de ${codigo}. Después, ${nombre} tendrá 48 horas para confirmar en la app que lo recibió.`}
        etiqueta="Observación"
        placeholder="Confirmado por llamada con el donante."
        textoBoton="Registrar entrega"
        campoApi="observacion"
        tituloError="No pudimos registrar la entrega"
        alEnviar={entregar}
      />

      <ModalTexto
        abierto={modal === 'reclamo'}
        alCambiar={cerrarModal}
        titulo="Responder reclamo"
        descripcion={`${codigo}. ${nombre} y el donante leerán esta respuesta. Responder no sanciona: si alguien falló, sanciónalo aparte con este pedido.`}
        etiqueta="Respuesta"
        placeholder="Hablamos con el donante y confirmó que no pudo llegar. Ya tomamos medidas."
        obligatorio
        mensajeVacio="Escribe la respuesta al reclamo."
        textoBoton="Enviar respuesta"
        campoApi="respuesta_admin"
        tituloError="No pudimos enviar la respuesta"
        alEnviar={responder}
      />
    </>
  )
}

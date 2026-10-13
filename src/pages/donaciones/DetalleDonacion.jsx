import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { obtenerConfiguracion } from '../../api/configuracion'
import { obtenerDonacion, rechazarDonacion, validarDonacion } from '../../api/donaciones'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Caja from '../../components/Caja'
import Esqueleto from '../../components/Esqueleto'
import ModalTexto from '../../components/ModalTexto'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { useContadores } from '../../layout/useContadores'
import { colorEstado } from '../../utils/estados'
import { fechaDia, fechaRelativa, hoyBogota, sumarDias } from '../../utils/fechas'
import AlimentosDonacion from './AlimentosDonacion'
import { alimentosActivos, textoAlimentos, textoDias } from './donacion'
import LateralDonacion from './LateralDonacion'
import SolicitudesDonacion from './SolicitudesDonacion'
import './Donaciones.css'

const MIGAS = ['Inicio', 'Donaciones']

// Estados en los que la donación ya se publicó y pudo recibir solicitudes.
const CON_SOLICITUDES = ['Validada', 'Agotada', 'Finalizada']

// Alimentos que no cumplen el margen. Misma regla que el backend (fecha_minima_vencimiento):
// un alimento sirve solo si vence DESPUÉS de hoy + margen; vencer ese mismo día ya no alcanza.
// Solo importa mientras está Pendiente (es lo que impide validarla) y solo para los activos.
function alimentosFueraDeMargen(donacion, margen) {
  if (donacion.estado !== 'Pendiente' || margen == null) return []
  const limite = sumarDias(hoyBogota(), margen)
  return alimentosActivos(donacion).filter((a) => a.fecha_vencimiento <= limite)
}

export default function DetalleDonacion() {
  const { id } = useParams()
  const mostrarToast = useToast()
  const { recargarContadores } = useContadores()

  const cargarDetalle = useCallback(
    () =>
      Promise.all([
        obtenerDonacion(id),
        // Si falla la configuración se muestra el detalle sin revisar el margen:
        // el backend vuelve a revisar el vencimiento al validar.
        obtenerConfiguracion().catch(() => null),
      ]).then(([donacion, configuracion]) => ({ donacion, configuracion })),
    [id],
  )
  const carga = useCarga(cargarDetalle)

  // Tras una acción se recarga sin vaciar la pantalla (si los datos previos son de esta donación).
  const previos = carga.previos?.donacion?.id === Number(id) ? carga.previos : null
  const datos = carga.datos ?? (carga.estado === 'cargando' ? previos : null)

  const [validando, setValidando] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null)
  const [rechazoAbierto, setRechazoAbierto] = useState(false)

  if (carga.estado === 'error') {
    const noExiste = carga.error?.response?.status === 404
    return (
      <>
        <EncabezadoPagina migas={MIGAS} titulo="Donación" />
        {noExiste ? (
          <Aviso
            tipo="error"
            titulo="No encontramos esa donación."
            accion={
              <Boton variante="enlace" to="/donaciones">
                Volver a Donaciones
              </Boton>
            }
          >
            Puede que el enlace esté mal escrito.
          </Aviso>
        ) : (
          <Aviso
            tipo="error"
            titulo="No pudimos cargar la donación"
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
          subtitulo={<Esqueleto alto={16} ancho={200} />}
        />
        <div className="detalle">
          <Esqueleto alto={420} radio="var(--r-card)" />
          <div className="detalle__lateral">
            <Esqueleto alto={180} radio="var(--r-card)" />
            <Esqueleto alto={120} radio="var(--r-card)" />
            <Esqueleto alto={110} radio="var(--r-card)" />
          </div>
        </div>
      </div>
    )
  }

  const { donacion, configuracion } = datos
  const margen = configuracion?.margen_vencimiento_dias
  const fueraDeMargen = alimentosFueraDeMargen(donacion, margen)
  const pendiente = donacion.estado === 'Pendiente'
  const primeroFuera = fueraDeMargen[0]

  async function validar() {
    setErrorAccion(null)
    setValidando(true)
    try {
      await validarDonacion(id)
      mostrarToast('Donación validada. Ya es visible para los beneficiarios.')
      recargarContadores()
      carga.reintentar()
    } catch (error) {
      setErrorAccion({ titulo: 'No pudimos validar la donación', error })
    } finally {
      setValidando(false)
    }
  }

  async function rechazar(motivo) {
    await rechazarDonacion(id, motivo)
    setRechazoAbierto(false)
    setErrorAccion(null)
    mostrarToast('Donación rechazada. El donante ya puede ver el motivo.')
    recargarContadores()
    carga.reintentar()
  }

  return (
    <>
      <EncabezadoPagina
        migas={[...MIGAS, donacion.titulo]}
        titulo={donacion.titulo}
        etiqueta={
          <Badge variante={colorEstado('donacion', donacion.estado)}>{donacion.estado}</Badge>
        }
        subtitulo={`Recibida ${fechaRelativa(donacion.fecha_registro)} · ${textoAlimentos(
          alimentosActivos(donacion).length,
        )}`}
      >
        {pendiente && (
          <>
            <Boton variante="peligro-suave" icono={X} onClick={() => setRechazoAbierto(true)}>
              Rechazar
            </Boton>
            <Boton
              icono={Check}
              cargando={validando}
              disabled={fueraDeMargen.length > 0}
              onClick={validar}
            >
              Validar donación
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

        {primeroFuera && (
          <Aviso tipo="error" titulo="Esta donación no se puede validar">
            «{primeroFuera.nombre}» vence el {fechaDia(primeroFuera.fecha_vencimiento)} y el margen
            es de {textoDias(margen)}, así que ya no alcanza a pedirse. Recházala e indícale el motivo
            al donante.
          </Aviso>
        )}

        {donacion.estado === 'Rechazada' && donacion.motivo_rechazo && (
          <Caja tono="rojo" titulo="Motivo del rechazo">
            {donacion.motivo_rechazo}
          </Caja>
        )}
      </div>

      <div className="detalle">
        <AlimentosDonacion
          donacion={donacion}
          fueraDeMargen={fueraDeMargen}
          margen={margen}
        />
        <LateralDonacion donacion={donacion} />
      </div>

      {CON_SOLICITUDES.includes(donacion.estado) && <SolicitudesDonacion idDonacion={donacion.id} />}

      <ModalTexto
        abierto={rechazoAbierto}
        alCambiar={setRechazoAbierto}
        titulo="Rechazar donación"
        descripcion={`«${donacion.titulo}» de ${donacion.donante?.nombre ?? 'el donante'}. El donante verá el motivo y no podrá reenviarla; tendrá que crear una nueva.`}
        etiqueta="Motivo del rechazo"
        placeholder="La foto del queso no permite ver su estado. Crea una nueva donación con una foto clara."
        obligatorio
        mensajeVacio="Escribe el motivo del rechazo."
        textoBoton="Rechazar donación"
        varianteBoton="peligro"
        campoApi="motivo_rechazo"
        tituloError="No pudimos rechazar la donación"
        alEnviar={rechazar}
      />
    </>
  )
}

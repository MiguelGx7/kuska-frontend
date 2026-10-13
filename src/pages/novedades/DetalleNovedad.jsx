import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { obtenerMensajeError } from '../../api/errores'
import { aceptarNovedad, obtenerNovedad, rechazarNovedad } from '../../api/novedades'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import BotonesContacto from '../../components/BotonesContacto'
import Caja from '../../components/Caja'
import Esqueleto from '../../components/Esqueleto'
import ModalTexto from '../../components/ModalTexto'
import { useCarga } from '../../hooks/useCarga'
import { colorEstado } from '../../utils/estados'
import { fechaRelativa } from '../../utils/fechas'
import { inicialesDe } from '../../utils/nombres'
import { formatearNumero } from '../../utils/numeros'
import {
  textoAfectadas,
  textoMientrasRevisas,
  textoSeAvisara,
  textoSiAcepta,
  textoSiRechaza,
  tituloNovedad,
  tituloResuelta,
  toastAceptada,
  toastRechazada,
} from './novedad'

// Carga por id para que /novedades?id=12 funcione aunque no esté en la página actual.
function cargadorDe(id) {
  return id == null ? () => new Promise(() => {}) : () => obtenerNovedad(id)
}

function BotonVolver({ alVolver }) {
  return (
    <Boton variante="enlace" icono={ArrowLeft} className="novedad__volver" onClick={alVolver}>
      Volver a la lista
    </Boton>
  )
}

export default function DetalleNovedad({ id, alVolver, alResolver }) {
  // Sin id (la lista aún carga) la promesa queda pendiente y se ve el esqueleto.
  const cargar = useCallback(() => cargadorDe(id)(), [id])
  const carga = useCarga(cargar)
  const [modal, setModal] = useState(null) // 'aceptar' | 'rechazar'

  // Tras una acción se recarga sin vaciar el panel (si los datos previos son de esta novedad).
  const previos = carga.previos && String(carga.previos.id) === String(id) ? carga.previos : null
  const novedad = carga.datos ?? (carga.estado === 'cargando' ? previos : null)

  if (carga.estado === 'error') {
    const noExiste = carga.error?.response?.status === 404
    return (
      <section className="bandeja__detalle tarjeta">
        <BotonVolver alVolver={alVolver} />
        <Aviso
          tipo="error"
          titulo={noExiste ? 'No encontramos esa novedad.' : 'No pudimos cargar la novedad'}
          accion={
            !noExiste && (
              <Boton variante="secundario" onClick={carga.reintentar}>
                Reintentar
              </Boton>
            )
          }
        >
          {noExiste ? 'Elige otra de la lista.' : obtenerMensajeError(carga.error)}
        </Aviso>
      </section>
    )
  }

  if (!novedad) {
    return (
      <section className="bandeja__detalle tarjeta novedad__esqueleto" aria-busy="true">
        <Esqueleto alto={26} ancho="60%" />
        <Esqueleto alto={16} ancho="40%" />
        <Esqueleto alto={90} radio="var(--r-control)" />
        <Esqueleto alto={140} radio="var(--r-control)" />
      </section>
    )
  }

  const pendiente = novedad.estado === 'Pendiente'
  const afectadas = novedad.solicitudes_afectadas ?? 0
  const { donante } = novedad

  async function aceptar(respuesta) {
    // Se usa el número de antes: tras aceptar, esas solicitudes ya no cuentan como afectadas.
    await aceptarNovedad(novedad.id, respuesta)
    setModal(null)
    alResolver(toastAceptada(afectadas), novedad.id)
    carga.reintentar()
  }

  async function rechazar(respuesta) {
    await rechazarNovedad(novedad.id, respuesta)
    setModal(null)
    alResolver(toastRechazada(novedad), novedad.id)
    carga.reintentar()
  }

  const cerrarModal = (abierto) => !abierto && setModal(null)
  const contacto = [donante?.telefono, donante?.correo].filter(Boolean).join(' · ')

  return (
    <section className="bandeja__detalle tarjeta" aria-label="Detalle de la novedad">
      <BotonVolver alVolver={alVolver} />

      <header className="novedad__cabecera">
        <div className="novedad__titulos">
          <div className="novedad__titulo-fila">
            <h2 className="novedad__titulo">{tituloNovedad(novedad)}</h2>
            <Badge variante={colorEstado('novedad', novedad.estado)}>{novedad.estado}</Badge>
          </div>
          <p className="novedad__subtitulo">
            Donación{' '}
            <Link to={`/donaciones/${novedad.donacion}`}>«{novedad.donacion_titulo}»</Link> ·
            reportada {fechaRelativa(novedad.fecha_creacion)}
          </p>
        </div>

        {pendiente && (
          <div className="novedad__acciones">
            <Boton variante="peligro-suave" icono={X} onClick={() => setModal('rechazar')}>
              Rechazar
            </Boton>
            <Boton icono={Check} onClick={() => setModal('aceptar')}>
              Aceptar novedad
            </Boton>
          </div>
        )}
      </header>

      <div className="novedad__cuerpo">
        <Caja tono="suave" titulo="Lo que reporta el donante">
          {novedad.descripcion}
        </Caja>

        {pendiente && (
          <>
            <div className="novedad__consecuencias">
              <Caja tono="suave" titulo="Si la aceptas">
                <p>{textoSiAcepta(novedad)}</p>
                <p className="novedad__afectadas">
                  <span
                    className={`novedad__numero ${afectadas > 0 ? 'novedad__numero--hay' : ''}`}
                  >
                    {formatearNumero(afectadas)}
                  </span>
                  <span>{textoAfectadas(afectadas)}</span>
                </p>
              </Caja>
              <Caja tono="suave" titulo="Si la rechazas">
                {textoSiRechaza(novedad)}
              </Caja>
            </div>

            <Aviso tipo="advertencia">{textoMientrasRevisas(novedad)}</Aviso>
          </>
        )}

        {!pendiente && (
          <Caja
            tono={novedad.estado === 'Aceptada' ? 'verde' : 'rojo'}
            titulo={tituloResuelta(novedad)}
          >
            <p>{novedad.respuesta_admin || 'Sin respuesta para el donante.'}</p>
            <p className="novedad__revision">
              {[novedad.revisada_por, novedad.fecha_revision && fechaRelativa(novedad.fecha_revision)]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </Caja>
        )}
      </div>

      <div className="novedad__donante">
        <h3 className="novedad__seccion">Donante</h3>
        <div className="persona">
          <span className="persona__avatar" aria-hidden="true">
            {inicialesDe(donante?.nombre)}
          </span>
          <div>
            <p className="persona__nombre">{donante?.nombre}</p>
            {contacto && <p className="persona__tipo">{contacto}</p>}
          </div>
        </div>
        <BotonesContacto
          telefono={donante?.telefono}
          correo={donante?.correo}
          asunto={`Kumora · novedad en «${novedad.donacion_titulo}»`}
        />
      </div>

      <ModalTexto
        abierto={modal === 'aceptar'}
        alCambiar={cerrarModal}
        titulo="Aceptar novedad"
        descripcion={`${textoSiAcepta(novedad)}${textoSeAvisara(afectadas)} No se puede deshacer.`}
        etiqueta="Respuesta al donante"
        placeholder="Gracias por avisar a tiempo."
        textoBoton="Aceptar novedad"
        campoApi="respuesta_admin"
        tituloError="No pudimos aceptar la novedad"
        alEnviar={aceptar}
      />

      <ModalTexto
        abierto={modal === 'rechazar'}
        alCambiar={cerrarModal}
        titulo="Rechazar novedad"
        descripcion={`${textoSiRechaza(novedad)} El donante verá tu respuesta.`}
        etiqueta="Respuesta al donante"
        placeholder="Revisamos las fotos y el alimento está en buen estado."
        obligatorio
        mensajeVacio="Escribe la respuesta para el donante."
        textoBoton="Rechazar novedad"
        varianteBoton="peligro"
        campoApi="respuesta_admin"
        tituloError="No pudimos rechazar la novedad"
        alEnviar={rechazar}
      />
    </section>
  )
}

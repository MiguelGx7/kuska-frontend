import { useId, useRef, useState } from 'react'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'

const MAXIMO = 255

// alRechazar(motivo) hace la petición; si falla, el error se muestra dentro del modal.
export default function ModalRechazo({ abierto, alCambiar, donacion, alRechazar }) {
  const idCampo = useId()
  const refCampo = useRef(null)
  const [motivo, setMotivo] = useState('')
  const [errorCampo, setErrorCampo] = useState(null)
  const [errorApi, setErrorApi] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function cambiarAbierto(valor) {
    if (enviando) return
    if (!valor) {
      // Al cerrar se limpia para la próxima vez.
      setMotivo('')
      setErrorCampo(null)
      setErrorApi(null)
    }
    alCambiar(valor)
  }

  async function enviar(e) {
    e.preventDefault()
    const limpio = motivo.trim()
    if (!limpio) {
      setErrorCampo('Escribe el motivo del rechazo.')
      refCampo.current?.focus()
      return
    }

    setErrorApi(null)
    setEnviando(true)
    try {
      await alRechazar(limpio)
      setMotivo('')
    } catch (error) {
      // Un error del campo va debajo del campo; el resto, en un aviso.
      const delCampo = error?.response?.data?.motivo_rechazo
      if (Array.isArray(delCampo) && delCampo.length) {
        setErrorCampo(delCampo.join(' '))
        refCampo.current?.focus()
      } else {
        setErrorApi(error)
      }
    } finally {
      setEnviando(false)
    }
  }

  const idMensaje = `${idCampo}-mensaje`

  return (
    <Modal
      abierto={abierto}
      alCambiar={cambiarAbierto}
      titulo="Rechazar donación"
      descripcion={`«${donacion.titulo}» de ${donacion.donante?.nombre ?? 'el donante'}. El donante verá el motivo y no podrá reenviarla; tendrá que crear una nueva.`}
    >
      <form id={`${idCampo}-form`} onSubmit={enviar} noValidate>
        <div className={`campo ${errorCampo ? 'campo--error' : ''}`}>
          <label className="campo__etiqueta" htmlFor={idCampo}>
            Motivo del rechazo
          </label>
          <div className="campo__control campo__control--area">
            <textarea
              ref={refCampo}
              id={idCampo}
              className="campo__input"
              value={motivo}
              maxLength={MAXIMO}
              rows={4}
              placeholder="La foto del queso no permite ver su estado. Crea una nueva donación con una foto clara."
              onChange={(e) => {
                setMotivo(e.target.value)
                setErrorCampo(null)
                setErrorApi(null)
              }}
              aria-invalid={errorCampo ? true : undefined}
              aria-describedby={idMensaje}
            />
          </div>
          <div className="campo__pie" id={idMensaje}>
            {errorCampo && <p className="campo__mensaje">{errorCampo}</p>}
            <span className="campo__contador">
              {motivo.length}/{MAXIMO}
            </span>
          </div>
        </div>

        {errorApi && (
          <Aviso tipo="error" titulo="No pudimos rechazar la donación" className="modal__aviso">
            {obtenerMensajeError(errorApi)}
          </Aviso>
        )}

        <div className="modal__pie">
          <Boton variante="secundario" onClick={() => cambiarAbierto(false)} disabled={enviando}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="peligro" cargando={enviando}>
            Rechazar donación
          </Boton>
        </div>
      </form>
    </Modal>
  )
}

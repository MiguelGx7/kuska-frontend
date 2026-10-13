import { useRef, useState } from 'react'
import { obtenerMensajeError } from '../api/errores'
import Aviso from './Aviso'
import Boton from './Boton'
import CampoTexto from './CampoTexto'
import Modal from './Modal'

const MAXIMO = 255

// Modal con un texto libre (motivo, observación, respuesta) y un botón de confirmar.
// alEnviar(texto) hace la petición; si falla, el error se muestra dentro del modal:
// el del campo `campoApi` debajo del textarea, cualquier otro en un aviso.
export default function ModalTexto({
  abierto,
  alCambiar,
  titulo,
  descripcion,
  etiqueta,
  placeholder,
  obligatorio = false,
  mensajeVacio,
  textoBoton,
  varianteBoton = 'principal',
  campoApi,
  tituloError,
  alEnviar,
}) {
  const refCampo = useRef(null)
  const [texto, setTexto] = useState('')
  const [errorCampo, setErrorCampo] = useState(null)
  const [errorApi, setErrorApi] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function cambiarAbierto(valor) {
    if (enviando) return
    if (!valor) {
      // Al cerrar se limpia para la próxima vez.
      setTexto('')
      setErrorCampo(null)
      setErrorApi(null)
    }
    alCambiar(valor)
  }

  async function enviar(e) {
    e.preventDefault()
    const limpio = texto.trim()
    if (obligatorio && !limpio) {
      setErrorCampo(mensajeVacio)
      refCampo.current?.focus()
      return
    }

    setErrorApi(null)
    setEnviando(true)
    try {
      await alEnviar(limpio)
      setTexto('')
    } catch (error) {
      const delCampo = campoApi ? error?.response?.data?.[campoApi] : null
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

  return (
    <Modal abierto={abierto} alCambiar={cambiarAbierto} titulo={titulo} descripcion={descripcion}>
      <form onSubmit={enviar} noValidate>
        <CampoTexto
          ref={refCampo}
          etiqueta={etiqueta}
          opcional={!obligatorio}
          valor={texto}
          maximo={MAXIMO}
          placeholder={placeholder}
          error={errorCampo}
          alCambiar={(valor) => {
            setTexto(valor)
            setErrorCampo(null)
            setErrorApi(null)
          }}
        />

        {errorApi && (
          <Aviso tipo="error" titulo={tituloError} className="modal__aviso">
            {obtenerMensajeError(errorApi)}
          </Aviso>
        )}

        <div className="modal__pie">
          <Boton variante="secundario" onClick={() => cambiarAbierto(false)} disabled={enviando}>
            Cancelar
          </Boton>
          <Boton type="submit" variante={varianteBoton} cargando={enviando}>
            {textoBoton}
          </Boton>
        </div>
      </form>
    </Modal>
  )
}

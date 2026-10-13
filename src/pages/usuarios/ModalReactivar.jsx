import { useState } from 'react'
import { obtenerMensajeError } from '../../api/errores'
import { cambiarEstadoUsuario } from '../../api/usuarios'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'
import { bloqueoTemporalVigente, nombreVisible } from './usuario'

// Qué pasará al reactivar: si tiene un bloqueo vigente, vuelve a Bloqueado.
function textoQuePasara(usuario, tienePermanente) {
  const final = ' Lo que se canceló al inactivarla no se recupera.'
  if (tienePermanente) return `Tiene un bloqueo permanente, así que volverá a Bloqueado.${final}`
  if (bloqueoTemporalVigente(usuario)) {
    return `Tiene un bloqueo temporal vigente, así que volverá a Bloqueado hasta que se cumpla.${final}`
  }
  return `Volverá a Activo y podrá entrar de nuevo.${final}`
}

export default function ModalReactivar({ usuario, tienePermanente, alCambiar, alTerminar }) {
  const nombre = nombreVisible(usuario)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  async function confirmar() {
    setError(null)
    setEnviando(true)
    try {
      const actualizado = await cambiarEstadoUsuario(usuario.id, 'Activo')
      if (actualizado?.estado !== 'Bloqueado') {
        alTerminar(`Cuenta reactivada. ${nombre} ya puede entrar.`)
      } else if (actualizado.bloqueado_hasta) {
        alTerminar('Cuenta reactivada, pero sigue bloqueada hasta que se cumpla su bloqueo.')
      } else {
        alTerminar('Cuenta reactivada, pero sigue con su bloqueo permanente.')
      }
    } catch (err) {
      setError(err)
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      alCambiar={(abierto) => !enviando && alCambiar(abierto)}
      titulo={`Reactivar la cuenta de ${nombre}`}
      descripcion={textoQuePasara(usuario, tienePermanente)}
    >
      {error && (
        <Aviso tipo="error" titulo="No pudimos reactivar la cuenta">
          {obtenerMensajeError(error)}
        </Aviso>
      )}

      <div className="modal__pie">
        <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={enviando}>
          Cancelar
        </Boton>
        <Boton cargando={enviando} onClick={confirmar}>
          Reactivar cuenta
        </Boton>
      </div>
    </Modal>
  )
}

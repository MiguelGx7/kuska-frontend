import { useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { obtenerMensajeError } from '../../api/errores'
import { corregirUsuario } from '../../api/usuarios'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Campo from '../../components/Campo'
import Modal from '../../components/Modal'

// Solo correo y teléfono. Se envía únicamente lo que cambió.
export default function ModalCorregir({ usuario, alCambiar, alTerminar }) {
  const [correo, setCorreo] = useState(usuario.correo ?? '')
  const [telefono, setTelefono] = useState(usuario.telefono ?? '')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const cambios = {}
  if (correo.trim() !== (usuario.correo ?? '')) cambios.correo = correo.trim()
  if (telefono.trim() !== (usuario.telefono ?? '')) cambios.telefono = telefono.trim()
  const hayCambios = Object.keys(cambios).length > 0

  async function guardar(e) {
    e.preventDefault()
    if (!correo.trim()) {
      setErrores({ correo: 'Escribe el correo.' })
      return
    }
    setErrores({})
    setErrorGeneral(null)
    setEnviando(true)
    try {
      await corregirUsuario(usuario.id, cambios)
      alTerminar('Datos de contacto actualizados.')
    } catch (err) {
      // Errores por campo debajo de cada campo; cualquier otro, en un aviso.
      const datos = err?.response?.data
      const porCampo = {}
      for (const campo of ['correo', 'telefono']) {
        if (Array.isArray(datos?.[campo])) porCampo[campo] = datos[campo].join(' ')
      }
      if (Object.keys(porCampo).length) setErrores(porCampo)
      else setErrorGeneral(err)
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      alCambiar={(abierto) => !enviando && alCambiar(abierto)}
      titulo="Corregir datos de contacto"
      descripcion="Solo el correo y el teléfono. Úsalo, por ejemplo, si se registró con el correo mal escrito y no puede recuperar su contraseña."
    >
      <form className="corregir" onSubmit={guardar} noValidate>
        <Campo
          etiqueta="Correo"
          icono={Mail}
          type="email"
          autoComplete="off"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value)
            setErrores((actuales) => ({ ...actuales, correo: undefined }))
          }}
          error={errores.correo}
        />
        <Campo
          etiqueta="Teléfono"
          icono={Phone}
          type="tel"
          autoComplete="off"
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value)
            setErrores((actuales) => ({ ...actuales, telefono: undefined }))
          }}
          error={errores.telefono}
        />

        {errorGeneral && (
          <Aviso tipo="error" titulo="No pudimos guardar los cambios">
            {obtenerMensajeError(errorGeneral)}
          </Aviso>
        )}

        <div className="modal__pie">
          <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={enviando}>
            Cancelar
          </Boton>
          <Boton type="submit" cargando={enviando} disabled={!hayCambios}>
            Guardar cambios
          </Boton>
        </div>
      </form>
    </Modal>
  )
}

import { useRef, useState } from 'react'
import { crearCategoria, actualizarCategoria } from '../../api/categorias'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Campo from '../../components/Campo'
import Modal from '../../components/Modal'

// Crear (categoria = null) o editar una categoría.
export default function ModalCategoria({ categoria, alCambiar, alTerminar }) {
  const editando = Boolean(categoria)
  const refNombre = useRef(null)
  const [nombre, setNombre] = useState(categoria?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? '')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Al editar se envía solo lo que cambió; una descripción vacía se borra (null).
  const cambios = {}
  if (nombre.trim() !== (categoria?.nombre ?? '')) cambios.nombre = nombre.trim()
  if (descripcion.trim() !== (categoria?.descripcion ?? '')) {
    cambios.descripcion = descripcion.trim() || null
  }
  const hayCambios = !editando || Object.keys(cambios).length > 0

  async function guardar(e) {
    e.preventDefault()
    if (!nombre.trim()) {
      setErrores({ nombre: 'Escribe el nombre de la categoría.' })
      refNombre.current?.focus()
      return
    }

    setErrores({})
    setErrorGeneral(null)
    setEnviando(true)
    try {
      if (editando) {
        await actualizarCategoria(categoria.id, cambios)
        alTerminar('Categoría actualizada.')
      } else {
        const datos = { nombre: nombre.trim() }
        if (descripcion.trim()) datos.descripcion = descripcion.trim()
        await crearCategoria(datos)
        alTerminar('Categoría creada. Ya aparece al registrar alimentos.')
      }
    } catch (error) {
      // P. ej. el nombre ya existe: va debajo del campo Nombre.
      const datos = error?.response?.data
      const porCampo = {}
      for (const campo of ['nombre', 'descripcion']) {
        if (Array.isArray(datos?.[campo])) porCampo[campo] = datos[campo].join(' ')
      }
      if (Object.keys(porCampo).length) {
        setErrores(porCampo)
        if (porCampo.nombre) refNombre.current?.focus()
      } else {
        setErrorGeneral(error)
      }
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      alCambiar={(abierto) => !enviando && alCambiar(abierto)}
      titulo={editando ? 'Editar categoría' : 'Nueva categoría'}
    >
      <form className="categorias-formulario" onSubmit={guardar} noValidate>
        <Campo
          ref={refNombre}
          etiqueta="Nombre"
          value={nombre}
          maxLength={60}
          placeholder="Cereales"
          autoComplete="off"
          onChange={(e) => {
            setNombre(e.target.value)
            setErrores((actuales) => ({ ...actuales, nombre: undefined }))
          }}
          error={errores.nombre}
        />
        <Campo
          etiqueta={
            <>
              Descripción <span className="campo__opcional">(opcional)</span>
            </>
          }
          value={descripcion}
          maxLength={255}
          placeholder="Avena, granola"
          autoComplete="off"
          ayuda="Ejemplos que ayuden al donante a elegir bien."
          onChange={(e) => {
            setDescripcion(e.target.value)
            setErrores((actuales) => ({ ...actuales, descripcion: undefined }))
          }}
          error={errores.descripcion}
        />

        {errorGeneral && (
          <Aviso
            tipo="error"
            titulo={editando ? 'No pudimos guardar los cambios' : 'No pudimos crear la categoría'}
          >
            {obtenerMensajeError(errorGeneral)}
          </Aviso>
        )}

        <div className="modal__pie">
          <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={enviando}>
            Cancelar
          </Boton>
          <Boton type="submit" cargando={enviando} disabled={!hayCambios}>
            {editando ? 'Guardar cambios' : 'Crear categoría'}
          </Boton>
        </div>
      </form>
    </Modal>
  )
}

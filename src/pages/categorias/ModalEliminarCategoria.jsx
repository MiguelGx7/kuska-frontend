import { useState } from 'react'
import { actualizarCategoria, eliminarCategoria } from '../../api/categorias'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'
import { toastActivacion } from './categoria'

// Dos estados: confirmar el borrado y, si algún alimento la usa (400), ofrecer inactivarla.
export default function ModalEliminarCategoria({ categoria, alCambiar, alTerminar }) {
  const [enUso, setEnUso] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  async function eliminar() {
    setError(null)
    setEnviando(true)
    try {
      await eliminarCategoria(categoria.id)
      alTerminar('Categoría eliminada.')
    } catch (err) {
      if (err?.response?.status === 400) setEnUso(true)
      else setError({ titulo: 'No pudimos eliminar la categoría', error: err })
      setEnviando(false)
    }
  }

  async function inactivar() {
    setError(null)
    setEnviando(true)
    try {
      await actualizarCategoria(categoria.id, { activa: false })
      alTerminar(toastActivacion(categoria.nombre, false))
    } catch (err) {
      setError({ titulo: 'No pudimos inactivar la categoría', error: err })
      setEnviando(false)
    }
  }

  const titulo = enUso ? `No se puede eliminar «${categoria.nombre}»` : `Eliminar «${categoria.nombre}»`
  const descripcion = enUso
    ? 'Ya hay alimentos registrados con esta categoría. Puedes inactivarla: dejará de aparecer para alimentos nuevos y los que ya la tienen no cambian (RN-17).'
    : 'Solo se puede eliminar si ningún alimento la usa. No se puede deshacer.'

  return (
    <Modal
      abierto
      alCambiar={(abierto) => !enviando && alCambiar(abierto)}
      titulo={titulo}
      descripcion={descripcion}
    >
      {error && (
        <Aviso tipo="error" titulo={error.titulo}>
          {obtenerMensajeError(error.error)}
        </Aviso>
      )}

      <div className="modal__pie">
        {enUso ? (
          <>
            <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={enviando}>
              Cerrar
            </Boton>
            {categoria.activa && (
              <Boton cargando={enviando} onClick={inactivar}>
                Inactivar categoría
              </Boton>
            )}
          </>
        ) : (
          <>
            <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={enviando}>
              Cancelar
            </Boton>
            <Boton variante="peligro" cargando={enviando} onClick={eliminar}>
              Eliminar categoría
            </Boton>
          </>
        )}
      </div>
    </Modal>
  )
}

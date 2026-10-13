import { useCallback, useState } from 'react'
import { obtenerMensajeError } from '../../api/errores'
import { cambiarEstadoUsuario, obtenerImpacto } from '../../api/usuarios'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Modal from '../../components/Modal'
import { useCarga } from '../../hooks/useCarga'
import { nombreVisible } from './usuario'

// Inactivar es una baja, no una sanción. Al abrirse pide lo que pasará.
export default function ModalInactivar({ usuario, alCambiar, alTerminar }) {
  const cargarImpacto = useCallback(() => obtenerImpacto(usuario.id, 'inactivar'), [usuario.id])
  const impacto = useCarga(cargarImpacto)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  async function confirmar() {
    setError(null)
    setEnviando(true)
    try {
      await cambiarEstadoUsuario(usuario.id, 'Inactivo')
      alTerminar('Cuenta inactivada. Se cerraron sus sesiones y lo que tenía en curso.')
    } catch (err) {
      setError(err)
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      alCambiar={(abierto) => !enviando && alCambiar(abierto)}
      titulo={`Inactivar la cuenta de ${nombreVisible(usuario)}`}
      descripcion="Es una baja: no es una sanción y no cuenta para la escala. Esto pasará al confirmar:"
    >
      {impacto.estado === 'cargando' && (
        <div className="lista__esqueleto" aria-busy="true">
          <Esqueleto alto={16} ancho="90%" />
          <Esqueleto alto={16} ancho="75%" />
          <Esqueleto alto={16} ancho="82%" />
        </div>
      )}

      {impacto.estado === 'error' && (
        <Aviso
          tipo="error"
          titulo="No pudimos calcular lo que pasará"
          accion={
            <Boton variante="secundario" onClick={impacto.reintentar}>
              Reintentar
            </Boton>
          }
        >
          {obtenerMensajeError(impacto.error)}
        </Aviso>
      )}

      {impacto.estado === 'listo' && (
        <div className="sancionar">
          {impacto.datos?.aviso && <Aviso tipo="advertencia">{impacto.datos.aviso}</Aviso>}
          {impacto.datos?.resumen?.length > 0 && (
            <ul className="sancionar__resumen">
              {impacto.datos.resumen.map((linea) => (
                <li key={linea}>{linea}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <Aviso tipo="error" titulo="No pudimos inactivar la cuenta" className="modal__aviso">
          {obtenerMensajeError(error)}
        </Aviso>
      )}

      <div className="modal__pie">
        <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={enviando}>
          Cancelar
        </Boton>
        <Boton
          variante="peligro"
          cargando={enviando}
          disabled={impacto.estado !== 'listo'}
          onClick={confirmar}
        >
          Inactivar cuenta
        </Boton>
      </div>
    </Modal>
  )
}

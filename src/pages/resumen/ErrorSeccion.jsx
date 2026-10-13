import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'

export default function ErrorSeccion({ carga }) {
  return (
    <Aviso
      tipo="error"
      titulo="No pudimos cargar esta sección"
      accion={
        <Boton variante="secundario" onClick={carga.reintentar}>
          Reintentar
        </Boton>
      }
    >
      {obtenerMensajeError(carga.error)}
    </Aviso>
  )
}

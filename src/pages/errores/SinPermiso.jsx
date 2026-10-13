import PaginaError from '../../components/PaginaError'
import { useSesion } from '../../auth/useSesion'

// Llega aquí el interceptor cuando el backend dice que la cuenta ya no es de administrador.
// La sesión ya está borrada: "Ir al inicio" termina en el login.
export default function SinPermiso() {
  const { cerrarSesion } = useSesion()

  return (
    <PaginaError
      variante="403"
      codigo="ERROR 403"
      titulo="No tienes permiso para ver esto"
      texto="Esta sección es solo para administradores de Kumora. Si crees que es un error, habla con otro administrador."
      acciones={[
        { texto: 'Cerrar sesión', variante: 'secundario', onClick: cerrarSesion },
        { texto: 'Ir al inicio', variante: 'principal', to: '/' },
      ]}
    />
  )
}

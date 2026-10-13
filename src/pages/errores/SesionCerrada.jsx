import { useNavigate } from 'react-router-dom'
import { tomarRutaDeVuelta } from '../../api/cliente'
import PaginaError from '../../components/PaginaError'

// Llega aquí el cliente de la API cuando no pudo renovar la sesión.
// Antes guardó la ruta en la que estaba; el login vuelve ahí.
export default function SesionCerrada() {
  const navigate = useNavigate()

  function iniciarSesion() {
    const ruta = tomarRutaDeVuelta()
    const desde = ruta ? new URL(ruta, window.location.origin) : null
    navigate('/login', {
      replace: true,
      state: desde ? { desde: { pathname: desde.pathname, search: desde.search, hash: desde.hash } } : undefined,
    })
  }

  return (
    <PaginaError
      variante="401"
      codigo="SESIÓN CERRADA"
      titulo="Tu sesión terminó"
      texto="Por seguridad cerramos la sesión después de un tiempo sin uso, o porque tu contraseña cambió. Inicia sesión de nuevo para seguir."
      acciones={[{ texto: 'Iniciar sesión', variante: 'principal', onClick: iniciarSesion }]}
      nota="Lo que estabas viendo no se perdió: al entrar vuelves a la misma página."
    />
  )
}

import { useEffect, useState } from 'react'
import PaginaError from './PaginaError'
import { useToast } from './toast/useToast'
import './SinConexion.css'

// Capa de "sin conexión" sobre toda la app. Aparece con el evento offline del navegador
// y se quita sola con el evento online. Debe ir dentro de <ToastProvider>.
export default function SinConexion() {
  const mostrarToast = useToast()
  const [enLinea, setEnLinea] = useState(() => navigator.onLine)
  const [sigueSinConexion, setSigueSinConexion] = useState(false)

  useEffect(() => {
    function alPerder() {
      setEnLinea(false)
      setSigueSinConexion(false)
    }
    function alVolver() {
      setEnLinea(true)
      mostrarToast('Volviste a tener conexión.')
    }
    window.addEventListener('offline', alPerder)
    window.addEventListener('online', alVolver)
    return () => {
      window.removeEventListener('offline', alPerder)
      window.removeEventListener('online', alVolver)
    }
  }, [mostrarToast])

  if (enLinea) return null

  function reintentar() {
    if (navigator.onLine) window.location.reload()
    else setSigueSinConexion(true)
  }

  return (
    <div className="sin-conexion" role="alert">
      <PaginaError
        variante="red"
        codigo="SIN CONEXIÓN"
        titulo="No hay conexión a internet"
        texto="Revisa tu wifi o tus datos. Cuando vuelva la conexión, intenta de nuevo; no perdiste nada de lo que escribiste."
        acciones={[{ texto: 'Reintentar', variante: 'principal', onClick: reintentar }]}
        nota={sigueSinConexion ? 'Todavía no hay conexión.' : undefined}
      />
    </div>
  )
}

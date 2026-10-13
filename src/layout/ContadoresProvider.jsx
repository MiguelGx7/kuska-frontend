import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { contarPendientes as contarDonaciones } from '../api/donaciones'
import { contarPendientes as contarSolicitudes } from '../api/solicitudes'
import { contarPendientes as contarNovedades } from '../api/novedades'
import { ContextoContadores } from './contextoContadores'

// Si una petición falla, esa sección queda sin contador (null) y no se muestra error.
function valor(resultado) {
  return resultado.status === 'fulfilled' ? resultado.value : null
}

// Pendientes de la barra lateral. Se recargan en cada cambio de ruta
// y cuando una pantalla llama a recargarContadores() (p. ej. tras validar).
export function ContadoresProvider({ children }) {
  const { pathname } = useLocation()
  const [contadores, setContadores] = useState({})
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let vigente = true

    Promise.allSettled([contarDonaciones(), contarSolicitudes(), contarNovedades()]).then(
      ([donaciones, solicitudes, novedades]) => {
        // Descarta respuestas de una carga anterior.
        if (!vigente) return
        setContadores({
          donaciones: valor(donaciones),
          solicitudes: valor(solicitudes),
          novedades: valor(novedades),
        })
      },
    )

    return () => {
      vigente = false
    }
  }, [pathname, version])

  const recargarContadores = useCallback(() => setVersion((v) => v + 1), [])

  const valorContexto = useMemo(
    () => ({ contadores, recargarContadores }),
    [contadores, recargarContadores],
  )

  return <ContextoContadores.Provider value={valorContexto}>{children}</ContextoContadores.Provider>
}

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { contarPendientes as contarDonaciones } from '../api/donaciones'
import { contarPendientes as contarSolicitudes } from '../api/solicitudes'
import { contarPendientes as contarNovedades } from '../api/novedades'

// Si una petición falla, esa sección queda sin contador (null) y no se muestra error.
function valor(resultado) {
  return resultado.status === 'fulfilled' ? resultado.value : null
}

// Pendientes de la barra lateral. Se recargan en cada cambio de ruta.
export function useContadores() {
  const { pathname } = useLocation()
  const [contadores, setContadores] = useState({})

  useEffect(() => {
    let vigente = true

    Promise.allSettled([contarDonaciones(), contarSolicitudes(), contarNovedades()]).then(
      ([donaciones, solicitudes, novedades]) => {
        // Descarta respuestas de una ruta anterior.
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
  }, [pathname])

  return contadores
}

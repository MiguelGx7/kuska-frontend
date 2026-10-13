import { useCallback, useEffect, useState } from 'react'

const CARGANDO = { estado: 'cargando', datos: null, error: null }

// Ejecuta `cargar` al montar y expone { estado, datos, error, reintentar }.
// estado: 'cargando' | 'listo' | 'error'.
// `cargar` debe ser estable (definida fuera del componente o con useCallback).
export function useCarga(cargar) {
  const [resultado, setResultado] = useState(CARGANDO)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true
    cargar()
      .then((datos) => {
        if (vigente) setResultado({ estado: 'listo', datos, error: null })
      })
      .catch((error) => {
        if (vigente) setResultado({ estado: 'error', datos: null, error })
      })
    return () => {
      vigente = false
    }
  }, [cargar, intento])

  const reintentar = useCallback(() => {
    setResultado(CARGANDO)
    setIntento((n) => n + 1)
  }, [])

  return { ...resultado, reintentar }
}
